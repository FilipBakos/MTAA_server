'use strict';
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();


module.exports = (sequelize, DataTypes) => {
  const authtoken = sequelize.define('authtoken', {
    token: DataTypes.STRING
  }, {});
  authtoken.associate = function(models) {
    // associations can be defined here
  };

  authtoken.generate = function(userId) {

    uidgen.generate((err, uid) => {
	  if (err) throw err;
	  console.log("UID : ",uid); 
	  return authtoken.create({
	   token: uid,
	   userId })
	});

  }

  return authtoken;
};