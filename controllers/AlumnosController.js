const Alumno = require('../models/Alumno.js');
const PersonaAbstractFactory = require('../models/Persona.js');

module.exports = function (app) {

    /**
 * Maneja la solicitud GET para obtener una lista de alumnos.
 *
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
    app.get('/alumnos', async (req, res) => {
        try {
            // Consulta la base de datos para obtener una lista de alumnos
            const alumnos = await Alumno.find();
            // Crea una instancia de la fábrica PersonaFactory
            const personaFactory = new PersonaAbstractFactory();

            // Convierte los datos de alumnos en objetos Alumno utilizando la fábrica
            const alumnosObjetos = alumnos.map(alumno => personaFactory.crearAlumno(
                alumno.cedula,
                alumno.nombre,
                alumno.telefono,
                alumno.email,
                alumno.fecha_de_nacimiento,
                alumno.carrera
            ));

            // Envia la lista de alumnos como respuesta a la solicitud
            res.send(alumnosObjetos);
        } catch (err) {
            // En caso de error, responde con un código de estado HTTP 500 (Error interno del servidor)
            res.status(500).send(err);
            console.log(err)
        }
    });

    //http://localhost:3000/alumno/nombre/Luis Morales
    app.get('/alumnos/nombre/:nombre', async (req, res) => {
        try {
            const alumnos = await Alumno.find({ nombre: req.params.nombre });
            res.send(alumnos);
        } catch (err) {
            res.status(500).send(err);
        }
    });


    //http://localhost:3000/alumno/cedula/32004024
    app.get('/alumnos/cedula/:cedula', async (req, res) => {
        try {
            const alumnos = await Alumno.find({ cedula: req.params.cedula });
            res.send(alumnos);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    //http://localhost:3000/alumnos/carrera/IT01
    app.get('/alumnos/carrera/:carreraCodigo', async (req, res) => {
        try {
            const alumnos = await Alumno.find({ carrera: req.params.carreraCodigo });
            res.send(alumnos);
        } catch (err) {
            res.status(500).send(err);
        }
    });

}