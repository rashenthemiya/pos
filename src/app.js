// Entry point for the Express app
require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('../routes');
const { errorHandler } = require('../middlewares/errorHandler');

const shopDbMiddleware = require('../middlewares/shopDbMiddleware');

app.use(express.json());
// Multi-tenant: attach shopDb to each request
app.use(shopDbMiddleware);
app.use('/api', routes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
