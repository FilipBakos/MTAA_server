const {group, event, user, userGroups, authtoken} = require('../models/');
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
const bcrypt = require('bcrypt');


const generate = function(userId, callback) {
    uidgen.generate((err, uid) => {
		if (err) throw err;
		return authtoken.create({
			 token: uid,
			 userId 
		})
		.then(() => {
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

	  	 		authtoken.findAll({
	  	 			where: {
	  	 				userId: userResponse[0].dataValues.id
	  	 			}
	  	 		})
	  	 		.then((result) => {
	  	 			if (result.length > 0){
	  	 				authtoken.destroy({
	  	 					where: {
	  	 						userId: userResponse[0].dataValues.id
	  	 					}
	  	 				}).then((result) => {
	  	 					getGroups(userResponse[0].usersGroups, userResponse[0].id, (groupsOwned, groupsConnected) => {
				  	 			authorize(userResponse[0].dataValues.id, (obj) => {
				  	 				obj.name = username,
				  	 				obj.groupsOwned = groupsOwned,
				  	 				obj.groupsConnected = groupsConnected,
				  	 				res.status(200).send(obj);
				  	 			}) 
				  	 		})
	  	 				})
	  	 			} else {
	  	 				getGroups(userResponse[0].usersGroups, userResponse[0].id, (groupsOwned, groupsConnected) => {
			  	 			authorize(userResponse[0].dataValues.id, (obj) => {
			  	 				obj.name = username,
			  	 				obj.groupsOwned = groupsOwned,
				  	 			obj.groupsConnected = groupsConnected,
			  	 				res.status(200).send(obj);
			  	 			}) 
			  	 		})
	  	 			}
	  	 		})
	  	 	}
	  	});
	})
	.catch( error => {
	  console.log(error)
	});
};

const isLogged = function (id, token, res){
	return new Promise(function(resolve, reject) {
        authtoken.findAll({
			where: {
				userId: id,
				token: token
			}
		})
		.then((result) => {
			if(result.length === 0) {
				reject('not logged in');
			} else resolve(true);
		})
		.catch(error => {
			reject(error);
		})
    })
}


const logout = (id, token, res) => {
	authtoken.destroy({
	    where: {
	        userId: id,
	        token: token
	    }
	})
	.then((result) => {
		console.log(result)
		if (result){
			let obj = {message: 'logged out'}
			res.status(200).send(obj)
		}
		else 
			res.status(400).send('Not logged out')
	})
	.catch(error => res.status(400).send('Error'));
}



// oseka z databazy len to co treba
const getGroups = (groups, userId, callback) => {

	let groupsOwned = [];
	let groupsConnected = [];
	groups.forEach((group) => {
		let obj = {
			id: group.dataValues.id,
			name: group.dataValues.name,
			description: group.dataValues.description,
			mainUserId: group.dataValues.mainUserId,
			main: group.dataValues.main
		}
		if(group.dataValues.mainUserId === parseInt(userId)) {
			groupsOwned.push(obj);
		} else groupsConnected.push(obj);
	});

	let obj = {
		groupsOwned,
		groupsConnected
	}
	callback(groupsOwned, groupsConnected);
	return obj;
}

module.exports = {
	generate,
	authorize,
	authenticate,
	isLogged,
	logout,
	getGroups
};

