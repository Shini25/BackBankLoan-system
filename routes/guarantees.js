const express = require('express');
const router = express.Router();
const guaranteesController = require('../controllers/guarantees');

router.get('/', guaranteesController.getAllGuarantees);
router.get('/:id', guaranteesController.getGuaranteeById);
router.post('/', guaranteesController.createGuarantee);
router.put('/:id', guaranteesController.updateGuarantee);
router.delete('/:id', guaranteesController.deleteGuarantee);

// New route for getting guarantees by loan ID
router.get('/loan/:loanid', guaranteesController.getGuaranteeByLoanId);

module.exports = router;