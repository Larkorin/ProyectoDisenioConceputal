const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Conexión a MongoDB
connectDB();

app.use(bodyParser.json());

const alumnosController = require('./controllers/AlumnosController.js');
alumnosController(app);
const cicloController = require('./controllers/CicloController.js');
cicloController(app);
const cursosController = require('./controllers/CursoController.js');
cursosController(app);
const carrerasController = require('./controllers/CarreraController.js');
carrerasController(app);
const MatriculaController = require('./controllers/MatriculaController.js');
MatriculaController(app);
const GrupoController = require('./controllers/GrupoController.js');
GrupoController(app);
const ProfesorController = require('./controllers/ProfesorController.js');
ProfesorController(app);



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});