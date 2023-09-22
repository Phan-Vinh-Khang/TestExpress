'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Products', {
      fields: ['typeprodid'],
      type: 'foreign key',
      name: 'product-typeprod-association',
      references: {
        table: 'TypeProducts',
        field: 'id'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Products', 'product-typeprod-association')
  }
};
