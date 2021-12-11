const router = require('express').Router();
const projetController = require('../controllers/projet.controller');


app.get('/all' , projetController.getAllProjects);