const UserDataSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true, unique: true },
		favoriteId: { type: [], required: true },
	},
	{ collection: 'userData' }
)

const model = mongoose.model('UserDataSchema', UserDataSchema)

module.exports = model