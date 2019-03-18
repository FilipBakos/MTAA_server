const {group, event, user, userGroups, authtoken} = require('../models/');
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
const bcrypt = require('bcrypt');


const generate = function(userId, callback) {
    uidgen.generate((err, uid) => {
	  if (err) throw err;
	  console.log("UID : ",uid); 
	  return authtoken.create({
	   token: uid,
	   userId 
		}).then(() => {
			let obj = {
			  id: userId,
			  authToken: uid
			};
			callback(obj); 
		})
	});
}

const authorize = function (id, callback) {
  generate(id, (obj) => callback(obj));
};

const authenticate = function (username, password, res) {
	user.findAll({
		where: {
	  		name: username
			},
	    include: [{
	    	as: 'usersGroups',
	    	model: group
	    }]
	})
	  .then( userResponse => {
	  	if (userResponse.length === 0) 
		  	res.status(400).send(
			    'Wrong username'
			);
	    bcrypt.compare(password, userResponse[0].dataValues.password, function(err, result) {
		   	if (result === false) {
		   		res.status(400).send(
				    'Wrong password'
				);
		   	}
		   	if (result === true) {
		   		getGroups(userResponse[0].usersGroups, (groups) => {
		   			authorize(userResponse[0].dataValues.id, (obj) => {
		   				obj.name = username,
		   				obj.groups = groups,
		   				res.status(200).send(obj);
		   			}) 
		   		})
		   	}
		});
	  })
	  .catch( error => {
	    console.log(error)
	  });
};

// oseka z databazy len to co treba
const getGroups = (groups, callback) => {

	let groupsShort = [];

	groups.forEach((group) => {
	  let obj = {
	  	id: group.dataValues.id,
	  	name: group.dataValues.name,
	  	description: group.dataValues.description,
	  	mainUserId: group.dataValues.mainUserId,
	  }
	  groupsShort.push(obj);
	});
	callback(groupsShort);
	return groupsShort;
}

module.exports = {
	generate,
	authorize,
	authenticate
};

