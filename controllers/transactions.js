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
  const { loanid, transactiondate, amount, transactiontype } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transactions (loanid, transactiondate, amount, transactiontype) VALUES ($1, $2, $3, $4) RETURNING *',
      [loanid, transactiondate, amount, transactiontype]
    );

    if (transactiontype === 'loan') {
      await pool.query('UPDATE loans SET status = $1 WHERE loanid = $2', ['Approved', loanid]);

      // Get the client ID associated with the loan
      const loanResult = await pool.query('SELECT clientid FROM loans WHERE loanid = $1', [loanid]);
      const clientId = loanResult.rows[0].clientid;

      // Update the client's balance
      await pool.query('UPDATE clients SET balance = balance + $1 WHERE clientid = $2', [amount, clientId]);
    } else if (transactiontype === 'payment') {
      // Get the client ID associated with the loan
      const loanResult = await pool.query('SELECT clientid FROM loans WHERE loanid = $1', [loanid]);
      const clientId = loanResult.rows[0].clientid;

      // Update the client's balance
      await pool.query('UPDATE clients SET balance = balance - $1 WHERE clientid = $2', [amount, clientId]);

      // Update the remaining amount of the loan
      await pool.query('UPDATE loans SET remaining_amount = remaining_amount - $1 WHERE loanid = $2', [amount, loanid]);
    }

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
      'UPDATE transactions SET loanid = $1, transactiondate = $2, amount = $3, transactiontype = $4 WHERE transactionid = $5 RETURNING *',
      [loanid, transactiondate, amount, transactiontype, id]
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