const router = require('express').Router();
const contratController = require('../controllers/contrat.controller');

router.put('/renouveler/:id' , contratController.renouvelerContrat);

module.exports = router;