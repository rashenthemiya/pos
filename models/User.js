module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    full_name: { type: DataTypes.STRING(100) },
    role: { type: DataTypes.ENUM('admin','cashier','manager'), allowNull: false },
    email: { type: DataTypes.STRING(100) },
    phone: { type: DataTypes.STRING(20) },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'users',
    timestamps: false
  });
  User.associate = models => {
    User.hasMany(models.CustomerOrder, { foreignKey: 'user_id' });
    User.hasMany(models.Payment, { foreignKey: 'received_by' });
    User.hasMany(models.Withdrawal, { foreignKey: 'user_id' });
  };
  return User;
};
