'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carts extends Model {
    static associate(models) {
      this.belongsTo(models.Products, { foreignKey: 'idProduct' })
      this.belongsTo(models.Users, { foreignKey: 'idUser' })

    }
  }
  Carts.init({
    idUser: DataTypes.INTEGER,
    idProduct: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Carts',
  });
  return Carts;
};