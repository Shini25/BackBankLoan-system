const pool = require('../config/db');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get employee by username
exports.getEmployeeByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query('SELECT * FROM employees WHERE username = $1', [username]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  const { username, password, lastname, firstname, position, email, phone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO employees (username, password, lastname, firstname, position, email, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [username, password, lastname, firstname, position, email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  const { username } = req.params;
  const { password, lastname, firstname, position, email, phone } = req.body;
  try {
    const result = await pool.query(
      'UPDATE employees SET password = $1, lastname = $2, firstname = $3, position = $4, email = $5, phone = $6 WHERE username = $7 RETURNING *',
      [password, lastname, firstname, position, email, phone, username]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  const { username } = req.params;
  try {
    await pool.query('DELETE FROM employees WHERE username = $1', [username]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rechercher des employés par prénom ou nom de famille
exports.searchEmployeesByFirstNameOrLastName = async (req, res) => {
  const { searchText } = req.query;
  try {
    const query = `
      SELECT * FROM employees 
      WHERE firstname ILIKE $1
      OR lastname ILIKE $1
    `;
    const result = await pool.query(query, [`${searchText}%`]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};