'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypeProducts extends Model {
    static associate(models) {
      this.hasMany(models.Products, { foreignKey: 'typeprodid', as: 'allProduct' })
    }
  }
  TypeProducts.init({
    typeprodname: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'TypeProducts',
  });
  return TypeProducts;
};