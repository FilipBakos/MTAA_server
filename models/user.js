'use strict';
const  authtoken  = require('./authtoken.js');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    mainGroupId: DataTypes.INTEGER
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.belongsToMany(models.group, {
    	as: 'usersGroups',
    	through: 'userGroups', 
    	foreignKey: 'userId'
    });

    user.hasMany(models.authtoken);
  };

  
  return user;
};