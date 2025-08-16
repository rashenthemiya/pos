module.exports = (sequelize, DataTypes) => {
  const OrderSupply = sequelize.define('OrderSupply', {
    order_supply_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    item_id: { type: DataTypes.INTEGER, allowNull: false },
    requested_quantity: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    status: { type: DataTypes.ENUM('pending','ordered','received') },
    requested_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    supplier_id: { type: DataTypes.INTEGER }
  }, {
    tableName: 'order_supplies',
    timestamps: false
  });
  OrderSupply.associate = models => {
    OrderSupply.belongsTo(models.Item, { foreignKey: 'item_id' });
    OrderSupply.belongsTo(models.Supplier, { foreignKey: 'supplier_id' });
  };
  return OrderSupply;
};
