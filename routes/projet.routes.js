const router = require('express').Router();
const projetController = require('../controllers/projet.controller');


router.get('/' , projetController.getAllProjects);

router.get('/:id' , projetController.getProjectById);

router.post('/ajouter' , projetController.addProject);

router.put('/modifier/:id' , projetController.Modify);

router.delete('/supprimer/:id' , projetController.deleteProject);


module.exports = router;