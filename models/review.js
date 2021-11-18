const internal = require("stream")

const ReviewSchema = new mongoose.Schema(
	{
		RestroomID: { type: String, required: true},
		UserID: { type: String, required: true },
        time: { type: String },
        clean: {type: Number, required: true },
        smell: {type: Number, required: true },
        TP: {type: Number, required: true },
        safety: {type: Number, required: true },
        privacy: {type: Number, required: true },
        busyness: {type: Number, required: true }, 
        price: {type: Boolean},
        handicap: {type: Boolean},
        GenderNeutral: {type: Boolean},
        Hygiene: {type: Boolean},
        ChangingStation: {type: Boolean}
	},
	{ collection: 'reviews' }
)

const model = mongoose.model('ReviewSchema', ReviewSchema)

module.exports = model