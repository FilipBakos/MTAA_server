'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    link_data: DataTypes.STRING,
    date: {
      type:DataTypes.DATE,
    }
  }, {});
  event.associate = function(models) {
    // associations can be defined here
  };
  return event;
};