// controllers/CarreraController.js

const Carrera = require('../models/Carrera.js');
const IteratorLab = require('./Iterator.js');
// Ruta del archivo que contiene el manejador de eventos
const { carrerasEmitter, emitCarreraUpdate } = require('./Observer.js'); 
module.exports = function(app) {


    /**
 * Maneja la solicitud GET para obtener la lista de cursos de una carrera específica 
 * implementando el patron Iterador.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
     //http://localhost:3000/carrera/codigo/IT09/cursos
     app.get('/carrera/codigo/:codigo/cursos', async (req, res) => {
        try {
            // Busca la carrera en la base de datos por su código y selecciona solo la lista de cursos
            const carrera = await Carrera.findOne({ codigo: req.params.codigo }, { cursos: 1, _id: 0 });

            if (carrera) {
                // Crea un iterador para recorrer la lista de cursos
                const cursosIterator = new IteratorLab(carrera.cursos);

                const cursos = [];

                // Recorre la lista de cursos utilizando el iterador y agrega cada curso a la lista "cursos"
                cursosIterator.each(course => {
                    cursos.push(course);
                });

                // Envía la lista de cursos como respuesta a la solicitud
                res.send(cursos);
            } else {
                // Responde con un código de estado HTTP 404 si la carrera no se encuentra
                res.status(404).send({ message: "Carrera not found" });
            }
        } catch (err) {
            console.error(err);
            // En caso de error, responde con un código de estado HTTP 500 (Error interno del servidor)
            res.status(500).send(err);
        }
    });

    //http://localhost:3000/carrera/nombre/Ingeniería en Sistemas Computacionales
    app.get('/carrera/nombre/:nombre', async (req, res) => {
        try {
            const carrera = await Carrera.find({ nombre: req.params.nombre });
            res.send(carrera);
        } catch (err) {
            res.status(500).send(err);
        }
    });


    //http://localhost:3000/carrera/codigo/IT09
    app.get('/carrera/codigo/:codigo', async (req, res) => {
        try {
            const carrera = await Carrera.findOne({ codigo: req.params.codigo });
            if (carrera) {
                res.send(carrera);
            } else {
                res.status(404).send({ message: "Carrera not found" });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });



    /*
    POST
    http://localhost:3000/carrera/codigo/IT09/agregar-curso
    {
    "codigo": "7",
    "año": 1,
    "ciclo": 2
    }
    */

    app.post('/carrera/codigo/:codigo/agregar-curso', async (req, res) => {
        const { codigo, año, ciclo } = req.body;

        try {
            const result = await Carrera.updateOne(
                { codigo: req.params.codigo },
                { $push: { cursos: { codigo, año, ciclo } } }
            );

            if (result.modifiedCount > 0) {
                res.send({ message: "Course added successfully to Carrera." });
            } else {
                res.status(404).send({ message: "Carrera not found" });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });

    /*
    DELETE
    http://localhost:3000/carrera/codigo/IT01/quitar-curso/7
    */

    app.delete('/carrera/codigo/:codigo/quitar-curso/:cursoCodigo', async (req, res) => {
        try {
            const result = await Carrera.updateOne(
                { codigo: req.params.codigo },
                { $pull: { cursos: { codigo: req.params.cursoCodigo } } }
            );
            
            // Revisar si el documento fue encontrado o modificado. 
            if (result.matchedCount > 0 && result.modifiedCount > 0) {

            // Se notifica a los observadores de que se ha modificado una carrera
                emitCarreraUpdate(req.params.codigo);

                res.send({ message: "Course removed successfully!" });

            } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
                res.status(404).send({ message: "Course not found in this Carrera" });
            } else {
                res.status(404).send({ message: "Carrera not found" });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });

    
    //Encontrar Cursos por Carrera y Ciclo
    /*
    En esta funcion HTTP se puede implementar el patron Iterador
    A la hora que se filtra la informacion y se consigue los cursos de la carrera seleccionada, se puede llamar al patron iterador
    debido a que la respuesta de la consulta HTTP devolvera una lista en forma JSON. El iterador pasaria por cada dato dentro de la lista
    y se podria guardar en una variable en forma de lista.
     */
    app.get('/carrera/codigo/:carreraCodigo/ciclo/:ciclo', async (req, res) => {
        const carreraCodigo = req.param.carreraCodigo;
        const cicloSeleccionado = parseInt(req.params.ciclo);

        try {
            const carrera = await Carrera.findOne({ codigo: req.params.carreraCodigo });
            console.log(carrera);

            if (!carrera) {
                res.status(404).send({ message: "Carrera not found with code ${carreraCodigo}" });
            } else if (!carrera.cursos) {
                res.status(404).send({ message: "Carrera with code ${carreraCodigo} does not have Cursos associated" });
            } else {
                const cursos = carrera.cursos.filter((curso) => curso.ciclo === cicloSeleccionado);
                res.json(cursos);
            }
        } catch (err) {
            res.status(500).send({ message: "No funciona" });
        }
    });


    //Eliminar Carrera
    //DELETE http://localhost:3000/carrera/eliminar/IT09
    app.delete('/carrera/eliminar/:codigo', async (req, res) => {
        try {
            const codigoCarrera = req.params.codigo;
            const resultado = await Carrera.deleteOne({ codigo: codigoCarrera });
    
            if (resultado.deletedCount === 0) {
                return res.status(404).send({ message: 'Carrera no encontrada.' });
            }
    
            res.status(200).send({ message: 'Carrera eliminada exitosamente.' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al eliminar la carrera' });
        }
    });

}


