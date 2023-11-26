const { carrerasEmitter } = require('./ Observer.js'); // Ruta del archivo que contiene el controlador de eventos/observer

carrerasEmitter.on('carreraUpdate', (codigoCarrera) => {
    // Aquí puedes realizar las acciones necesarias cuando se actualiza una carrera
    console.log(`Carrera actualizada: ${codigoCarrera}`);
});

matriculaEmitter.on('matriculaUpdate', (cedula) => {
    // Aquí puedes realizar las acciones necesarias cuando se actualiza una carrera
    console.log(`Curso actualizado de matricula: ${cedula}`);
});



matriculaBorraEmitter.on('matriculaBorraUpdate', (cedula) => {
    // Aquí puedes realizar las acciones necesarias cuando se actualiza una carrera
    console.log(`Curso Eliminado de matricula: ${cedula}`);
});