// models/Profesor.js

const mongoose = require('mongoose');

const profesorSchema = new mongoose.Schema({
  cedula: String,
  nombre: String,
  telefono: String,
  email: String
});

module.exports = mongoose.model('Profesor', profesorSchema, 'Profesor');