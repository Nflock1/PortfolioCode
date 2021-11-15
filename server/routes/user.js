const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const userData = require('../models/userData');
const Restroom = require('../models/restroom')
const Review = require('../modes/review')
const { MongoTopologyClosedError } = require('mongoose/node_modules/mongodb');
const { resetWarningCache } = require('prop-types');
const userRoutes = express.Router();
module.exports = userRoutes;

//may need to revise this string


app.post('/api/register', async (req, res) => {
	const { username, password: plainTextPassword } = req.body

	if (!username || typeof username !== 'string') {
		return res.json({ message: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ message: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			message: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 5)

	try {
		const response = await User.create({
			username,
			password
		})
		console.log('User created successfully: ', response)
		res.sendStatus(200)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ message: 'Username already in use' })
		}
		throw error
	}

	res.json({ message: 'User has been registered' })
})


app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ message: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful
        //want to see if we need to define this
        console.log("jwt secret: " + process.env.JWT_SECRET);
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			process.env.JWT_SECRET
		)

		return res.json({ message: 'login successfully authenticated', data: token })
	}

	res.json({ message: 'Invalid username/password' })
})

function verifyJWT(req, res, next) {
	const token = req.headers["x-access-token"]
	
	if(token) {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if(err) { 
				console.log(err);
				return res.json({
					message: "Failed To Authenticate",
					isLoggedIn: false
				})
			}
			req.user = {};
			req.user.id = decoded.id
			req.user.username = decoded.username
			next()
		})
	} else{
		res.json({message: "Incorrect Token Given", isLoggedIn: false})
	}
}

//removes currently logged in user
app.delete('/api/rm-user', verifyJWT, async (req, res) => {
    let myquery = { _id: objectId(req.user.id)};
    User.deleteOne(myquery, (err, obj) => {
        if(err) throw err;
		res.status(obj);
		UserData.deleteOne(myquery, (error, object) =>{
			if(error) throw error;
			res.status(object);
		})
        res.json({message: "1 user successfully deleted", isLoggedIn: false})
    })
})

//gets user data
app.get('api/userData', verifyJWT, async (req, res) =>{
	let myquery = { _id: objectId(req.user.id)}
	const userData = await UserData.findOne(myquery).lean()
	res.json({message: "user sucessfully retreived", data: userData})
})

//for updating user data with a new userData object
app.post('/api/update-userData', verifyJWT, async (req, res)=>{
	let myQuery = { _id: objectId(req.user.id)}
	// may need to make this a mongoose object/schema
	let newData = req.body;
	userData.updateOne(myQuery, newData ,(err, response) =>{
		if(err) throw err;
		res.json({message: "userData has been sucessfully updated", data: response});
	})
})

//posting a new restroom object to the server
app.post('/api/new-RR', verifyJWT, async (req, res) =>{
	const { name, description, address, longitude, lattitude, clean, smell, TP, safety, privacy, busyness, price, handicap, genderNeutral, hygiene, changingStation } = req.body
	try {
		//may need to modify creation based on if all fields exist
		const response = await Restroom.create({
			name, description, 
			address, longitude, 
			lattitude, clean, 
			smell, TP, safety, 
			privacy, busyness, 
			price, handicap, 
			genderNeutral, hygiene, 
			changingStation
		})
		console.log('Restroom created successfully: ', response)
		res.sendStatus(200)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ message: 'Restroom already exists' })
		}
		throw error
	}
})

//allows you to update a restroom object by pushing new restroom object for testing
app.post('/api/update-RRData', verifyJWT, async (req, res)=>{
	let myquery = {address:  req.body.address} || {name: req.body.name};
	// may need to make this a mongoose object/schema
	let newData = req.body;
	userData.updateOne(myquery, newData , (err, response) =>{
		if(err) throw err;
		res.json({message: "Restroom has been sucessfully updated", data: response});
	})
})


//deletes RR by address or name
app.delete('/api/del-RR', verifyJWT, async(req, res) => {
	//should have something here so only authorized accounts can delete RR
	//first try to query address, but if address not provided then name
	let myquery = {address:  req.body.address} || {name: req.body.name};
    Restroom.deleteOne(myquery, (err, obj) => {
        if(err) throw err;
		res.status(obj);
        res.json({message: "1 restroom successfully deleted"})
    })
})

app.get('/api/restroom', async (req, res) => {
	let myquery = {address:  req.body.address} || {name: req.body.name};
	const restroom = await Restroom.findOne(myquery).lean()
	if(!restroom){
		return res.json({message: "restroom not found"})
	}
	res.json({message: "restroom has been found", data: restroom})
})

//get restroom within x square miles
//req.body should contain lat and long coords to restroom as well 
//as a distance field for the range in miles needed
//no verify because geusts can do this
app.get('/api/near-RR', async (req, res) =>{
	long = req.body.longitude + req.body.distance/54.5833333
	lat = req.body.lattitude + req.body.distance/54.5833333
	let myquery = {longitude:{$gte: -1*long, $lt: long}, lattitude: {$gte: -1*lat, $lt: lat}}
	const restroom = Restroom.find(myquery).lean();
	if(!restroom){
		return res.json({message: "no nearby restrooms"})
	}
	res.json({message: "restrooms sucessfully found", data: restroom})
})

//post for when a user leaves a new review
app.post('/api/new-review', verifyJWT, async (req, res) =>{
	const rest = await Restroom.get('api/restroom', req.body.RestroomId);
	if(!rest){
		return res.json({message: "restroom not found"})
	}
	const restNew = rest
	//first index of each rating is the avg, 2nd is the number of reviews that contributed
	restNew.clean[0] = (restNew.clean[0]*restNew.clean[1] + req.body.clean)/restNew.clean[1]
	restNew.smell[0] = (restNew.smell[0]*restNew.smell[1] + req.body.smell)/restNew.smell[1]
	restNew.TP[0] = (restNew.TP[0]*restNew.TP[1] + req.body.TP)/restNew.TP[1]
	restNew.safety[0] = (restNew.safety[0]*restNew.safety[1] + req.body.safety)/restNew.safety[1]
	restNew.privacy[0] = (restNew.privacy[0]*restNew.privacy[1] + req.body.privacy)/restNew.privacy[1]
	restNew.busyness[0] = (restNew.busyness[0]*restNew.busyness[1] + req.body.busyness)/restNew.busyness[1]
	restNew.price += req.body.price
	restNew.handicap += req.body.handicap
	restNew.genderNeutral += req.body.genderNeutral
	restNew.hygiene += req.body.hygiene
	restNew.changingStation += req.body.changingStation

	//create new object when history is a thing
})
