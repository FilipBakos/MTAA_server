var express = require('express')
const {group, event, user, userGroups} = require('../models/');
// const models = require( '../models/index');
// const 



// VYTVORI GROUPU A AJ EVENT
// group.create({
// 	name: 'Fiit',
// 	description: 'Fiit skupina',
// 	main: false
// }).then(group => {
// 	group.createEvent({
// 		name: 'Event skupiny',
// 	    description: 'DataTypes.STRING',
// 	    link_data: 'asdfasdfadsfadfad',
// 	    date: Date.now()
// 	}).then(() => console.log("Worked"));
// });

//VYTVORI GROUPU
// group.create({
// 	name: 'Fiit1',
// 	description: 'Fiit skupina',
// 	main: false
// }).then(() => console.log("Worked"));

//Vytvori usera
// user.create({
// 	name: 'Filip',
// 	password: 'asdfasdfadf',
// 	email: 'filipbakos@asdf.asdf'
// }).then(() => console.log("Worked"));


// user.findAll({where: {
//     name: "Filip"
//   }})
//     .then( userResponse => {
//       console.log(userResponse)
//     })
//     .catch( error => {
//       console.log('asdasdasd')
//     });


//Hladanie podla ID
// user.findByPk(1)
//     .then( user => {
//       console.log(user.dataValues)
//     })
//     .catch( error => {
//       console.log('asdasdasd')
//     })

// user.findByPk(1)
//     .then( user => {
//     	console.log(user.dataValues.id);
//       group.findByPk(1)
// 	    .then( group => {
// 	      console.log(group.dataValues.id);
// 	      userGroups.create({
// 				userId: 1,
// 				groupId: 1,
// 			})
// 	      .then(() => console.log("Worked"))
// 	      .catch(error => console.log("Error"));
// 	    })
// 	    .catch( error => {
// 	      console.log(error)
// 	    })
//     })
//     .catch( error => {
//       console.log('asdasdasd')
//     })

user.findAll({
	    include: [{
	    	as: 'usersGroups',
	    	model: group
	    }]
	})
	.then(response => {
		console.log(response);

	}).catch(error => console.log(error));

// group.create({
// 	name: 'Fiit1',
// 	description: 'Fiit skupina',
// 	main: false
// }).then(() => console.log("Worked"));

 
var app = express();

const port = 3000; 

app.use(express.json());

//CREATE GROUP
app.post('/group/create', (req, res) => {
	console.log(req.body.name);
	res.send("Creating group");
});

//DELETE GROUP
app.delete('/group/:id/delete', (req, res) => {
	console.log(req.body);
	res.send(`Deleting group with id: ${req.params.id.toString()}`);
});

//LIST GROUP
app.get('/group/list', (req, res) => {
	console.log(req.body);
	res.send("Listing groups");
});

//CREATE EVENT
app.post('/event/create', (req, res) => {
	console.log(req.body);
	res.send("Creating event");
});

//LIST EVENT
app.get('/event/list', (req, res) => {
	console.log(req.body);
	res.send("Listing events");
});

//UPDATE EVENT
app.post('/event/:id/update', (req, res) => {
	console.log(req.body);
	res.send(`Updating event with id: ${req.params.id.toString()}`);
});

//DELETE EVENT
app.delete('/event/:id/delete', (req, res) => {
	console.log(req.body);
	res.send(`Deleting event with id: ${req.params.id.toString()}`);
});

//CREATE USER
app.post('/user/register', (req, res) => {
	console.log(req.body);
	res.send("Creating user");
});

//LOGIN USER
app.post('/user/login', (req, res) => {
	console.log(req.body);
	res.send("Logging in");
});

//GET DATA
app.post('/data/get', (req, res) => {
	console.log(req.body);
	res.send("Getting data");
});

app.listen(port, () => {
	console.log('App is on port ',port);
});


