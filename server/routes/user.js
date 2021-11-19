const JWT_SECRET = "o7br@c0b4!@290y83r2@C$^#$%IHtqewuth3%#$&45th029t"
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const UserData = require('../../models/userData');
const Restroom = require('../../models/restroom')
const Review = require('../../models/review')
const userRoutes = express.Router();
module.exports = userRoutes;

//may need to revise this string


userRoutes.post('/api/register', async (req, res) => {
	const { username, password: plainTextPassword } = req.body

	const password = await bcrypt.hash(plainTextPassword, 5)

	try {
		const response = await User.create({
			username,
			password
		})
		res.status(200)
		res.json({ message: 'User has been registered sucessfully', data:response })
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			res.status(400)
			return res.json({ message: 'Username already in use' })
		}
		throw error
	}
})


userRoutes.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username: username }).lean()

	if (!user) {
		res.status(400)
		return res.json({ message: 'Invalid username/password' })
	}
	console.log(user._id)

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful
        //want to see if we need to define this
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)
		res.status(200)
		return res.json({ message: 'login successfully authenticated', data: token })
	}
	res.status(400)
	res.json({ message: 'Invalid username/password' })
})

function verifyJWT(req, res, next) {
	const token = req.headers["x-access-token"]
	if(token) {
		jwt.verify(token, JWT_SECRET, (err, decoded) => {
			if(err) { 
				res.status(401)
				res.json({
					message: "Failed To Authenticate",
					isLoggedIn: false
				})
				throw err
			}
			req.user = {};
			req.user.id = decoded.id
			req.user.username = decoded.username
			next()
		})
	} else{
		res.status(401)
		res.json({message: "Incorrect Token Given", isLoggedIn: false})
	}
}

//removes currently logged in user
userRoutes.delete('/api/rm-user', verifyJWT, async (req, res) => {
    let myquery = { _id: req.user.id};
	console.log(myquery);
    User.deleteOne(myquery, (err, obj) => {
        if(err) throw err;
		UserData.deleteOne(myquery, (error, object) =>{
			if(error) throw error;
		})
	})
	res.status(200);
	res.json({message: "1 user successfully deleted", isLoggedIn: false, data: obj})
})

//gets user data 
userRoutes.get('api/userData', verifyJWT, async (req, res) =>{
	var ObjectId = require('mongoose').Types.ObjectId;
	let myquery = { _id: ObjectId(req.user.id)}
	const userData = await UserData.findOne(myquery, (err, response) =>{
		if(err) throw err;
	}).lean()
	if(userData){
	res.status(200)
	res.json({message: "user sucessfully retreived", data: userData})
	} else {
		res.status(400)
		res.json({message: "userdata not found in database"});
	}
})

//for updating user data with a new userData object
userRoutes.post('/api/update-userData', verifyJWT, async (req, res)=>{
	var ObjectId = require('mongoose').Types.ObjectId;
	let myQuery = { _id: ObjectId(req.user.id)}
	// may need to make this a mongoose object/schema
	let newData = req.body;
	UserData.updateOne(myQuery, newData , (err, response) =>{
		if(err) {
			res.sendStatus(400);
			throw err;
		}
		res.status(200)
		res.json({message: "Restroom has been sucessfully updated", data: response});
	})
})

//posting a new restroom object to the server
userRoutes.post('/api/new-RR', verifyJWT, async (req, res) =>{
	const { name, description, address, longitude,
		 lattitude, clean, smell, TP, safety, 
		 privacy, busyness, price, handicap, 
		 genderNeutral, hygiene, changingStation } = req.body

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

		res.sendStatus(200)
		//return res.json({message: 'Restroom created successfully: ', data: response})
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			res.status(400);
			return res.json({ message: 'Restroom already exists' })
		}
		throw error
	}
})

//allows you to update a restroom object by pushing new restroom object for testing
userRoutes.post('/api/update-RRData', verifyJWT, async (req, res)=>{
	let myquery = {address:  req.body.address} || {name: req.body.name};
	// may need to make this a mongoose object/schema
	let newData = req.body;
	UserData.updateOne(myquery, newData , (err, response) =>{
		if(err) {
			res.status(400);
			throw err;
		}
			res.status(200)
			res.json({message: "Restroom has been sucessfully updated", data: response});
	})
})


