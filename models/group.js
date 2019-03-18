'use strict';
module.exports = (sequelize, DataTypes) => {
  const group = sequelize.define('group', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    mainUserId: DataTypes.INTEGER
  }, {});
  group.associate = function(models) {
    // associations can be defined here
    group.hasMany(models.event);

    group.belongsToMany(models.user, {
    	as: 'groupUsers',
    	through: 'userGroups', 
    	foreignKey: 'groupId'
    });
  };
  return group;
};