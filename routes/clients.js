const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clients');

// Nouvelle route pour rechercher des clients par prénom ou nom de famille
router.get('/search', clientsController.searchClientsByFirstNameOrLastName);

router.get('/', clientsController.getAllClients);
router.get('/:id', clientsController.getClientById);
router.post('/', clientsController.createClient);
router.put('/:id', clientsController.updateClient);
router.delete('/:id', clientsController.deleteClient);

module.exports = router;
