const EventEmitter = require('events');
const carrerasEmitter = new EventEmitter();
const matriculaEmitter = new EventEmitter();
const matriculaEmitter = new EventEmitter();

// Función para emitir eventos cuando se modifica una carrera
const emitCarreraUpdate = (codigoCarrera) => {
    carrerasEmitter.emit('carreraUpdate', codigoCarrera);
};

const emitMatriculaUpdate = (cedula) => {
    matriculaEmitter.emit('matriculaUpdate', cedula);
};

const emitMatriculaBorraUpdate = (cedula) => {
    matriculaBorraEmitter.emit('matriculaBorraUpdate', cedula);
};


module.exports = {
    carrerasEmitter,
    emitCarreraUpdate,
    matriculaEmitter,
    emitMatriculaUpdate,
    matriculaBorraEmitter,
    emitMatriculaBorraUpdate
};