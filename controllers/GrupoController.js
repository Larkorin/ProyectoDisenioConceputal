// controllers/MatriculaController.js

const Grupo = require("../models/Grupo.js");

module.exports = function (app) {
  //http://localhost:3000/grupo/profesor/003-123456-0002C/ciclo-activo/2
  app.get(
    "/grupo/profesor/:cedulaProfesor/ciclo-activo/:cicloActivo",
    async (req, res) => {
      try {
        const cedulaProfesor = req.params.cedulaProfesor;
        const cicloActivo = parseInt(req.params.cicloActivo);

        const grupos = await Grupo.find({
          profesor: cedulaProfesor,
          ciclo: cicloActivo,
        });

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

  //http://localhost:3000/registrar-notas/a316247a8188a594ff826d41/cedulaAlumno/007-123456-0006G/nota/80
  app.put('/registrar-notas/:grupoId/cedulaAlumno/:cedulaAlumno/nota/:nota', async (req, res) => {
    const grupoId = req.params.grupoId;
    const cedulaAlumno = req.params.cedulaAlumno;
    const nuevaNota = parseInt(req.params.nota);
  
    try {
      const grupo = await Grupo.findById(grupoId).exec();
  
      if (!grupo) {
        return res.status(404).send({ message: 'Grupo no encontrado.' });
      }
  
      // Buscar el estudiante en el grupo
      const estudiante = grupo.estudiantes.find(est => est.cedula === cedulaAlumno);
  
      if (!estudiante) {
        return res.status(404).send({ message: 'Estudiante no encontrado en el grupo.' });
      }
  
      // Actualizar la nota del estudiante
      estudiante.nota = nuevaNota;
  
      // Guardar el grupo actualizado
      await grupo.save();
  
      res.status(200).send({ message: 'Nota actualizada correctamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al actualizar la nota del estudiante.' });
    }
  });

  //Encontrar Grupos por Curso
  //http://localhost:3000/grupo/1
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
  //http://localhost:3000/grupo/1/cedulaAlumno/007-123456-0006G/asistencia/presente
  app.put(
    "/grupo/:cursoSeleccionado/cedulaAlumno/:cedulaAlumno/asistencia/:tipoAsistencia",
    async (req, res) => {
      const cursoSeleccionado = parseInt(req.params.cursoSeleccionado);
      const cedulaAlumno = req.params.cedulaAlumno;
      const tipoAsistencia = req.params.tipoAsistencia;
  
      try {
        const grupos = await Grupo.find({ curso: cursoSeleccionado });
        console.log(grupos);
        if (grupos.length === 0) {
          res.status(404).send({
            mensaje: `No hay grupos disponibles para el curso con código ${cursoSeleccionado}`,
          });
        } else {
          console.log("xxxxxxxxxxxxxx");
          
          // Iterar sobre los grupos y buscar el estudiante en cada grupo
          let estudianteEncontrado = false;
          for (const grupo of grupos) {
            const estudiante = grupo.estudiantes.find(est => est.cedula === cedulaAlumno);
            console.log("-------------");
            console.log(estudiante);
  
            if (estudiante) {
              estudianteEncontrado = true;
  
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
  
              await grupo.save();
  
              break;
            }
          }
  
          if (!estudianteEncontrado) {
            return res.status(404).send('Estudiante no encontrado en ningún grupo');
          }
  
          return res.send('Asistencia actualizada correctamente');
        }
      } catch (err) {
        res.status(500).send(err);
        console.log(err);
      }
    }
  );
  

    //http://localhost:3000/grupo/a316247a8188a594ff826d41/estudiantes
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
  //http://localhost:3000/asistencias/a316247a8188a594ff826d41
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
    } catch (err) {
      res.status(500).send(err);
    }
  });
}
