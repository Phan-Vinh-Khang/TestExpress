'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userShop extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Users, { foreignKey: 'createdbyuserid', as: 'detailUser' })
            this.hasMany(models.Products, { foreignKey: 'usershopid', as: 'allProduct' })
        }
    }
    userShop.init({
        name: DataTypes.STRING,
        createdbyuserid: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'userShop',
    });
    return userShop;
};