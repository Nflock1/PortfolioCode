const mongoose = require('mongoose')


const UserDataSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		favorites: { type: [String], required: true }, //restroom names
		history: {type: [String], required: true }
	},
	{ collection: 'userData' }
)

const model = mongoose.model('UserDataSchema', UserDataSchema)

module.exports = model