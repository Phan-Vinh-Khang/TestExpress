'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class historyOrders extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    historyOrders.init({
        idOrder: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'historyOrders',
    });
    return historyOrders;
};
//properties trong db