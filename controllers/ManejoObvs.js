const { carrerasEmitter } = require('./ Observer.js'); // Ruta del archivo que contiene el controlador de eventos/observer

carrerasEmitter.on('carreraUpdate', (codigoCarrera) => {
    // Aquí puedes realizar las acciones necesarias cuando se actualiza una carrera
    console.log(`Carrera actualizada: ${codigoCarrera}`);
});