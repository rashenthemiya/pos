module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sku: { type: DataTypes.STRING(50), unique: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    image: { type: DataTypes.BLOB },
    unit: { type: DataTypes.STRING(20) },
    category: { type: DataTypes.STRING(50) },
    brand: { type: DataTypes.STRING(50) },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'items',
    timestamps: false
  });
  Item.associate = models => {
    Item.hasMany(models.SupplyProduct, { foreignKey: 'item_id' });
    Item.hasMany(models.OrderProduct, { foreignKey: 'item_id' });
    Item.hasMany(models.Stock, { foreignKey: 'item_id' });
    Item.hasMany(models.OrderSupply, { foreignKey: 'item_id' });
  };
  return Item;
};
