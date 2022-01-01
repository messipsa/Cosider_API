const router = require("express").Router();
const employeeController = require("../controllers/employe.controller");

router.post("/ajouter", employeeController.addNewEmployee);

router.get("/", employeeController.getEmployees);

router.get("/:id", employeeController.getEmployeeById);

router.get("/entite/:entite", employeeController.getEmployeeByEntite);

router.put("/modifier/:id", employeeController.updateEmployee);

router.delete("/supprimer/:id", employeeController.deleteEmployee);

module.exports = router;
