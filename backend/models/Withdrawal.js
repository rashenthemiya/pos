module.exports = (sequelize, DataTypes) => {
  const Withdrawal = sequelize.define('Withdrawal', {
    withdrawal_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    reason: { type: DataTypes.STRING(255) },
    amount: { type: DataTypes.DECIMAL(12,2) },
    withdrawal_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    user_id: { type: DataTypes.INTEGER },
    notes: { type: DataTypes.TEXT }
  }, {
    tableName: 'withdrawals',
    timestamps: false
  });
  Withdrawal.associate = models => {
    Withdrawal.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return Withdrawal;
};
