const pool = require('../config/db');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM payments WHERE paymentid = $1', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new payment
exports.createPayment = async (req, res) => {
  const { loanid, paymentamount, paymentdate, paymenttype } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO payments (loanid, paymentamount, paymentdate, paymenttype) VALUES ($1, $2, $3, $4) RETURNING *',
      [loanid, paymentamount, paymentdate, paymenttype]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a payment
exports.updatePayment = async (req, res) => {
  const { id } = req.params;
  const { loanid, paymentamount, paymentdate, paymenttype } = req.body;
  try {
    const result = await pool.query(
      'UPDATE payments SET loanid = $1, paymentamount = $2, paymentdate = $3, paymenttype = $4 WHERE paymentid = $5 RETURNING *',
      [loanid, paymentamount, paymentdate, paymenttype, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM payments WHERE paymentid = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};