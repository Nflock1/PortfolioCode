const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const userData = require('../models/userData');
const { MongoTopologyClosedError } = require('mongoose/node_modules/mongodb');
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



