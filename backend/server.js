const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const auth = require('./routes/auth');
const transactions = require('./routes/transactions');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

app.use('/api/v1/auth', auth);
app.use('/api/v1', transactions);

// Export for Vercel Serverless
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
}
