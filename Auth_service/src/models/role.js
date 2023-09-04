'use strict';
const {
  Model
} = require('sequelize');
const {Enums}=require("../utils/common");
const users = require('./users');
const {CUSTOMER,ADMIN,FLIGHT_COMPANY}=Enums.userRole
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.users, { through: "user_role", as:"users"});
    }
  }
  Role.init({
    name: {
      type:DataTypes.ENUM({ values:[CUSTOMER,ADMIN,FLIGHT_COMPANY]}),

    allowNull:false,
    defaultValue:CUSTOMER
  }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};