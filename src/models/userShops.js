'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userShops extends Model {
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
    userShops.init({
        name: DataTypes.STRING,
        image: DataTypes.STRING,
        createdbyuserid: DataTypes.INTEGER,
        lastActive: DataTypes.DATE,
        deliveryaddress: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'userShops',
        // freezeTableName: true,
    });
    return userShops;
};