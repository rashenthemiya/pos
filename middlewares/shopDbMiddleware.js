// Express middleware to switch DB connection per shop (multi-tenant)
const { getSequelizeForShop } = require('../database/multiTenant');

module.exports = function shopDbMiddleware(req, res, next) {
  // Expecting shopDbName from header, query, or subdomain (customize as needed)
  const shopDbName = req.headers['x-shop-db'] || req.query.shop_db;
  if (!shopDbName) {
    return res.status(400).json({ message: 'Missing shop database identifier' });
  }
  try {
    req.shopDb = getSequelizeForShop(shopDbName);
    next();
  } catch (err) {
    next(err);
  }
};
