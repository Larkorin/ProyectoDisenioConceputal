const mongoose = require('mongoose');

const alumnoSchema = new mongoose.Schema({
    cedula: String,
    nombre: String,
    telefono: String,
    email: String,
    fecha_de_nacimiento: Date,
    carrera: String
});

module.exports = mongoose.model('Alumno', alumnoSchema, 'Alumno');
