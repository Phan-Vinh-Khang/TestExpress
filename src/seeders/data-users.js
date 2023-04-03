'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [{
            name: 'Name1',
            email: 'Name1@gmail.com',
            password: '',
            avatar: '',
            adress: '',
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },
    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
    //export var ref vào func
};