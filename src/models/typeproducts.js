'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypeProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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