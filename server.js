const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const auth = require('./middleware/auth');

const app = express();

// Cors configuration
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false

};

// Middleware for parsing the request body
app.use(bodyParser.json());

// Middleware for enabling CORS
app.use(cors(corsOptions));

// Import routes
const clientsRouter = require('./routes/clients');
const loansRouter = require('./routes/loans');
const paymentsRouter = require('./routes/payments');
const guaranteesRouter = require('./routes/guarantees');
const employeesRouter = require('./routes/employees');
const transactionsRouter = require('./routes/transactions');
const authRouter = require('./routes/auth');

// Use routes
app.use('/clients', auth, clientsRouter);
app.use('/loans', auth, loansRouter);
app.use('/payments', auth, paymentsRouter);
app.use('/guarantees', auth, guaranteesRouter);
app.use('/employees', auth, employeesRouter);
app.use('/transactions', auth, transactionsRouter);
app.use('/auth', authRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
