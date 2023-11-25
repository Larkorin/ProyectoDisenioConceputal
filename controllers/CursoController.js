// controllers/CursoController.js

const Curso = require('../models/Curso.js');

module.exports = function(app) {


    //http://localhost:3000/curso/nombre/Introducción a la Programación
    app.get('/curso/nombre/:nombre', async (req, res) => {
        try {
            const cursos = await Curso.find({ nombre: req.params.nombre });
            res.send(cursos);
        } catch (err) {
            res.status(500).send(err);
        }
    });


    //http://localhost:3000/curso/codigo/2
    app.get('/curso/codigo/:codigo', async (req, res) => {
        try {
            const cursos = await Curso.find({ codigo: req.params.codigo });
            res.send(cursos);
        } catch (err) {
            res.status(500).send(err);
        }
    });
    
}


