const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
	{
		restroomName: { type: String, required: true},
		username: { type: String, required: true },
        time: { type: String },
        clean: {type: Number, required: true },
        smell: {type: Number, required: true },
        TP: {type: Number, required: true },
        safety: {type: Number, required: true },
        privacy: {type: Number, required: true },
        busyness: {type: Number, required: true }, 
        pay: {type: Number},
        handicap: {type: Number},
        genderNeutral: {type: Number},
        hygiene: {type: Number},
        changingStation: {type: Number}
	},
	{ collection: 'reviews' }
)

const model = mongoose.model('ReviewSchema', ReviewSchema)

module.exports = model