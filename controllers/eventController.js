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
const getEvents = (events, groupId, callback) => {

	let eventsShort = [];

	events.forEach((event) => {
	  let obj = {
	  	id: event.dataValues.id,
	  	groupId: groupId,
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

const saveImage = (file, name, dirPath) => {
	return new Promise((resolve, reject) => {
		if (file === '') resolve('');
		
		let image = file.replace(/^data:image\/jpeg;base64,/, "");
	    require("fs").writeFile(dirPath + "\\images\\" + name + ".jpg", image, 'base64', function(err) {
			if(err) reject(err)
			else resolve(`${dirPath}/images/${name}.jpg`);
		});
	});
}




module.exports = {
	getAllEventsByGroup,
	getEvents,
	saveImage
}

