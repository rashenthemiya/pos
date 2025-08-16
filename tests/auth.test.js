const request = require('supertest');
const express = require('express');
const routes = require('../routes');
const shopDbMiddleware = require('../middlewares/shopDbMiddleware');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(shopDbMiddleware);
app.use('/api', routes);

// Test login endpoint

describe('POST /api/auth/login', () => {
  it('should login with default manager and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('x-shop-db', process.env.DB_NAME)
      .send({ username: 'admin', password: 'admin123', shop_db: process.env.DB_NAME });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ username: 'admin', role: 'manager', shop_db: process.env.DB_NAME });
  });
});
