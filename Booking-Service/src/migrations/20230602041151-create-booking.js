'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Enum}=require('../utils/common');
const {  BOOKED,  CANCELLED , PENDING, INITIATED }=Enum.BOOKING_STATUS;
console.log(CANCELLED)
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      noOfSeats:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1
      },
      totalCost: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      status: {
        type: Sequelize.ENUM,
        values:[BOOKED, CANCELLED, PENDING, INITIATED],
        defaultValue:INITIATED,
        allowNull:false
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};