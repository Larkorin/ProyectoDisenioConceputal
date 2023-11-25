// models/Carrera.js

const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  codigo: String,
  año: Number,
  ciclo: Number
});

const carreraSchema = new mongoose.Schema({
  codigo: String,
  nombre: String,
  titulo: String,
  cursos: [cursoSchema]
});

module.exports = mongoose.model('Carrera', carreraSchema, 'Carrera');
