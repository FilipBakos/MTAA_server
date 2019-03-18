const {group, event, user, userGroups, authtoken} = require('../models/');

const getAllGroupsOfUser = (userId) => {

}

const createAssociation = (groupId, userId, res) => {
	userGroups.create({
		userId,
		groupId
	})
	.then(() => res.status(200).send(
				  'Registered'
				))
	.catch(error => res.status(400).send(
				  'podaromnici sa nieco robilo'
				));
}



module.exports = {
	createAssociation
}

