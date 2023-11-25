// models/Ciclo.js

const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  codigo: Number,
  annio: Number,
  numero: Number,
  fecha_de_inicio: String,
  fecha_de_finalizacion: String,
  activo: Boolean
});

module.exports = mongoose.model('Ciclo', cicloSchema, 'Ciclo');
