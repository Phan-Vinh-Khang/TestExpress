'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Users', {
      fields: ['roleid'],
      type: 'foreign key',
      name: 'users-role-association',
      references: {
        table: 'Roles',
        field: 'id'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Users', {
      fields: ['roleid'],
      type: 'foreign key',
      name: 'users-role-association',
      references: {
        table: 'Roles',
        field: 'id'
      }
    })
  }
};