//deletes RR by address or name
userRoutes.delete('/api/rm-RR', verifyJWT, async(req, res) => {
	//should have something here so only authorized accounts can delete RR
	//first try to query address, but if address not provided then name
	let myquery = {}
	if (typeof address !== 'undefined') myquery = {address:  req.body.address}
	else myquery = {name: req.body.name};
	console.log(myquery)
    Restroom.deleteOne(myquery, (err, obj) => {
        if(err) {
			res.sendStatus(400);
			throw err;
		}
		res.status(200);
        res.json({message: "1 restroom successfully deleted", data: obj})
    })
})

//get specific restroom
userRoutes.get('/api/restroom', async (req, res) => {
	let myquery = {address:  req.body.address} || {name: req.body.name};
	const restroom = await Restroom.findOne(myquery).lean()
	if(!restroom){
		res.status(400)
		return res.json({message: "restroom not found"})
	}
	res.status(200)
	res.json({message: "restroom has been found", data: restroom})
})

//get restroom within x square miles
//req.body should contain lat and long coords to restroom as well 
//as a distance field for the range in miles needed
//no verify because geusts can do this
//make radius
userRoutes.get('/api/near-RR', async (req, res) =>{
	long1 = req.body.longitude - req.body.radius/(54.5833333*2)
	long2 = req.body.longitude + req.body.radius/(54.5833333*2)
	lat1 = req.body.lattitude - req.body.radius/(54.5833333*2)
	lat2 = req.body.lattitude + req.body.radius/(54.5833333*2)
	let myquery = {longitude:{$gte: long1, $lte: long2}, lattitude: {$gte: lat1, $lte: lat2}}
	const restroom = Restroom.find(myquery).lean();

	if(!restroom){
		res.status(200)
		return res.json({message: "no nearby restrooms"})
	}
	let rNew = restroom
	for(var i = 0; i<restroom.length; i++){
		if(Math.pow(restroom[i].longitude) + Math.pow(restroom[i].lattitude) > Math.pow(req.body.radius)){
			rNew = restroom.splice(i, 1)
		}
	}
	res.status(200)
	res.json({message: "restrooms sucessfully found", data: restroom})
})

//post for when a user leaves a new review
userRoutes.post('/api/new-review', verifyJWT, async (req, res) =>{
	const rest = await Restroom.get('api/restroom', req.body.RestroomID);
	if(!rest){
		return res.json({message: "restroom not found"})
	}

	const { name, description, address, longitude,
		lattitude, clean, smell, TP, safety, 
		privacy, busyness, price, handicap, 
		genderNeutral, hygiene, changingStation } = req.body
	
	const myQuery = {RestroomID: req.RestroomID, UserID: req.UserID}
	let post = await Review.get("/api/unique-review", myQuery)
	if(post) {
		const rev = await Review.create({
			name, description, 
			address, longitude, 
			lattitude, clean, 
			smell, TP, safety, 
			privacy, busyness, 
			price, handicap, 
			genderNeutral, hygiene, 
			changingStation
		})
		res.Sendstatus(rev)
	} else {
		res.status(400)
		res.json({message: "this is a duplicate review"})
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

	res.status(200)
	return res.json({message: "review sucessfully created"})

	//create new object when history is a thing
})

//need to ensure path security here
userRoutes.get('/api/unique-review', async (req, res) =>{
	let myQuery = {
		RestroomID: req.body.RestroomID,
		UserID: req.body.UserID
	}
	const rest = Restroom.findOne(myQuery).lean()
	if(!rest){
		return res.json({data: true})
	}
	res.json({data: false})
})

//deletes review
userRoutes.delete('/api/del-review', verifyJWT, async(req, res) => {
	//should have something here so only authorized accounts can delete RR
	//first try to query address, but if address not provided then name
	let myquery = {RestroomID:  req.body.RestroomID, UserID: req.body.UserID};
    Restroom.deleteOne(myquery, (err, obj) => {
        if(err) {
			res.sendStatus(400);
			throw err;
		}
		res.status(200);
        res.json({message: "1 review successfully deleted", data: obj})
    })
})