'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Products', [{
            name: 'iPhone 14',
            price: '999$',
            picture: 'https://cdn1.viettelstore.vn/images/Product/ProductImage/medium/1896224739.jpeg',
            des: '',
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },
    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Products', null, {});
    }
    //export var ref vào func
};