'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    static associate(models) {
      this.belongsTo(models.Users, { foreignKey: 'orderByUserId' })
      this.hasMany(models.detailOrders,
        {
          foreignKey: 'idOrder',
          onDelete: 'CASCADE'
        })
    }
  }
  Orders.init({
    orderByUserId: DataTypes.INTEGER,
    deliveryDatem: DataTypes.INTEGER,
    message: DataTypes.STRING,
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};