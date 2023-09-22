'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Products',
      'userCreatedId',//user đã create sản phẩm này
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    );
    await queryInterface.addColumn(
      'Products',
      'userShopId',//sản phẩm này nằm trong userShop nào
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    queryInterface.addConstraint('Products', {
      type: 'foreign key',
      fields: ['userCreatedId'],
      name: 'userCreatedId-fk',
      references: {
        table: 'Users',
        field: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    });
    await queryInterface.addConstraint('Products', {
      fields: ['userShopId'],
      type: 'foreign key',
      name: 'userShopId-fk',
      references: {
        table: 'usershop',
        field: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Products',
      'userCreatedId'
    );
    await queryInterface.removeColumn(
      'Products',
      'userShopId'
    );
    await queryInterface.removeConstraint('Products', 'userCreatedId-fk');
    await queryInterface.removeConstraint('Products', 'userShopId-fk');
  }
};
