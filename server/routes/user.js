const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
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

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			username,
			password
		})
		console.log('User created successfully: ', response)
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

app.delete('/api/rm-user/:id', async (req, res) => {
    let myquery = { _id: objectId(req.params.id)};
    User.deleteOne(myquery, (err,obj) => {
        if(err) throw err;
        res.json({message: "1 user successfully deleted"})
        response.status(obj);
    })
})