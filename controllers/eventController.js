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
const getEvents = (events, callback) => {

	let eventsShort = [];

	events.forEach((event) => {
	  let obj = {
	  	id: event.dataValues.id,
	  	name: event.dataValues.name,
	  	description: event.dataValues.description,
	  	link_data: event.dataValues.link_data,
	  	date: event.dataValues.date
	  }
	  eventsShort.push(obj);
	});
	callback(eventsShort);
	return eventsShort;
}




module.exports = {
	getAllEventsByGroup,
	getEvents
}

