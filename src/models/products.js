'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      this.belongsTo(models.TypeProducts, { foreignKey: 'typeprodid', as: 'detailTypeProd' })
      this.belongsTo(models.Users, { foreignKey: 'usercreatedid', as: 'detailUser' })
      this.belongsTo(models.userShops, { foreignKey: 'usershopid', as: 'detailShop' })
      this.hasMany(models.Carts, { foreignKey: 'idProduct', onDelete: 'CASCADE' })
      this.hasMany(models.detailOrders, { foreignKey: 'idProduct', onDelete: 'SET NULL' })
    }
  }
  Products.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    des: DataTypes.STRING,
    image: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    star: DataTypes.FLOAT,
    sold: DataTypes.INTEGER,
    typeprodid: DataTypes.INTEGER,
    usercreatedid: DataTypes.INTEGER,
    usershopid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};