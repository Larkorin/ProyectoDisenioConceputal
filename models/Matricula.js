// models/Matricula.js

const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
    codigo : String
})

const matriculaSchema = new mongoose.Schema({
  cedula: String,
  cursos : [cursoSchema]
});

module.exports = mongoose.model('Matricula', matriculaSchema, 'Matricula');