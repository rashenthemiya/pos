module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    stock_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    item_id: { type: DataTypes.INTEGER, allowNull: false },
    full_quantity: { type: DataTypes.DECIMAL(12,2) },
    healthy_quantity: { type: DataTypes.DECIMAL(12,2) },
    damaged_quantity: { type: DataTypes.DECIMAL(12,2) },
    expired_quantity: { type: DataTypes.DECIMAL(12,2) },
    unit: { type: DataTypes.ENUM('kg','liters','packets','bottles') },
    stock_level: { type: DataTypes.ENUM('low','medium','high','outofstck','oorderd') },
    last_updated: { type: DataTypes.DATE }
  }, {
    tableName: 'stock',
    timestamps: false
  });
  Stock.associate = models => {
    Stock.belongsTo(models.Item, { foreignKey: 'item_id' });
    Stock.hasMany(models.StockBatch, { foreignKey: 'stock_id' });
  };
  return Stock;
};
