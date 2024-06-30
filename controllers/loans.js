const pool = require('../config/db');

// Get all loans
exports.getAllLoans = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        loans.loanid, 
        loans.amount, 
        loans.interestrate, 
        loans.durationmonths, 
        loans.startdate, 
        loans.loantype, 
        loans.status, 
        loans.remaining_amount,
        clients.clientid AS client_id, 
        clients.firstname AS client_firstname, 
        clients.lastname AS client_lastname, 
        clients.email AS client_email, 
        clients.phone AS client_phone, 
        clients.address AS client_address, 
        clients.birthdate AS client_birthdate, 
        clients.balance AS client_balance
      FROM loans
      JOIN clients ON loans.clientid = clients.clientid
    `);
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
  const remainingAmount = amount * 1.15; // Calculate remaining amount as amount + 15% of amount
  try {
    const result = await pool.query(
      'INSERT INTO loans (clientid, amount, interestrate, durationmonths, startdate, loantype, status, remaining_amount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [clientid, amount, interestrate, durationmonths, startdate, loantype, status, remainingAmount]
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