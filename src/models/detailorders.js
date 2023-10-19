'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detailOrders extends Model {
    static associate(models) {
      this.belongsTo(models.Orders, { foreignKey: 'idOrder' })
      this.belongsTo(models.Products, { foreignKey: 'idProduct' })
    }
  }
  detailOrders.init({
    idOrder: DataTypes.INTEGER,
    idProduct: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    discount: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'detailOrders',
  });
  return detailOrders;
};