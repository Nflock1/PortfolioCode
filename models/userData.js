const mongoose = require('mongoose')


const UserDataSchema = new mongoose.Schema(
	{
		userID: { type: String, required: true, unique: true },
		favoriteID: { type: [], required: true },
	},
	{ collection: 'userData' }
)

const model = mongoose.model('UserDataSchema', UserDataSchema)

module.exports = model