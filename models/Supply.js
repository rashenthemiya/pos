module.exports = (sequelize, DataTypes) => {
  const Supply = sequelize.define('Supply', {
    supply_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    supplier_id: { type: DataTypes.INTEGER, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(12,2) },
    discount: { type: DataTypes.DECIMAL(10,2) },
    total_after_discount: { type: DataTypes.DECIMAL(12,2) },
    paid_amount: { type: DataTypes.DECIMAL(12,2) },
    paid_method: { type: DataTypes.ENUM('check','via_shop_balance','loan','cash','card','suppliebalance') },
    supply_date: { type: DataTypes.DATE },
    notes: { type: DataTypes.TEXT }
  }, {
    tableName: 'supplies',
    timestamps: false
  });
  Supply.associate = models => {
    Supply.belongsTo(models.Supplier, { foreignKey: 'supplier_id' });
    Supply.hasMany(models.SupplyProduct, { foreignKey: 'supply_id' });
  };
  return Supply;
};
