'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.belongsToMany(models.group, {
    	as: 'usersGroups',
    	through: 'userGroups', 
    	foreignKey: 'userId'
    });
  };
  return user;
};