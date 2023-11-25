// models/Curso.js

const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  codigo: String,
  nombre: String,
  creditos: Number,
  horas_semanales: Number
});

module.exports = mongoose.model('Curso', cursoSchema, 'Curso');
