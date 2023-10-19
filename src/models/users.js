'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      this.belongsTo(models.Roles, { foreignKey: 'roleid', as: 'role' })
      this.hasMany(models.userShops, {
        foreignKey: 'createdbyuserid',
        onDelete: 'CASCADE',
        as: 'allShop'
      })
      this.hasMany(models.Products, {
        foreignKey: 'usercreatedid',
        onDelete: 'CASCADE',
        as: 'allProduct'
      })
      this.hasMany(models.Carts, {
        foreignKey: 'idUser',
        onDelete: 'CASCADE'
      })
      this.hasMany(models.Orders, {
        foreignKey: 'orderByUserId'
        //nếu ko set onDelete default sẽ là onDelete: 'SET NULL'
      })
    }
  }
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    adress: DataTypes.STRING,
    roleid: DataTypes.INTEGER,
    iscollab: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users; //return table Users trong database
};
//properties trong db