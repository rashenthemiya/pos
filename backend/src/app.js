// Entry point for the Express app
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('../routes');
const { errorHandler } = require('../middlewares/errorHandler');

const shopDbMiddleware = require('../middlewares/shopDbMiddleware');

app.use(cors({
  origin: 'http://localhost:5173', // Or use origin: true for any origin (dev only)
  credentials: true
}));
app.use(express.json());
// Multi-tenant: attach shopDb to each request
app.use(shopDbMiddleware);
app.use('/api', routes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});