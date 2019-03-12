var express = require('express')
 
var app = express();

const port =  process.env.PORT || 3000; 

app.use(express.json());

//CREATE GROUP
app.post('/group/create', (req, res) => {
	console.log(req.body);
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


