const router = require('express').Router();
const employeeController = require('../controllers/employe.controller');

router.post('/' , employeeController.addNewEmployee);

router.get('/' , employeeController.getEmployees);

router.get('/:id' , employeeController.getEmployeeById);

module.exports = router;