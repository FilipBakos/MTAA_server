var express = require('express')
const bcrypt = require('bcrypt');
const multer = require('multer');
var path = require('path');
const { check, validationResult } = require('express-validator/check');


const {group, event, user, userGroups, authtoken} = require('../models/');
const userController = require('../controllers/userController.js');
const groupController = require('../controllers/groupController.js');
const eventController = require('../controllers/eventController.js');

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null,'./images/');
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname)
	}
})
const upload = multer({storage: storage})


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
// 	  		name: 'filip184'
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
// 
// event.findByPk(5).then((event) => console.log(event));


// event.update({name: 'Fiit event'}, {
// 				returning: true,
// 				where:{
// 					id:250
// 				}
// 			})
// 			.then((event) => {
// 				console.log(event[0]);
// 			})
// 			
//authtoken.generate(1);



//////////////////////////
/////////////////////////	raw: true,
///////////////////////

// user.create({
// 	name: "FilipBakos",
// 	email: "asd@gmail.com",
// 	password: "absfgasdfa"
// }).then((user) => {
// 	console.log("vytvorilo")
// }).catch(error => {
// 	error.errors.forEach((item) => {
// 	  console.log(item.message);
// 	})
// })

// event.create({
// 	name: "asd",
// 	description: "absfg",
// 	link_data: "",
// 	date: 1552021784
// }).then((user) => {
// 	console.log("vytvorilo")
// }).catch(error => {
// 	console.log(error)
	// error.errors.forEach((item) => {
	//   console.log(item.message);
	// })
// })


// userGroups.findOrCreate({
// 	raw:true,
// 	where: {
// 		groupId: 50,
// 		userId: 1
// 	}
// }).then((result) => {
// 	console.log(result);
// })

var app = express();

const port = 3000; 

app.use(express.json());

//CREATE USER - done
app.post('/user/register',[
	check('name').isLength({ min: 5 }),
	check('email').isEmail(),
	check('password').isLength({ min: 6 }),
	], (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array() });
	} else {
		bcrypt.hash(req.body.password, 10,(err, hash) => {
			req.body.password = hash;
			//Najskor vytvori usera a potom groupu a priradi jej main usera
			user.findAll({
				where:{
					name: req.body.name
				}
			})
			.then((users) => {
				if(users.length > 0){
					throw new Error("Taky user uz existuje")
				} else {
					return user.create(req.body)
				}
			})
			.then((user) => {
			  	group.create({
					name: req.body.name + " main",
					description: req.body.name + " main group",
					mainUserId: user.dataValues.id,
					main: true
				}).then((group) => {
					groupController.createAssociation(group.dataValues.id, user.dataValues.id, res);
				}).catch(error => console.log(error));
			}).catch(error => res.status(400).send(`Error: ${error}`));
		});
	}	
});

//LOGIN USER - done
app.post('/user/login', (req, res) => {
	const { name, password } = req.body;

	if (!name || !password) {
	  return res.status(400).send(
	    'No name or password'
	  );
	}

	console.log(name);

	userController.authenticate(name, password, res);
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


//DELETE GROUP - done
app.delete('/group/:id/delete', (req, res) => {
	const token = req.headers.authorization;
	const id = req.headers.id;
	const groupId = req.params.id;
	userController.isLogged(id, token)
	.then((result) => {
		console.log('Tu som teraz ??? ')
		return group.destroy({
			where:{
				id: groupId,
				mainUserId: id,
				main: false
			}
		})
	}, (error) => {
        throw new Error(error);
    })
	.then((group) => {
		 console.log('Tu som sa dostal 1')
		if(group === 1){
			return event.destroy({
				where:{
					groupId: groupId
				}
			})
		} else {
			throw new Error("Chyba pri mazani groupy")
		}
	})
	.then((event) => {
		console.log('Tu som2')
		return userGroups.destroy({
			where:{
				groupId: groupId
			}
		})
	})
	.then((response) => {
			console.log('Tu som1')
			res.status(200).send("Vsetko OK");
	})
	.catch(error => {
		res.status(400).send(`error: , ${error}`);
	});

});

app.put('/user/:id/connect', (req, res) => {
	const token = req.headers.authorization;
	const id = req.headers.id;
	const groupId = req.params.id;
	userController.isLogged(id, token)
	.then((result) => {
		return group.findAll({
			raw: true,
			where: {
				id: groupId,
				main: false
			}
		})
	}, (error) => {
        throw new Error(error);
    })
    .then((group) => {
    	console.log(group)
    	if(group.length === 1 ){
    		return userGroups.findOrCreate({
						raw:true,
						where: {
							groupId: groupId,
							userId: id
						}
					})
    	} else {
    		throw new Error("Nie je taka groupa");
    	}
    })
    .then((result) => {
    	res.status(200).send('Connected');
    })
	.catch(error => {
		res.status(400).send(`error: , ${error}`);
	});

});


//CREATE EVENT -done
app.post('/event/create',[
	check('name').isLength({ min: 5 }),
	check('description').isLength({ min: 5 }),
	check('groupId').isInt(),
	], upload.single('image'), (req, res) => {

	const errors = validationResult(req.body);

	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array() });
	} else {
		const token = req.headers.authorization;
		const id = req.headers.id;
		userController.isLogged(id, token)
		.then((result) => {
			return group.findAll({
				where:{
					id: req.body.groupId,
					mainUserId: id
				}
			})
			
		}, (error) => {
	        throw new Error(error);
	    })
	    .then((group) => {
	    	if(group.length > 0){
	    		return event.findAll({
	    			where: {
	    				name: req.body.name,
	    				date: req.body.date,
	    				groupId: req.body.groupId
	    			}
	    		})
	    	} else {
	    		throw new Error("Nie je taka groupa alebo nie je jej Owner");
	    	}
	    })
	    .then((events) => {
	    	if(events.length === 0){
				return event.create({
					name: req.body.name,
					date: req.body.date,
					description: req.body.description,
					groupId: req.body.groupId,
					link_data: req.file.path
				})
	    	} else {
	    		throw new Error("Uz je taky event");
	    	}
	    })
		.then((event) => {
			res.status(201).send("OK");
		})
		.catch(error => res.status(400).send(`error: , ${error}`));
	}
	
});

