// Multi-tenant database connection manager for per-shop databases
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const connections = {};

function getShopDbConfig(shopDbName) {
  return {
    database: shopDbName,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    define: {
      freezeTableName: true,
      underscored: true,
      timestamps: false
    }
  };
}

function getSequelizeForShop(shopDbName) {
  if (!connections[shopDbName]) {
    const config = getShopDbConfig(shopDbName);
    const sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
    // Dynamically load models for this shop DB
    const fs = require('fs');
    const path = require('path');
    const modelsDir = path.join(__dirname, '../models');
    const db = {};
    fs.readdirSync(modelsDir)
      .filter(file => file.endsWith('.js') && file !== 'index.js')
      .forEach(file => {
        const model = require(path.join(modelsDir, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      });
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
    sequelize.models = db;
    // Sync models to DB (auto-create tables if not exist)
    sequelize.sync().then(() => {
      console.log(`Tables synced for shop DB: ${shopDbName}`);
    }).catch(err => {
      console.error(`Failed to sync tables for shop DB: ${shopDbName}`, err);
    });
    connections[shopDbName] = sequelize;
  }
  return connections[shopDbName];
}

module.exports = { getSequelizeForShop };
