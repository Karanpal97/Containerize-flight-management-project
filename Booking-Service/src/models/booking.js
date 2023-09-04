'use strict';
const {
  Model
} = require('sequelize');
const {Enum}=require('../utils/common');
const {  BOOKED,  CANCELLED , PENDING, INITIATED }=Enum.BOOKING_STATUS;
console.log(CANCELLED)
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
      flightId: {
      type:DataTypes.INTEGER,
      allowNull:false},

      userId: {
      type:DataTypes.INTEGER,
      allowNull:false},

      totalCost: {
      type:DataTypes.INTEGER,
      totalCost:false},

      noOfSeats:{
        type:DataTypes.INTEGER,
        totalCost:false,
        defaultValue:1
      },

      status: {type:DataTypes.ENUM,
      values:[BOOKED, CANCELLED, PENDING, INITIATED],
      defaultValue:INITIATED,
      allowNull:false}
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};