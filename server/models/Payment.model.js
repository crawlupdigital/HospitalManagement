const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_id: {
    type: DataTypes.INTEGER
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('CASH','CARD','UPI','NETBANKING','INSURANCE','WALLET'),
    allowNull: false
  },
  transaction_ref: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  received_by: {
    type: DataTypes.INTEGER
  },
  paid_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'payments',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = Payment;
