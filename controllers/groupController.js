const {group, event, user, userGroups, authtoken} = require('../models/');
const userController = require('./userController.js');


const getAllGroupsByUser = (userId, res) => {
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
		userController.getGroups(result[0].usersGroups,userId, (groups) => {
			res.status(200).send(groups)
		})
	})
	.catch(error => console.log(error))
}

const createAssociation = (groupId, userId, res) => {
	userGroups.create({
		userId,
		groupId
	})
	.then(() => res.status(201).send(
				  'Registered'
				))
	.catch(error => res.status(400).send(
				  'podaromnici sa nieco robilo'
				));
}




module.exports = {
	createAssociation,
	getAllGroupsByUser
}

