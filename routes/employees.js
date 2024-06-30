const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employees');

router.get('/search', employeesController.searchEmployeesByFirstNameOrLastName);
router.get('/', employeesController.getAllEmployees);
router.get('/:username', employeesController.getEmployeeByUsername);
router.post('/', employeesController.createEmployee);
router.put('/:username', employeesController.updateEmployee);
router.delete('/:username', employeesController.deleteEmployee);

module.exports = router;