//LIST EVENT - listne vsetky eventy danej groupy - done
app.get('/event/:id/list', (req, res) => {
	const token = req.headers.authorization;
	const id = req.headers.id;
	const groupId = req.params.id;
	userController.isLogged(id, token)
	.then((result) => {
		return userGroups.findAll({
			where: {
				groupId: groupId,
				userId: id
			}
		})
	}, (error) => {
        throw new Error(error);
    })
    .then((result) => {
    	if(result.length === 1) {
			return event.findAll({
				where:{
					groupId: groupId
				}
			})
    	} else {
    		throw new Error("nie je pripojeny k danej groupe")
    	}
    })
	.then((events) => {
		eventController.getEvents(events, (obj) => {
			res.status(200).send(obj)
		})
	})
	.catch(error => res.status(400).send(`error: , ${error}`));
	
});

//UPDATE EVENT--done
app.put('/event/:id/update', (req, res) => {
	const token = req.headers.authorization;
	const id = req.headers.id;
	const eventId = req.params.id;
	userController.isLogged(id, token)
	.then((result) => {
		return event.findByPk(eventId)
	}, (error) => {
        throw new Error(error);
    })
	.then((event) => {
		if(event !== null){
			return group.findByPk(event.dataValues.groupId)
		} else {
			throw new Error("Nie je taky event")
		}
	})
	.then((group) => {
		if(group !== null){
			console.log(group.dataValues.mainUserId , ' -- ', parseInt(id));
			if(group.dataValues.mainUserId === parseInt(id)){
				return event.update(req.body, {
							returning: true,
							where:{
								id:eventId
							}
						})
			} else {
				throw new Error("Nemoze updatovat, nie je to jeho groupa");
			}
		} else {
			throw new Error("Nie je taka groupa");
		}
	})
	.then((response) => {
		console.log(response[1])
		if(response[0] == 1 ){
			// let obj = event[1][0].dataValues;
			res.status(200).send(response[1][0].dataValues);
		} else {
			throw new Error("chyba pri mazani");
		}
	})
	.catch(error => {
		res.status(400).send(`error: , ${error}`);
	});

});

//DELETE EVENT--done
app.delete('/event/:id/delete', (req, res) => {
	const token = req.headers.authorization;
	const id = req.headers.id;
	const eventId = req.params.id;
	userController.isLogged(id, token)
	.then((result) => {
		return event.findByPk(eventId)
	}, (error) => {
        throw new Error(error);
    })
	.then((event) => {
		if(event !== null){
			return group.findByPk(event.dataValues.groupId)
		} else {
			throw new Error("Nie je taky event")
		}
	})
	.then((group) => {
		if(group !== null){
			console.log(group.dataValues.mainUserId , ' -- ', parseInt(id));
			if(group.dataValues.mainUserId === parseInt(id)){
				return event.destroy({
					where:{
						id:eventId
					}
				})
			} else {
				throw new Error("Nemoze mazat, nie je to jeho groupa");
			}
		} else {
			throw new Error("Nie je taka groupa");
		}
	})
	.then((response) => {
		if(response === 1 ){
			res.status(200).send('event bol vymazany');
		} else {
			throw new Error("chyba pri mazani");
		}
	})
	.catch(error => {
		res.status(400).send(`error: , ${error}`);
	});

});



//GET DATA
app.get('/data/get/:id', (req, res) => {
	const token = req.headers.authorization;
	const id = req.headers.id;
	const eventId = req.params.id;
	userController.isLogged(id, token)
	.then((result) => {
		return event.findByPk(eventId)
	}, (error) => {
        throw new Error(error);
    })
    .then((event) => {
    	if(event !== null) {
    		if(event.dataValues.link_data){
    			res.sendFile(path.join(__dirname, "../", event.dataValues.link_data));
    		}
    	} 
    	else {
    		throw new Error("Nie je taky event")
    	}
    })
	.catch(error => {
		res.status(400).send(`error: , ${error}`);
	});
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
app.post('/group/create',[
	check('name').isLength({ min: 5 }),
	check('description').isLength({ min: 5 })
	], (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array() });
	} else {
		const token = req.headers.authorization;
		const id = req.headers.id;
		userController.isLogged(id, token)
		.then((result) => {
			return group.findAll({
				where: {
					name: req.body.name
				}
			})
		}, (error) => {
			console.log(error)
	        throw new Error(error);
	    })
	    .then((groups) => {
	    	if(groups.length === 0){
				return group.create({
					name: req.body.name,
					description: req.body.description,
					mainUserId: id,
					main: false
				})
	    	} else {
	    		throw new Error('Groupa uz existuje');
	    	}
	    })
	    .then((group) => {
			return userGroups.create({
				userId: id,
				groupId: group.dataValues.id
			})
		})
		.then(() => {
			res.status(201).send('Group was created')
		}).catch(error => res.status(400).send(`error: , ${error}`));
	}
	
});

//LIST GROUP
app.get('/group/list', (req, res) => {
	const token = req.headers.authorization;
	const id = req.headers.id;
	userController.isLogged(id, token)
	.then((result) => {
			groupController.getAllGroupsByUser(id, res);
	}, (error) => {
		res.status(400).send('Not logged in');
	}).catch(error => res.status(400).send(`error: , ${error}`));
});

