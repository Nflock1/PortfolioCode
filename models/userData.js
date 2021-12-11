const mongoose = require('mongoose')


const UserDataSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		favorites: { type: [], required: true }//restroom names
	},
	{ collection: 'userData' }
)

const model = mongoose.model('UserDataSchema', UserDataSchema)

module.exports = model