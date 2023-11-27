// controllers/MatriculaController.js

const Matricula = require('../models/Matricula.js');

module.exports = function (app) {


    //http://localhost:3000/matricula/codigo/2/cedula/1-1913-1405 a la Programación
    app.post('/matricula/codigo/:codigo/cedula/:cedula', async (req, res) => {
        try {
            let nuevoCurso = { codigo: req.params.codigo };
            await Matricula.updateOne(
                { cedula: req.params.cedula },
                { $push: { cursos: nuevoCurso } }
            );

            // Notificar a los observadores que se agregó un curso a la matrícula
            emitMatriculaUpdate(req.params.cedula);

            res.status(200).send({ message: 'Curso agregado con éxito' });
        } catch (err) {
            res.status(500).send(err);
        }
    });

    //http://localhost:3000/matricula/codigo/2/cedula/1-1913-1405 a la Programación
    app.delete('/matricula/eliminar-curso-matriculado/codigo/:codigo/cedula/:cedula', async (req, res) => {
        try {
            // Código para eliminar el curso matriculado utilizando $pull
            const result = await Matricula.updateOne(
                { cedula: req.params.cedula },
                { $pull: { cursos: { codigo: req.params.codigo } } }
            );

            // Verificar si se encontró y se modificó el documento
            if (result.matchedCount > 0 && result.modifiedCount > 0) {
                // Notificar a los observadores que se eliminó un curso matricu lado
                emitMatriculaBorraUpdate(req.params.cedula);

                res.status(200).send({ message: 'Curso eliminado con éxito' });
            } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
                res.status(404).send({ message: 'El curso no fue encontrado en esta matrícula' });
            } else {
                res.status(404).send({ message: 'Matrícula no encontrada' });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });

    //Mostrar Cursos Matriculados por Estudiante 
    app.get('/cursos-matriculados/:cedulaEstudiante', async (req, res) => {
    const cedulaEstudiante = req.params.cedulaEstudiante;
    
    try {
        const matricula = await Matricula.findOne({ cedula: cedulaEstudiante }).exec();
    
        if (matricula && matricula.cursos.length > 0) {
        const cursosMatriculados = await Curso.find({ codigo: { $in: matricula.cursos.map((curso) => curso.codigo) } }).exec();
        res.send(cursosMatriculados);
        } else {
        res.status(404).send({ message: 'El estudiante no está matriculado en ningún curso.' });
        }
    } catch (error) {
        res.status(500).send(err);
    }
    });

    // http://localhost:3000/matricula/historial/0192409325
    /*
    En esta funcion HTTP se puede implementar el patron Iterador
    A la hora que se filtra la informacion y se consigue los cursos matriculados del estudiante seleccionado, se puede llamar al
    patron iterador
    debido a que la respuesta de la consulta HTTP devolvera una lista en forma JSON. El iterador pasaria por cada dato dentro de la lista
    y se podria guardar en una variable en forma de lista.
    */
    app.get('/matricula/historial/:cedula', async (req, res) => {
    try {
        const historialMatriculas = await Matricula.find({ cedula: req.params.cedula });
        if (historialMatriculas.length > 0) {
            res.send(historialMatriculas);
        } else {
            res.status(404).send({ message: 'No enrollment records found for the student.' });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

      
}
