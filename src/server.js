var express = require('express')
const {group, event, user, userGroups, authtoken} = require('../models/');
const userController = require('../controllers/userController.js');
const groupController = require('../controllers/groupController.js');

const bcrypt = require('bcrypt');
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
// }).then((res) => console.log(res.dataValues));

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

// user.findAll({
// 		where: {
// 	  		name: 'filip'
// 			},
// 	    include: [{
// 	    	as: 'usersGroups',
// 	    	model: group
// 	    }]
// 	})
// 	.then((user) => {
// 		console.log(user[0].dataValues.usersGroups[0].dataValues);

// 	}).catch(error => console.log(error));

// group.create({
// 	name: 'Fiit1',
// 	description: 'Fiit skupina',
// 	main: false
// }).then(() => console.log("Worked"));


//authtoken.generate(1);
 
var app = express();

const port = 3000; 

app.use(express.json());

//CREATE USER - done
app.post('/user/register', (req, res) => {

	bcrypt.hash(req.body.password, 10,(err, hash) => {
	  req.body.password = hash;
	  //Najskor vytvori groupu a potom user a priradi mu tu groupu
	  group.create({
	  	name: req.body.name + " main",
	  	description: req.body.name + " main group"
	  }).then((group) => {
	  	req.body.mainGroupId = group.dataValues.id;
	  	user.create(req.body)
	  	.then((user) => {
	  		groupController.createAssociation(group.dataValues.id, user.dataValues.id, res);
	  	})
	  	.catch(error => console.log(error));
	  }).catch(error => console.log(error));
	  
	});
});

//LOGIN USER - done
app.post('/user/login', (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
	  return res.status(400).send(
	    'No username or password'
	  );
	}

	console.log(username);

	userController.authenticate(username, password, res);
	// console.log(req.body);
	// res.send("Logging in");
});



//MIDDLEWARE - testuje ci prisla hlavicka s id usera a auth toknenom
app.use(function(req, res, next) {
  if (!req.headers.authorization || !req.headers.id) {
    return res.status(400).send('Neprisla hlavicka');
  }
  next();
});



//DELETE GROUP
app.delete('/group/:id/delete', (req, res) => {
	console.log(req.body);
	res.send(`Deleting group with id: ${req.params.id.toString()}`);
});



//CREATE EVENT
app.post('/event/create', (req, res) => {
	const token = req.headers.authorization;
	const id = req.headers.id;
	userController.isLogged(id, token)
	.then((result) => {
		if(result) {
			groupController.getAllGroupsByUser(id, res);
		}
		else {
			res.status(400).send('Not logged in');
		}
	});
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



//GET DATA
app.post('/data/get', (req, res) => {
	console.log(req.body);
	res.send("Getting data");
});

app.listen(port, () => {
	console.log('App is on port ',port);
});

//Spravene

//LOGOUT USER
app.post('/user/logout', (req, res) => {
	const token = req.headers.authorization;
	const id = req.headers.id;
	userController.logout(id, token, res);
});

//CREATE GROUP
app.post('/group/create', (req, res) => {
	const token = req.headers.authorization;
	const id = req.headers.id;
	userController.isLogged(id, token)
		.then((result) => {
			if(result) {
				group.create({
					name: req.body.name,
					description: req.body.description,
					mainUserId: id
				}).then((group) => {
					userGroups.create({
						userId: id,
						groupId: group.dataValues.id
					}).then(() => {
						res.status(200).send('Group was created')
					}).catch(error => res.status(400).send(error))
				}).catch(error => res.status(400).send(error))
			}
			else {
				res.status(400).send('Not logged in');
			}
		});
});

//LIST GROUP
app.get('/group/list', (req, res) => {
	const token = req.headers.authorization;
	const id = req.headers.id;
	userController.isLogged(id, token)
	.then((result) => {
		if(result) {
			groupController.getAllGroupsByUser(id, res);
		}
		else {
			res.status(400).send('Not logged in');
		}
	});
});

