const router = require("express").Router();
const projetController = require("../controllers/projet.controller");
const auth = require("../middleware/auth");

router.get("/", auth.auth, projetController.getAllProjects);

router.get("/:id", projetController.getProjectById);

router.post("/ajouter", auth.auth, projetController.addProject);

router.put("/modifier/:id", auth.auth, projetController.Modify);

router.delete("/supprimer/:id", projetController.deleteProject);

module.exports = router;
