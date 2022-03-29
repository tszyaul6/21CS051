const { Schema, model } = require("mongoose");

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		phone_no: { type: String, required: true },
		email: { type: String, required: true },
		address: { type: String, default: "" },
		coordinates: { type: [Number], default: [0, 0] }
	},
	{ timestamps: true }
);

module.exports = model("User", userSchema);
