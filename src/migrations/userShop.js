'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userShop', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdByUserId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      deliveryAddress: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('userShop',
      {
        type: 'foreign key',
        fields: ['createdByUserId'],
        name: 'createdByUserId-fk',
        references: {
          table: 'Users',
          field: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }
      }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
    await queryInterface.removeConstraint('userShop', 'createdByUserId-fk')
  }
};