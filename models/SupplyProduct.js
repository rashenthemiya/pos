module.exports = (sequelize, DataTypes) => {
  const SupplyProduct = sequelize.define('SupplyProduct', {
    supply_product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    supply_id: { type: DataTypes.INTEGER, allowNull: false },
    batch_id: { type: DataTypes.INTEGER },
    item_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10,2) },
    unit_price: { type: DataTypes.DECIMAL(10,2) },
    total_price: { type: DataTypes.DECIMAL(12,2) }
  }, {
    tableName: 'supply_products',
    timestamps: false
  });
  SupplyProduct.associate = models => {
    SupplyProduct.belongsTo(models.Supply, { foreignKey: 'supply_id' });
    SupplyProduct.belongsTo(models.Item, { foreignKey: 'item_id' });
    SupplyProduct.belongsTo(models.StockBatch, { foreignKey: 'batch_id' });
  };
  return SupplyProduct;
};
