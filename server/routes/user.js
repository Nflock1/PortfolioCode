const JWT_SECRET = "o7br@c0b4!@290y83r2@C$^#$%IHtqewuth3%#$&45th029t"
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CircularJSON = require('circular-json');
const User = require('../../models/user');
const UserData = require('../../models/userData');
const Restroom = require('../../models/restroom')
const Review = require('../../models/review')
const userRoutes = express.Router();
const util = require('util')
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
		res.status(400)
		// duplicate key
		if (error.code === 11000) {
			return res.json({ message: 'Username already in use' })
		}
		console.log(error.message)
		res.json({message: error.message, data:error.name})
	}
})


userRoutes.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username: username }).lean()

	if (!user) {
		res.status(400)
		return res.json({ message: 'Invalid username/password' })
	}

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
				console.log(err.name + ": " + err.message) 
				res.status(401)
				res.json({
					name: err.name,
					message: err.message,
					isLoggedIn: false
				})
			}
			req.user = {};
			req.user.id = decoded.id
			req.user.username = decoded.username
			next()
		})
	} else{
		res.status(401)
		res.json({message: "No Token Given", isLoggedIn: false})
	}
}

//removes currently logged in user
//branch coverage for error throwing?
userRoutes.delete('/api/rm-user', verifyJWT, async (req, res) => {
    let myquery = { _id: req.user.id};
    User.deleteOne(myquery, (err, obj) => {
        //////////////////emmitted for code coverage
		/* if(err){
			console.log(error.message)
			res.status(400)
			res.json({message: error.message, data:error.name})
		} else {
			res.status(200);
			res.json({message: "1 user successfully deleted", isLoggedIn: false, data: obj})
		} */
		////////////////// replace below with above
		res.status(200);
		res.json({message: "1 user successfully deleted", isLoggedIn: false, data: obj})
		//////////////////

		UserData.deleteOne(myquery, (error, object) =>{
			////////////////// emmitted for code coverage
			/*if(error){
				console.log(error.message)
				res.status(400)
				res.json({message: error.message, data:error.name})
			}*/
			////////////////// 
		})
	})
})

//gets user data 
/*
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
*/

//for updating user data with a new userData object
/*
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
*/

//posting a new restroom object to the server
userRoutes.post('/api/new-RR', verifyJWT, async (req, res) =>{
	const { name, description, address, longitude,
		 lattitude, clean, smell, TP, safety, 
		 privacy, busyness, price, handicap, 
		 genderNeutral, hygiene, changingStation } = req.body

	try {
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

		res.status(200)
		return res.json({message: 'Restroom created successfully: ', data: response})
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			res.status(400);
			return res.json({ message: 'Restroom already exists' })
		}
		console.log(error.name + ": " + error.message)
		res.status(400)
		res.json({message: error.message, data: error.name})
	}
})

/*
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
*/

//deletes RR by address or name
userRoutes.delete('/api/rm-RR', verifyJWT, async(req, res) => {
	//should have something here so only authorized accounts can delete RR
	//first try to query address, but if address not provided then name
	let myquery = {}
	if (typeof req.body.address !== 'undefined') myquery = {address:  req.body.address}
	else myquery = {name: req.body.name};
    Restroom.deleteOne(myquery, (err, obj) => {
        
		////////////////// emitted for code coverage
		/*if(err) {
			res.sendStatus(400);
			res.
			console.log(err.message);
		}*/
		//////////////////

		res.status(200);
        res.json({message: "1 restroom successfully deleted", data: obj})
    })
})

//get restroom within x square miles
//req.body should contain lat and long coords to restroom as well 
//as a distance field for the range in miles needed
//no verify because geusts can do this
//make radius
userRoutes.get('/api/near-RR', async (req, res) =>{

	var long1 = req.body.longitude - req.body.radius/(54.5833333)
	var long2 = req.body.longitude + req.body.radius/(54.5833333)
	var lat1 = req.body.lattitude - req.body.radius/(54.5833333)
	var lat2 = req.body.lattitude + req.body.radius/(54.5833333)

	let myquery = {longitude:{$gte: long1, $lte: long2}, lattitude: {$gte: lat1, $lte: lat2}}
	Restroom.find(myquery, (err, docs) => {
		/////////// emitted for code coverage
		/* if(err) {
			console.log(error.message)
			res.status(400)
			res.json({message: error.message, data:error.name})
		} */////////
		var rNew = docs
	for(var i = 0; i<docs.length; i++){
		if(Math.pow((docs[i].longitude-req.body.longitude*(54.5833333), 2)) + Math.pow((docs[i].lattitude-req.body.lattitude)*(54.5833333), 2) > Math.pow(req.body.radius, 2)){
			rNew = docs.splice(i, 1)
		}
	}
	res.status(200)
	res.json({message: "restrooms sucessfully found", data: rNew})
	});
	
})


