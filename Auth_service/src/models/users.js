'use strict';
const {
  Model
} = require('sequelize');
const bcrypt=require("bcrypt");
const user_role = require('./user_role');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Role, { through: "user_role", as:"role"});
    }
  }
  users.init({
    email: { 
      type:DataTypes.STRING,
    allowNull:false,
  unique:true,
validate:{
  isEmail:true
},
},
    password: {
      type:DataTypes.STRING,
    allowNull:false,
  validate:{
    len:[3,50]
  }}
  }, {
    sequelize,
    modelName: 'users',
  });
  users.beforeCreate(function encrypted(user){
    const responce=bcrypt.hashSync(user.password,8);
    user.password=responce

  })
  return users;
};