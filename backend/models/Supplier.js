module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('Supplier', {
    supplier_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    contact_person: { type: DataTypes.STRING(100) },
    phone: { type: DataTypes.STRING(20) },
    email: { type: DataTypes.STRING(100) },
    address: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'suppliers',
    timestamps: false
  });
  Supplier.associate = models => {
    Supplier.hasMany(models.Supply, { foreignKey: 'supplier_id' });
    Supplier.hasMany(models.OrderSupply, { foreignKey: 'supplier_id' });
    Supplier.hasMany(models.StockBatch, { foreignKey: 'supplierid' });
  };
  return Supplier;
};
