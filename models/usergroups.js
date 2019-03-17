'use strict';
module.exports = (sequelize, DataTypes) => {
  const userGroups = sequelize.define('userGroups', {
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER
  }, {});
  userGroups.associate = function(models) {
    // associations can be defined here
  };
  return userGroups;
};