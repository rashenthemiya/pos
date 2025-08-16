module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    customer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    nic: { type: DataTypes.STRING(50) },
    nic_image_front: { type: DataTypes.BLOB },
    nic_image_back: { type: DataTypes.BLOB },
    shop_balance: { type: DataTypes.DECIMAL(12,2), defaultValue: 0.00 },
    phone: { type: DataTypes.STRING(20) },
    email: { type: DataTypes.STRING(100) },
    address: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'customers',
    timestamps: false
  });
  Customer.associate = models => {
    Customer.hasMany(models.CustomerOrder, { foreignKey: 'customer_id' });
    Customer.hasMany(models.Payment, { foreignKey: 'customer_id' });
  };
  return Customer;
};
