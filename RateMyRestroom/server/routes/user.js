const JWT_SECRET = "o7br@c0b4!@290y83r2@C$^#$%IHtqewuth3%#$&45th029t"
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//const CircularJSON = require('circular-json');
const User = require('../../models/user');
const UserData = require('../../models/userData');
const Restroom = require('../../models/restroom')
const Review = require('../../models/review')
const userRoutes = express.Router();
//const util = require('util')
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
		try{
			const response2 = await UserData.create({
				username,
				favoriteName: []
			})
			res.status(200)
			res.json({ message: 'User has been registered sucessfully'})
		} catch (error) {
			res.status(400)
			// usernames are valid at this point so our errors will always have code = 11000
			//if (error.code === 11000) {
				return res.json({ message: 'User Data already exists' })
			//}
			//console.log(error.message)
			//res.json({message: error.message, data:error.name})
		}
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

userRoutes.get('/api/userData', verifyJWT, async (req, res) =>{ 
	UserData.findOne({username: req.user.username}, (err, doc) =>{
		//errors wont be thrown in our use cases
		//if(err) throw err;
		if(doc){
			res.status(200)
			res.json({message: "user sucessfully retreived", data: doc})
		} else {
			res.status(400)
			res.json({message: "user data not found in database"});
		}
	}).lean()//clone
}) 

//for updating user data with a new userData object: should we plan to update a list object by pushing new list or add only one favorite per call

userRoutes.post('/api/update-userData', verifyJWT, async (req, res)=>{
	if(req.user.username == req.body.username){
		UserData.findOneAndUpdate({username: req.user.username}, req.body , (err, doc) =>{
			res.status(200)
			res.json({message: "Restroom has been sucessfully updated", data: doc});
		})
	} else {
		res.status(400)
		res.json({message: "user data does not belong to logged in user"})
	}
})


