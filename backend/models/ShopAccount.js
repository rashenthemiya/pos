module.exports = (sequelize, DataTypes) => {
  const ShopAccount = sequelize.define('ShopAccount', {
    account_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shop_name: { type: DataTypes.STRING(150) },
    contact_person: { type: DataTypes.STRING(100) },
    phone: { type: DataTypes.STRING(20) },
    email: { type: DataTypes.STRING(100) },
    address: { type: DataTypes.TEXT },
    balance: { type: DataTypes.DECIMAL(14,2), defaultValue: 0.00 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'shop_accounts',
    timestamps: false
  });
  return ShopAccount;
};
