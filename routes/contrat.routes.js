const router = require("express").Router();
const contratController = require("../controllers/contrat.controller");
const auth = require("../middleware/auth");

router.put("/renouveler/:id", auth.auth, contratController.renouvelerContrat);

router.get("/download/:id", auth.auth, contratController.downloadContrat);

module.exports = router;
