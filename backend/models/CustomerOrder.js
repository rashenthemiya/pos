module.exports = (sequelize, DataTypes) => {
  const CustomerOrder = sequelize.define('CustomerOrder', {
    order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    customer_id: { type: DataTypes.INTEGER },
    cost: { type: DataTypes.DECIMAL(12,2) },
    discount: { type: DataTypes.DECIMAL(10,2) },
    total_cost: { type: DataTypes.DECIMAL(12,2) },
    paid_amount: { type: DataTypes.DECIMAL(12,2) },
    payment_method: { type: DataTypes.ENUM('cash','card','loan') },
    order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    notes: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('PENDING','COMPLETE','LOAN','REFUND','PARTLYPAID','PARTLYREFUND') }
  }, {
    tableName: 'customer_orders',
    timestamps: false
  });
  CustomerOrder.associate = models => {
    CustomerOrder.belongsTo(models.User, { foreignKey: 'user_id' });
    CustomerOrder.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    CustomerOrder.hasMany(models.OrderProduct, { foreignKey: 'order_id' });
    CustomerOrder.hasMany(models.Payment, { foreignKey: 'order_id' });
  };
  return CustomerOrder;
};
