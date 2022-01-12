const router = require("express").Router();
const employeeController = require("../controllers/employe.controller");
const auth = require("../middleware/auth");

router.post("/ajouter", auth.auth, employeeController.addNewEmployee);

router.get("/", auth.auth, employeeController.getEmployees);

router.get("/:id", employeeController.getEmployeeById);

router.get("/entite/:entite", employeeController.getEmployeeByEntite);

router.put("/modifier/:id", auth.auth, employeeController.updateEmployee);

router.delete("/supprimer/:id", auth.auth, employeeController.deleteEmployee);

module.exports = router;
