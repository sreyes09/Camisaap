const Camiseta = require('../models/Camiseta');
const Usuario = require('../models/Usuario');

exports.getCamisetas = async (req, res) => {
  try {
    // Traemos y resolvemos creador (nombre/correo). Mantengo tu enfoque.
    const camisetas = await Camiseta.find().sort({ createdAt: -1 });
    const camisetasConUsuario = await Promise.all(
      camisetas.map(async (c) => {
        try {
          const usuario = await Usuario.findById(c.creador).select('nombre correo');
          return {
            ...c.toObject(),
            creador: usuario || null
          };
        } catch {
          return {
            ...c.toObject(),
            creador: null
          };
        }
      })
    );
    res.json(camisetasConUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.getCamisetaById = async (req, res) => {
  try {
    const camiseta = await Camiseta.findById(req.params.id);
    if (!camiseta) return res.status(404).json({ error: 'Camiseta no encontrada' });
    res.json(camiseta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.createCamiseta = async (req, res) => {
  try {
    const nuevaCamiseta = new Camiseta(req.body);
    nuevaCamiseta.creador = req.usuarioId; // del middleware verificarToken
    const camisetaGuardada = await nuevaCamiseta.save();
    res.status(201).json(camisetaGuardada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear camiseta' });
  }
};

exports.updateCamiseta = async (req, res) => {
  try {
    const camisetaActualizada = await Camiseta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!camisetaActualizada) return res.status(404).json({ error: 'Camiseta no encontrada' });
    res.json(camisetaActualizada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al actualizar camiseta' });
  }
};

exports.deleteCamiseta = async (req, res) => {
  try {
    const camisetaEliminada = await Camiseta.findByIdAndDelete(req.params.id);
    if (!camisetaEliminada) return res.status(404).json({ error: 'Camiseta no encontrada' });
    res.json({ message: 'Camiseta eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

/**
 * PUT /api/camisetas/vota/:id
 * Body: { valor: 1 | -1 }
 * Suma o resta a la calificación usando $inc (acumulativo y atómico).
 */
exports.calificarcamiseta = async (req, res) => {
  try {
    const id = req.params.id;
    const inc = Number(req.body.valor); // esperamos { valor: 1 } o { valor: -1 }

    if (![1, -1].includes(inc)) {
      return res.status(400).json({ error: 'Valor de voto inválido (usa 1 o -1)' });
    }

    const actualizada = await Camiseta.findByIdAndUpdate(
      id,
      { $inc: { calificacion: inc } }, // acumulativo
      { new: true }
    );

    if (!actualizada) {
      return res.status(404).json({ error: 'Camiseta no encontrada' });
    }

    res.json(actualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de servidor' });
  }
};
