// controllers/MatriculaController.js

const Grupo = require("../models/Grupo.js");

module.exports = function (app) {
  //http://localhost:3000/grupo/profesor/:cedula/ciclo-activo/1 a la Programación
  app.get(
    "/grupo/profesor/:cedulaProfesor/ciclo-activo/:cicloActivo",
    async (req, res) => {
      try {
        const cedulaProfesor = req.params.cedulaProfesor;
        const cicloActivo = parseInt(req.params.cicloActivo);

        const grupos = await Grupo.find({
          profesor: cedulaProfesor,
          ciclo: cicloActivo,
        }).toArray();

        if (grupos.length === 0) {
          res
            .status(404)
            .send({ message: "No tienes grupos asignados en este ciclo." });
        } else {
          const grupoSeleccionado = grupos[0];
          res.status(200).send(grupoSeleccionado);
        }
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ message: "Error al obtener los grupos del profesor" });
      }
    }
  );

  //http://localhost:3000/grupo/1/cedula-estudiante/:cedula/actualizar-notas/notas/85 a la Programación
  app.post("/registrar-notas/:grupoId", async (req, res) => {
    const grupoId = req.params.grupoId;
    const notas = req.body.notas; // Espera un objeto con las notas

    try {
      const grupo = await Grupo.findById(grupoId).exec();

      if (!grupo) {
        res.status(404).send({ message: "Grupo no encontrado." });
      } else {
        if (grupo.estudiantes) {
          for (const estudiante of grupo.estudiantes) {
            const cedula = estudiante.cedula;
            if (notas[cedula] !== undefined) {
              estudiante.nota = notas[cedula]; // Actualiza la nota
            }
          }
          await grupo.save(); // Guarda las actualizaciones en el grupo
          res.send({ mensaje: "Notas actualizadas con éxito." });
        } else {
          res
            .status(404)
            .send({ message: "No hay estudiantes en este grupo." });
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  //Encontrar Grupos por Curso
  app.get("/grupo/:cursoSeleccionado", async (req, res) => {
    const cursoSeleccionado = parseInt(req.params.cursoSeleccionado);

    try {
      const grupos = await Grupo.find({ curso: cursoSeleccionado });

      if (grupos.length === 0) {
        res
          .status(404)
          .send({
            mensaje: `No hay grupos disponibles para el curso con código ${cursoSeleccionado}`,
          });
      } else {
        res.send(grupos);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  //Modificar asistencia
  app.put(
    "/grupo/:cursoSeleccionado/cedulaAlumno/:cedulaAlumno/asistencia/:tipoAsistencia",
    async (req, res) => {
      const cursoSeleccionado = parseInt(req.params.cursoSeleccionado);
      const cedulaAlumno = req.params.cedulaAlumno;
      const tipoAsistencia = req.params.tipoAsistencia;

      try {
        const grupos = await Grupo.find({ curso: cursoSeleccionado });

        if (grupos.length === 0) {
          res
            .status(404)
            .send({
              mensaje: `No hay grupos disponibles para el curso con código ${cursoSeleccionado}`,
            });
        } else {
          const estudiante = grupo.estudiantes.find(est => est.cedula === cedulaAlumno) || {};
          
          if (!estudiante.cedula) {
            return res.status(404).send('Estudiante no encontrado en este grupo');
          }

          switch (tipoAsistencia) {
            case 'ausencias':
              estudiante.asistencia_ausencias += 1;
              break;
            case 'ausencias_justificadas':
              estudiante.asistencia_ausencias_justificadas += 1;
              break;
            case 'presente':
              estudiante.asistencia_presente += 1;
              break;
            case 'tardias':
              estudiante.asistencia_tardias += 1;
              break;
            default:
              return res.status(400).send('Tipo de asistencia no válido');
          }
        
          return res.send('Asistencia actualizada correctamente');
          
        }
      } catch (err) {
        res.status(500).send(err);
      }
    });

    //GET http://localhost:3000/grupo/12345/estudiantes
    app.get('/grupo/:grupoId/estudiantes', async (req, res) => {
      try {
          const grupoId = req.params.grupoId;
  
          const grupo = await Grupo.findById(grupoId).exec();
  
          if (!grupo) {
              return res.status(404).send({ message: 'Grupo no encontrado.' });
          }
  
          res.status(200).send(grupo.estudiantes);
      } catch (error) {
          console.error(error);
          res.status(500).send({ message: 'Error al obtener los estudiantes del grupo' });
      }
  });

  // Ruta para obtener las asistencias de los estudiantes en un grupo
  app.get('/asistencias/:grupoId', async (req, res) => {
    const grupoId = req.params.grupoId;

    try {
      const grupo = await Grupo.findById(grupoId).exec();

      if (!grupo) {
        res.status(404).send({ message: "Grupo not found" });
      } else {
        const asistenciasEstudiantes = grupo.estudiantes.map((estudiante) => {
          return {
            cedula: estudiante.cedula,
            asistencia_ausencias: estudiante.asistencia_ausencias,
            asistencia_ausencias_justificadas: estudiante.asistencia_ausencias_justificadas,
            asistencia_presente: estudiante.asistencia_presente,
            asistencia_tardias: estudiante.asistencia_tardias,
          };
        });
        res.json(asistenciasEstudiantes);
      }
    } catch (error) {
      res.status(500).send(err);
    }
  });
}
