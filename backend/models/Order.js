const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
		receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
		freight: { type: Number, default: 0, required: true },
		isPaidBySender: { type: Boolean, required: true },
		driver: { type: Schema.Types.ObjectId, ref: "Driver" },
		status: {
			type: String,
			enum: ["placed", "accepted", "delivering", "received", "cancelled"],
			default: "placed",
			required: true
		},
		eta: { type: Date }
	},
	{ timestamps: true }
);

module.exports = model("Order", orderSchema);
