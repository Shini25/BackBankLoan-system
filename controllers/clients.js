const pool = require('../config/db');

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get client by ID
exports.getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM clients WHERE clientid = $1', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new client
exports.createClient = async (req, res) => {
  const { lastname, firstname, birthdate, address, email, phone, balance } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clients (lastname, firstname, birthdate, address, email, phone, balance) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [lastname, firstname, birthdate, address, email, phone, balance]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { lastname, firstname, birthdate, address, email, phone, balance } = req.body;
  try {
    const result = await pool.query(
      'UPDATE clients SET lastname = $1, firstname = $2, birthdate = $3, address = $4, email = $5, phone = $6, balance = $7 WHERE clientid = $8 RETURNING *',
      [lastname, firstname, birthdate, address, email, phone, balance, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clients WHERE clientid = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rechercher des clients par prénom ou nom de famille
exports.searchClientsByFirstNameOrLastName = async (req, res) => {
  const { searchText } = req.query;
  try {
    const query = `
      SELECT * FROM clients 
      WHERE firstname ILIKE $1
      OR lastname ILIKE $1
    `;
    const result = await pool.query(query, [`${searchText}%`]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
