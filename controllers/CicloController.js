const Ciclo = require('../models/Ciclo.js');
const Matricula = require('../models/Matricula.js');

module.exports = function(app) {
    app.get('/ciclo-activo', async (req, res) => {
        try {
            const ciclo = await Ciclo.findOne({activo : true});
            if (ciclo) {
                res.send(ciclo);
            } else {
                res.status(404).send({ message: "Ciclo not found" });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });

    //http://localhost:3000/ciclos/historial/0192409325
    app.get('/ciclos/historial/:cedula', async (req, res) => {
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

    //http://localhost:3000/ciclos/annio/2024
    /*
    En esta funcion HTTP se puede implementar el patron Iterador
    A la hora que se filtra la informacion y se consigue los ciclos del año seleccionado, se puede llamar al patron iterador
    debido a que la respuesta de la consulta HTTP devolvera una lista en forma JSON. El iterador pasaria por cada dato dentro de la lista
    y se podria guardar en una variable en forma de lista.
    */
    app.get('/ciclos/annio/:annio', async (req, res) => {
        try {
            const ciclos = await Ciclo.find({ annio: req.params.annio });
            console.log(ciclos);
            if (ciclos.length > 0) {
                res.send(ciclos);
            } else {
                res.status(404).send({ message: 'No cycles found for the year.' });
            }
        } catch (err) {
            res.status(500).send({ message: 'Error.' });
        }
    });

    //http://localhost:3000/ciclo/activar/1
    app.put('/ciclo/activar/:codigo', async (req, res) => {
    const codigo = parseInt(req.params.codigo); 
    try {
        const result = await Ciclo.updateOne(
            { codigo: codigo },
            { $set: { activo: true } }
        );

        if (result.matchedCount > 0) {
            if (result.modifiedCount > 0) {
                res.send({ message: "Ciclo has been set as active." });
            } else {
                res.send({ message: "Ciclo was already active." });
            }
        } else {
            res.status(404).send({ message: "Ciclo not found" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
    });

}