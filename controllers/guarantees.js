const pool = require('../config/db');

// Get all guarantees
exports.getAllGuarantees = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM guarantees');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get guarantee by ID
exports.getGuaranteeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM guarantees WHERE guaranteeid = $1', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get guarantee by loan ID
exports.getGuaranteeByLoanId = async (req, res) => {
  const { loanid } = req.params;
  try {
    const result = await pool.query('SELECT * FROM guarantees WHERE loanid = $1', [loanid]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new guarantee
exports.createGuarantee = async (req, res) => {
  const { loanid, guaranteetype, estimatedvalue, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO guarantees (loanid, guaranteetype, estimatedvalue, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [loanid, guaranteetype, estimatedvalue, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a guarantee
exports.updateGuarantee = async (req, res) => {
  const { id } = req.params;
  const { loanid, guaranteetype, estimatedvalue, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE guarantees SET loanid = $1, guaranteetype = $2, estimatedvalue = $3, description = $4 WHERE guaranteeid = $5 RETURNING *',
      [loanid, guaranteetype, estimatedvalue, description, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a guarantee
exports.deleteGuarantee = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM guarantees WHERE guaranteeid = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
