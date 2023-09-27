'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      this.belongsTo(models.Roles, { foreignKey: 'roleid', as: 'role' })
      this.hasMany(models.userShop, { foreignKey: 'createdbyuserid', as: 'allShop' })
      this.hasMany(models.Products, { foreignKey: 'usercreatedid', as: 'allProduct' })
    }
  }
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    adress: DataTypes.STRING,
    roleid: DataTypes.INTEGER,
    iscollab: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users; //return table Users trong database
};
//properties trong db