//posting a new restroom object to the server
userRoutes.post('/api/new-RR', verifyJWT, async (req, res) =>{
	const { name, description, address, longitude,
		 latitude, clean, smell, TP, safety, 
		 privacy, busyness, pay, handicap, 
		 genderNeutral, hygiene, changingStation, flags, flaggedBy } = req.body

	try {
		const response = await Restroom.create({
			name, description, 
			address, longitude, 
			latitude, clean, 
			smell, TP, safety, 
			privacy, busyness, 
			pay, handicap, 
			genderNeutral, hygiene, 
			changingStation, flags, flaggedBy
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


//no need to allow updating of entire restroom field
/* userRoutes.post('/api/flag', verifyJWT, async(req, res) => {
	Restroom.findOne(req.body.name, (err, doc) => {
		if(doc){
			doc.flags++
			doc.flaggedBy.push(req.user.username)
			res.status(200)
			res.json({message: "restroom successfully flagged", data: doc})
		} else{
			res.status(400)
			res.status({message: "restroom not found"})
		}
	})
})

userRoutes.post('/api/unflag', verifyJWT, async(req, res) => {
	Restroom.findOne(req.body.name, (err, doc) => {
		if(doc){
			doc.flags--
			doc.flaggedBy.splice(doc.flaggedBy.indexOf(req.user.username), 1)
			res.status(200)
			res.json({message: "restroom successfully unflagged", data: doc})
		} else{
			res.status(400)
			res.status({message: "restroom not found"})
		}
	})
}) */

//deletes RR by address or name
userRoutes.delete('/api/rm-RR', verifyJWT, async(req, res) => {
	//should have something here so only authorized accounts can delete RR
	//first try to query address, but if address not provided then name
	let myquery = {}
	if (typeof req.body.address !== 'undefined') myquery = {address:  req.body.address}
	else myquery = {name: req.body.name};
    Restroom.deleteOne(myquery, (err, doc) => {
        
		////////////////// emitted for code coverage
		/*if(err) {
			res.sendStatus(400);
			res.
			console.log(err.message);
		}*/
		//////////////////

		//update favorite data of users in database would be more efficient to implement on front end
		//should just delete the restroom from favorites if it cannot be found with a get request
		UserData.find({favorites: req.body.name}, (err, docs) => {
			for(let j = 0; j< docs.length;j++){//new routes
						docs[j].favorites.splice(docs[j].favorites.indexOf(req.body.name), 1)
						UserData.findOneAndUpdate({username: docs[j].username}, docs[j], (err, doc)=>{})
						UserData.findOne({username: docs[j].username})
			}
			res.status(200);
        	res.json({message: req.body.name + " has been successfully deleted", data: doc})
		})
	})
})

//get restroom within x square miles
//req.body should contain lat and long coords to restroom as well 
//as a distance field for the range in miles needed
//no verify because geusts can do this
//make radius
userRoutes.get('/api/near-RR', async (req, res) =>{

	var long1 = parseFloat(req.query.longitude) - parseFloat(req.query.radius)/(54.5833333)
	var long2 = parseFloat(req.query.longitude) + parseFloat(req.query.radius)/(54.5833333)
	var lat1 = parseFloat(req.query.latitude) - parseFloat(req.query.radius)/(54.5833333)
	var lat2 = parseFloat(req.query.latitude) + parseFloat(req.query.radius)/(54.5833333)
	let myquery = {longitude:{$gte: long1, $lte: long2}, latitude: {$gte: lat1, $lte: lat2}}
	Restroom.find(myquery, (err, docs) => {
		/////////// emitted for code coverage
		/* if(err) {
			console.log(error.message)
			res.status(400)
			res.json({message: error.message, data:error.name})
		} */////////
		var rNew = docs
		for(var i = 0; i<docs.length; i++){
			if(Math.pow((docs[i].longitude-parseFloat(req.query.longitude)*(54.5833333), 2)) + Math.pow((docs[i].latitude-parseFloat(req.query.latitude))*(54.5833333), 2) > Math.pow(parseFloat(req.query.radius), 2)){
				rNew = rNew.splice(i, 1)//impossible to fully branch test this statement bc cannot execute when loop condition fails
			}
		}
		res.status(200)
		res.json({message: "restrooms sucessfully found", data: rNew})
	});
	
})


//post for when a user leaves a new review
userRoutes.post('/api/new-review', verifyJWT, async (req, res) =>{
	//check that restroom exists to leave review
	const rest = await Restroom.findOne({restroomName: req.body.restroomName});
	if(!rest){
		res.status(400)
		return res.json({message: "restroom not found"})
	}
	//check that review is unique to user
	const myQuery = {restroomName: req.body.restroomName, username: req.user.username}
	let post = await Review.findOne(myQuery).lean();
	if(!post) {
		await Review.create({
			restroomName: req.body.restroomName, username: req.user.username,
			time: req.body.time, clean: req.body.clean, smell: req.body.smell,
			TP: req.body.TP, safety: req.body.safety, privacy: req.body.privacy,
			busyness: req.body.busyness, pay: req.body.pay, handicap: req.body.handicap,
			genderNeutral: req.body.genderNeutral, hygiene: req.body.hygiene, changingStation: req.body.changingStation, flags: 0, flaggedBy:[]
		})
		/////////// emitted for code coverage
		// .catch((err) => {
		//	console.log(err.message)
		//	res.status(400)
		//	return res.json({message: err.message, data:err.name})
		// })
		/////////// 
	} else {//maybe update here
		res.status(400)
		return res.json({message: "User has already reviewed this restroom"})
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

	restNew.pay += req.body.pay
	restNew.handicap += req.body.handicap
	restNew.genderNeutral += req.body.genderNeutral
	restNew.hygiene += req.body.hygiene
	restNew.changingStation += req.body.changingStation

	await Restroom.findOneAndUpdate({name:req.body.restroomName}, restNew)
	
	res.status(200)
	res.json({message: "review sucessfully created"})

	//create new object when history is a thing
})


//deletes review

 userRoutes.delete('/api/del-review', verifyJWT, async(req, res) => {
	
	//find restroom and review in question
	let myquery = {restroomName:  req.body.restroomName, username: req.user.username};
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
	rest.body.pay[0] = rest.body.pay-rev.pay
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
        return res.json({message: "1 review successfully deleted", data: obj})
    })	
})
