'use strict';
const  authtoken  = require('./authtoken.js');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
    // name: {
    //   type: DataTypes.STRING,
    //   allowNull:false,

    //   validate: {
    //     isUnique: true,
    //     len: {
    //       args: [5,50],
    //       msg: "Nedostatocna dlzka mena - aspon 5 znakov"
    //     },
    //   }
    //   // allowNull:false
    // },
    // password: {
    //   type: DataTypes.STRING,
    //   allowNull:false,
    //   validate: {
    //     len: {
    //       args: [6,50],
    //       msg: "Nedostatocna dlzka hesla - aspon 6 znakov"
    //     },
    //   }
    //   // allowNull:false
    // },
    // email: {
    //   type: DataTypes.STRING,
    //   validate: {
    //     isEmail: {
    //       args: true,
    //       msg: "Nie je to email"
    //     }
    //   }
      
    // }
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