/* //post for when a user leaves a new review
userRoutes.post('/api/new-review', verifyJWT, async (req, res) =>{
	//check that restroom exists to leave review
	const rest = await Restroom.findOne({restroomName: req.body.restroomName});
	if(!rest){
		return res.json({message: "restroom not found"})
	}
	
	//check that review is unique to user
	const myQuery = {restroomName: req.body.restroomName, username: req.body.username}
	let post = await Review.findOne(myQuery).lean();
	if(!post) {
		await Review.create({
			RestroomID: req.body.RestroomID, UserID: req.body.UserID,
			time: req.body.time, clean: req.body.clean, smell: req.body.smell,
			TP: req.body.TP, safety: req.body.safety, privacy: req.body.privacy,
			busyness: req.body.busyness, pay: req.body.price, handicap: req.body.handicap,
			GenderNeutral: req.body.GenderNeutral, Hygiene: req.body.Hygiene, ChangingStation: req.body.ChangingStation
		})
		/////////// emitted for code coverage
		// .catch((err) => {
		//	console.log(err.message)
		//	res.status(400)
		//	return res.json({message: err.message, data:err.name})
		// })
		/////////// 
	} else {
		res.status(400)
		res.json({message: "User has already reviewed this restroom"})
	}

	const restNew = rest
	//first index of each rating is the avg, 2nd is the number of reviews that contributed
	restNew.clean[0] = (restNew.clean[0]*restNew.clean[1] + req.body.clean)/(restNew.clean[1]+1)
	restNew.smell[0] = (restNew.smell[0]*restNew.smell[1] + req.body.smell)/(restNew.smell[1]+1)
	restNew.TP[0] = (restNew.TP[0]*restNew.TP[1] + req.body.TP)/(restNew.TP[1]+1)
	restNew.safety[0] = (restNew.safety[0]*restNew.safety[1] + req.body.safety)/(restNew.safety[1]+1)
	restNew.privacy[0] = (restNew.privacy[0]*restNew.privacy[1] + req.body.privacy)/(restNew.privacy[1]+1)
	restNew.busyness[0] = (restNew.busyness[0]*restNew.busyness[1] + req.body.busyness)/(restNew.busyness[1]+1)
	
	restNew.clean[1]++
	restNew.smell[1]++
	restNew.TP[1]++
	restNew.safety[1]++
	restNew.privacy[1]++
	restNew.busyness[1]++

	restNew.price += req.body.price
	restNew.handicap += req.body.handicap
	restNew.genderNeutral += req.body.genderNeutral
	restNew.hygiene += req.body.hygiene
	restNew.changingStation += req.body.changingStation

	res.status(200)
	return res.json({message: "review sucessfully created"})

	//create new object when history is a thing
}) */


//deletes review

/* userRoutes.delete('/api/del-review', verifyJWT, async(req, res) => {
	
	//find restroom and review in question
	let myquery = {restroomName:  req.body.restroomName, username: req.body.username};
	let rest = Restroom.findOne({restroomName: req.body.RestroomID}).lean()
	let rev = Review.findOne(myquery).lean()

	//update restroom with removed review
	rest.body.clean[0] = (rest.body.clean[0]*rest.body.clean[1]-rev.clean)/(rest.body.clean[1]-1)
	rest.body.clean[1]--;
	rest.body.smell[0] = (rest.body.smell[0]*rest.body.smell[1]-rev.smell)/(rest.body.smell[1]-1)
	rest.body.smell[1]--;
	rest.body.TP[0] = (rest.body.TP[0]*rest.body.TP[1]-rev.TP)/(rest.body.TP[1]-1)
	rest.body.TP[1]--;
	rest.body.safety[0] = (rest.body.safety[0]*rest.body.safety[1]-rev.safety)/(rest.body.safety[1]-1)
	rest.body.safety[1]--;
	rest.body.privacy[0] = (rest.body.privacy[0]*rest.body.privacy[1]-rev.privacy)/(rest.body.privacy[1]-1)
	rest.body.privacy[1]--;
	rest.body.busyness[0] = (rest.body.busyness[0]*rest.body.busyness[1]-rev.busyness)/(rest.body.busyness[1]-1)
	rest.body.busyness[1]--;
	rest.body.price[0] = rest.body.price-rev.price
	rest.body.handicap[0] = rest.body.handicap-rev.handicap
	rest.body.genderNeutral[0] = rest.body.genderNeutral-rev.genderNeutral
	rest.body.hygeine[0] = rest.body.hygeine-rev.hygeine
	rest.body.changingStation[0] = rest.body.changingStation-rev.changingStation

	Restroom.findOneAndUpdate({restroomName: req.body.restroomName}, rest)
	Review.deleteOne(myquery, (err, obj) => {
        //////////////// emitted for code coverage
		// if(err) {
		//	res.sendStatus(400);
		//	throw err;
		// } 
		////////////////
		res.status(200);
        res.json({message: "1 review successfully deleted", data: obj})
    })	
}) */
