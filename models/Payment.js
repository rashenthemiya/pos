module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    payment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customer_id: { type: DataTypes.INTEGER },
    order_id: { type: DataTypes.INTEGER },
    payment_reason: { type: DataTypes.STRING(255) },
    amount: { type: DataTypes.DECIMAL(12,2) },
    payment_method: { type: DataTypes.ENUM('cash','card','check') },
    payment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    received_by: { type: DataTypes.INTEGER }
  }, {
    tableName: 'payments',
    timestamps: false
  });
  Payment.associate = models => {
    Payment.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    Payment.belongsTo(models.CustomerOrder, { foreignKey: 'order_id' });
    Payment.belongsTo(models.User, { foreignKey: 'received_by' });
  };
  return Payment;
};
