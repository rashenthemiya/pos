module.exports = (sequelize, DataTypes) => {
  const StockBatch = sequelize.define('StockBatch', {
    batch_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    supplierid: { type: DataTypes.INTEGER },
    stock_id: { type: DataTypes.INTEGER, allowNull: false },
    barcode: { type: DataTypes.STRING(100), unique: true },
    cost_price: { type: DataTypes.DECIMAL(10,2) },
    selling_price: { type: DataTypes.DECIMAL(10,2) },
    billing_price: { type: DataTypes.DECIMAL(10,2) },
    full_batch_quantity: { type: DataTypes.DECIMAL(12,2) },
    health_batch_quantity: { type: DataTypes.DECIMAL(12,2) },
    damage_batch_quantity: { type: DataTypes.DECIMAL(12,2) },
    expired_batch_quantity: { type: DataTypes.DECIMAL(12,2) },
    expiry_date: { type: DataTypes.DATE },
    received_date: { type: DataTypes.DATE }
  }, {
    tableName: 'stock_batches',
    timestamps: false
  });
  StockBatch.associate = models => {
    StockBatch.belongsTo(models.Stock, { foreignKey: 'stock_id' });
    StockBatch.belongsTo(models.Supplier, { foreignKey: 'supplierid' });
    StockBatch.hasMany(models.SupplyProduct, { foreignKey: 'batch_id' });
  };
  return StockBatch;
};
