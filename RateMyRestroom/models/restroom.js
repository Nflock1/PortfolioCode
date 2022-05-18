const mongoose = require('mongoose')

const Restroom = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true},
        description: { type: String, requied: true},
        address: { type: String, required: true, unique: true },
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true },
        clean: {type: [Number], required: true },
        smell: {type: [Number], required: true },
        TP: {type: [Number], required: true },
        safety: {type: [Number], required: true },
        privacy: {type: [Number], required: true },
        busyness: {type: [Number], required: true }, 
        pay: {type: Number, required: true},
        handicap: {type: Number, required: true},
        genderNeutral: {type: Number, required: true},
        hygiene: {type: Number, required: true},
        changingStation: {type: Number, required: true},
        flags: {type: Number, required: true},
        flaggedBy: {type: [String], required: true}
	},
	{ collection: 'restrooms' }
)

const model = mongoose.model('RestroomSchema', Restroom)
module.exports = model