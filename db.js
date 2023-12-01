const mongoose = require('mongoose');

// Instancia única de la conexión a la base de datos.
let connectionInstance;

/**
 * Conecta a la base de datos MongoDB utilizando Mongoose.
 * Este método implementa el patrón Singleton para asegurar que solo exista
 * una instancia de la conexión a la base de datos en todo momento.
 * 
 * @returns {Promise} Una promesa que resuelve a la instancia de la conexión a la base de datos.
 */
async function connectDB() {
    // Verifica si ya existe una instancia de la conexión.
    if (!connectionInstance) {
        try {
            // Si no existe, crea una nueva conexión.
            connectionInstance = await mongoose.connect('mongodb://localhost:27017/ProyectoClase', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Conexión a MongoDB exitosa.');
        } catch (err) {
            console.error(err);
        }
    }
    // Devuelve la instancia existente o la recién creada.
    return connectionInstance;
}

module.exports = connectDB;
