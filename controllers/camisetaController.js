const Camiseta = require('../models/camiseta');
const Usuario = require('../models/Usuario');
exports.getCamisetas = async (req, res) => {
  try {
// Supongamos que ya tenemos una lista de camisetas obtenida de la base de datos:
const camisetas = await Camiseta.find();  // Lista de camisetas desde la coleccion (ejemplo)
// Enriquecer cada camiseta con datos del usuario creador:
const camisetasConUsuario = await Promise.all(
  camisetas.map(async (c) => {
    try {
      // Buscar al usuario por ID (c.creador) y seleccionar solo nombre y correo
      const usuario = await Usuario.findById(c.creador).select('nombre correo');
      return {
        ...c.toObject(),        // Convertir el documento de Mongoose a objeto plano JS
        creador: usuario || null // Reemplazar el campo 'creador' con los datos del usuario (o null si no se encontró)
      };
    } catch (error) {
      // En caso de error al buscar usuario, devolvemos la camiseta con 'creador' null
      return {
        ...c.toObject(),
        creador: null
      };
    }
  })
);
    res.json(camisetasConUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};


exports.getCamisetasorderbycalificacion = async (req, res) => {
  try {
// Supongamos que ya tenemos una lista de camisetas obtenida de la base de datos:
const camisetas = await Camiseta.find().sort({calificacion:-1});  // Lista de camisetas desde la coleccion (ejemplo)
// Enriquecer cada camiseta con datos del usuario creador:
const camisetasConUsuario = await Promise.all(
  camisetas.map(async (c) => {
    try {
      // Buscar al usuario por ID (c.creador) y seleccionar solo nombre y correo
      const usuario = await Usuario.findById(c.creador).select('nombre correo');
      return {
        ...c.toObject(),        // Convertir el documento de Mongoose a objeto plano JS
        creador: usuario || null // Reemplazar el campo 'creador' con los datos del usuario (o null si no se encontró)
      };
    } catch (error) {
      // En caso de error al buscar usuario, devolvemos la camiseta con 'creador' null
      return {
        ...c.toObject(),
        creador: null
      };
    }
  })
);
    res.json(camisetasConUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};





exports.getCamisetaById = async (req, res) => {
  try {
    const camiseta = await Camiseta.findById(req.params.id);
    if (!camiseta) return res.status(404).json({ error: 'camiseta no encontrada' });
    res.json(camiseta);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.createCamiseta = async (req, res) => {
  try {
  
  
    const nuevaCamiseta = new Camiseta(req.body);
    nuevaCamiseta.creador = req.usuarioId;
    camisetaGuardada = await nuevaCamiseta.save();
    res.status(201).json(camisetaGuardada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear la camiseta' });
  }
};

exports.updateCamiseta = async (req, res) => {
  try {
    const camisetaActualizada = await Camiseta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!camisetaActualizada) return res.status(404).json({ error: 'camiseta no encontrada' });
    res.json(camisetaActualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar camiseta' });
  }
};




exports.updateCamisetaCalificacion = async (req, res) => {
  try {
    const incremento = Number(req.body.calificacion); // valor que se va a sumar
console.log(incremento)
    if (isNaN(incremento)) {
      return res.status(400).json({ error: 'El valor de calificación debe ser numérico' });
    }

    const camiseta = await Camiseta.findById(req.params.id);
    if (!camiseta) {
      return res.status(404).json({ error: 'Camiseta no encontrada' });
    }
   console.log(camiseta)
    // Sumar al valor actual
    camiseta.calificacion += incremento;

    // Guardar los cambios
    await camiseta.save();

    res.json(camiseta);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la calificación' });
  }
};
exports.deleteCamiseta = async (req, res) => {
  try {
    const camisetaEliminada = await Camiseta.findByIdAndDelete(req.params.id);
    if (!camisetaEliminada) return res.status(404).json({ error: 'camiseta no encontrado' });
    res.json({ message: 'camiseta eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};