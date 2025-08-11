const mongoose = require('mongoose');

const camisetaSchema = new mongoose.Schema({
  torsoColor: String,
  mangaIzqColor: String,
  mangaDerColor: String,
  cuelloIzqColor: String,
  cuelloDerColor: String,
  creador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  fechaCreacion: { type: Date, default: Date.now },
  calificacion: { type: Number, default: 0 } // 👈 Aquí se inicializa
});

module.exports = mongoose.model('Camiseta', camisetaSchema);
