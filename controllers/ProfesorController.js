const Profesor = require("../models/Profesor.js");
const PersonaAbstractFactory = require('../models/Persona.js');

const fabrica = new PersonaAbstractFactory();

module.exports = function (app) {
  //http://localhost:3000/profesor/nombre/Juan Perez
  app.get("/profesor/nombre/:nombre", async (req, res) => {
    try {
      const profes = await Profesor.find({ nombre: req.params.nombre });
      console.log(profes)
      res.send(profes);

      if (profes.length === 0) {
        return res.status(404).send("Profesor no encontrado");
      }

      const profesorEncontrado = profes[0];

      // Utilizar la fábrica abstracta para crear un nuevo profesor con la información encontrada
      const fabrica = new PersonaAbstractFactory();
      const nuevoProfesor = fabrica.crearProfesor(
        profesorEncontrado.cedula,
        profesorEncontrado.nombre,
        profesorEncontrado.telefono,
        profesorEncontrado.email
      );

      // Enviar el nuevo profesor como respuesta
      res.send(nuevoProfesor);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  //http://localhost:3000/profesor/cedula/2340943243
  app.get("/profesor/cedula/:cedula", async (req, res) => {
    try {
      const profes = await Profesor.find({ cedula: req.params.cedula });
      
      if (profes.length === 0) {
        return res.status(404).send("Profesor no encontrado");
      }

      const profesorEncontrado = profes[0];

      // Utilizar la fábrica abstracta para crear un nuevo profesor con la información encontrada
      const fabrica = new PersonaAbstractFactory();
      const nuevoProfesor = fabrica.crearProfesor(
        profesorEncontrado.cedula,
        profesorEncontrado.nombre,
        profesorEncontrado.telefono,
        profesorEncontrado.email
      );

      // Enviar el nuevo profesor como respuesta
      res.send(nuevoProfesor);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  //http://localhost:3000/profesor
  app.post("/profesor", async (req, res) => {
    try {
      // Obtener los datos del cuerpo de la solicitud (request body)
      const { cedula, nombre, telefono, email } = req.body;

      // Utilizar la fábrica para crear una nueva instancia de profesor
      const nuevoProfesor = fabrica.crearProfesor(
        cedula,
        nombre,
        telefono,
        email
      );

      // Guardar el nuevo profesor en la base de datos utilizando Mongoose
      const profesorGuardado = await nuevoProfesor.save();

      res.status(201).send(profesorGuardado);
    } catch (err) {
      res.status(500).send(err);
      console.log(err)
    }
  });
};
