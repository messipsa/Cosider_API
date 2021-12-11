const router = require('express').Router();
const projetController = require('../controllers/projet.controller');


router.get('/all' , projetController.getAllProjects);

router.post('/ajouter' , projetController.addProject);

module.exports = router;