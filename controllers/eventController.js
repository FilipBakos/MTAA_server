const {group, event, user, userGroups, authtoken} = require('../models/');
const userController = require('./userController.js');


const getAllEventsByGroup = (userId, res) => {
	user.findAll({
		where: {
	  		id: userId
			},
	    include: [{
	    	as: 'usersGroups',
	    	model: group
	    }]
	})
	.then((result) => {
		userController.getGroups(result[0].usersGroups, (groups) => {
			res.status(200).send(groups)
		})
	})
	.catch(error => console.log(error))
}

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
	getAllEventsByGroup
}

