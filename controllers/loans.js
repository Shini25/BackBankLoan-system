const pool = require('../config/db');

// Get all loans
exports.getAllLoans = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM loans');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get loan by ID
exports.getLoanById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM loans WHERE loanid = $1', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new loan
exports.createLoan = async (req, res) => {
  const { clientid, amount, interestrate, durationmonths, startdate, loantype, status = 'pending' } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO loans (clientid, amount, interestrate, durationmonths, startdate, loantype, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [clientid, amount, interestrate, durationmonths, startdate, loantype, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a loan
exports.updateLoan = async (req, res) => {
  const { id } = req.params;
  const { clientid, amount, interestrate, durationmonths, startdate, loantype, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE loans SET clientid = $1, amount = $2, interestrate = $3, durationmonths = $4, startdate = $5, loantype = $6, status = $7 WHERE loanid = $8 RETURNing *',
      [clientid, amount, interestrate, durationmonths, startdate, loantype, status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a loan
exports.deleteLoan = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM loans WHERE loanid = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};