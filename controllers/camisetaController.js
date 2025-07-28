const Camiseta = require('../models/Camiseta');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.getCamisetas = async (req, res) => {
  try {
    const Camiseta = await Camiseta.find();
    res.json(Camiseta);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.getCamisetaById = async (req, res) => {
  try {
    const Camiseta = await Camiseta.findById(req.params.id);
    if (!Camiseta) return res.status(404).json({ error: 'Camiseta no encontrado' });
    res.json(Camiseta);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' }); 
  }
};

exports.createCamiseta = async (req, res) => {
  try {
   
        // 1. Generar un salt (semilla aleatoria) para el hash

  const nuevoCamiseta = new Camiseta(req.body);
   CamisetaGuardada= await nuevoCamiseta.save();
    

    res.status(201).json(CamisetaGuardada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear camiseta' });
  }
};

exports.updateCamiseta = async (req, res) => {
  try {
    const CamisetaActualizada = await Camiseta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!CamisetaActualizada) return res.status(404).json({ error: 'Camiseta no encontrado' });
    res.json(CamisetaActualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
};

exports.deleteCamiseta = async (req, res) => {
  try {
    const CamisetaEliminada = await Camiseta.findByIdAndDelete(req.params.id);
    if (!CamisetaEliminada) return res.status(404).json({ error: 'Camiseta no encontrado' });
    res.json({ message: 'Camiseta eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};
