const pool = require('../config/db');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM transactions WHERE transactionid = $1', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
  const { clientid, loanid, transactiondate, amount, transactiontype } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transactions (clientid, loanid, transactiondate, amount, transactiontype) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [clientid, loanid, transactiondate, amount, transactiontype]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { clientid, loanid, transactiondate, amount, transactiontype } = req.body;
  try {
    const result = await pool.query(
      'UPDATE transactions SET clientid = $1, loanid = $2, transactiondate = $3, amount = $4, transactiontype = $5 WHERE transactionid = $6 RETURNING *',
      [clientid, loanid, transactiondate, amount, transactiontype, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM transactions WHERE transactionid = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};