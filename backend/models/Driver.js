const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const driverSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		phone_no: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		coordinates: {
			type: [Number],
			default: [0, 0]
		},
		location: {
			type: String,
			default: ""
		},
		ordersInCharge: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "Order"
				}
			],
			default: []
		}
	},
	{ timestamps: true }
);

module.exports = model("Driver", driverSchema);
