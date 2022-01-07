const router = require("express").Router();
const contratController = require("../controllers/contrat.controller");

router.put("/renouveler/:id", contratController.renouvelerContrat);

router.get("/download/:id", contratController.downloadContrat);

module.exports = router;
