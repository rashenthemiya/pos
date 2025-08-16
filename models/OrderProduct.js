module.exports = (sequelize, DataTypes) => {
  const OrderProduct = sequelize.define('OrderProduct', {
    order_product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    item_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10,2) },
    status: { type: DataTypes.ENUM('PENDING','COMPLETE','LOAN','REFUND') },
    unit_price: { type: DataTypes.DECIMAL(10,2) },
    discountperitem: { type: DataTypes.DECIMAL(12,2) },
    line_total: { type: DataTypes.DECIMAL(12,2) }
  }, {
    tableName: 'order_products',
    timestamps: false
  });
  OrderProduct.associate = models => {
    OrderProduct.belongsTo(models.CustomerOrder, { foreignKey: 'order_id' });
    OrderProduct.belongsTo(models.Item, { foreignKey: 'item_id' });
  };
  return OrderProduct;
};
