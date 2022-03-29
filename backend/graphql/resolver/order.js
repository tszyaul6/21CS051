const fetch = require("node-fetch");
const Order = require("../../models/Order");
const User = require("../../models/User");
const Driver = require("../../models/Driver");

const orderResolver = {
	order: async (args, req) => {
		try {
			const order = await Order.findById(args.id).populate(
				"sender receiver driver"
			);

			if (!order) throw new Error("Order not found");

			return order;
		} catch (err) {
			throw err;
		}
	},
	orders: async (args, req) => {
		if (!req.isAuth) throw new Error("Unauthenticated");

		try {
			const orders = await Order.find().populate(
				"sender receiver driver"
			);
			return orders;
		} catch (err) {
			throw err;
		}
	},
	ordersWithoutReceived: async (args, req) => {
		if (!req.isAuth) throw new Error("Unauthenticated");

		try {
			const orders = await Order.find({
				status: { $ne: "received" }
			}).populate("sender receiver driver");

			return orders;
		} catch (err) {
			throw err;
		}
	},
	ordersWithIdsArray: async (args, req) => {
		try {
			const allQueryIds = args.orderIds;
			const allOrders = [];

			for (queryId of allQueryIds) {
				const order = await Order.findById(queryId).populate(
					"sender receiver driver"
				);
				allOrders.push(order);
			}

			return allOrders;
		} catch (err) {
			throw err;
		}
	},
	createOrder: async (args, req) => {
		try {
			const { title, description, sender, receiver, isPaidBySender } =
				args.orderInput;

			const {
				name: s_name,
				phone_no: s_phone_no,
				email: s_email
			} = sender;

			const {
				name: r_name,
				phone_no: r_phone_no,
				email: r_email,
				address: r_address
			} = receiver;

			const fetchCoords = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${r_address}&key=${process.env.GOOGLE_API}`,
				{
					method: "GET"
				}
			);

			const coords = await fetchCoords.json();

			let r_coordinates = [];

			if (coords.results.length !== 0) {
				const { lat, lng } = coords.results[0].geometry.location;
				r_coordinates = [lat, lng];
			}

			const newSender = new User({
				name: s_name,
				phone_no: s_phone_no,
				email: s_email
			});

			const newReceiver = new User({
				name: r_name,
				phone_no: r_phone_no,
				email: r_email,
				address: r_address,
				coordinates: r_coordinates
			});

			const senderResult = await newSender.save();
			const receiverResult = await newReceiver.save();

			const newOrder = new Order({
				title,
				description,
				sender: senderResult.id,
				receiver: receiverResult.id,
				isPaidBySender
			});

			const orderResult = await newOrder.save();

			const populatedOrderResult = await Order.populate(orderResult, {
				path: "sender receiver"
			});

			return populatedOrderResult;
		} catch (err) {
			throw err;
		}
	},
	acceptOrder: async (args, req) => {
		if (!req.isAuth) throw new Error("Unauthenticated");

		try {
			const driverAssigned = await Driver.findOneAndUpdate(
				{ _id: args.driverId },
				{ $push: { ordersInCharge: args.orderId } },
				{ new: true }
			);

			if (!driverAssigned) throw new Error("Driver not found");

			const updatedOrder = await Order.findOneAndUpdate(
				{ _id: args.orderId },
				{ status: "accepted", driver: driverAssigned.id },
				{ new: true }
			).populate("sender receiver");

			if (!updatedOrder) throw new Error("Order not found");

			return updatedOrder;
		} catch (err) {
			throw err;
		}
	},
	deliveringOrder: async (args, req) => {
		if (!req.isAuth) throw new Error("Unauthenticated");

		try {
			const updatedOrder = await Order.findOneAndUpdate(
				{ _id: args.orderId },
				{ status: "delivering" },
				{ new: true }
			).populate("sender receiver driver");

			if (!updatedOrder) throw new Error("Order not found");

			return updatedOrder;
		} catch (err) {
			throw err;
		}
	},
	receiveOrder: async (args, req) => {
		if (!req.isAuth) throw new Error("Unauthenticated");

		try {
			const updatedOrder = await Order.findOneAndUpdate(
				{ _id: args.orderId },
				{ status: "received" },
				{ new: true }
			).populate("sender receiver driver");

			if (!updatedOrder) throw new Error("Order not found");

			const driverId = updatedOrder.driver._id;

			const driver = await Driver.findOneAndUpdate(
				{ _id: driverId },
				{ $pull: { ordersInCharge: args.orderId } },
				{ new: true }
			);

			return updatedOrder;
		} catch (err) {
			throw err;
		}
	},
	calculateEta: async (args, req) => {
		try {
			const order = await Order.findById(args.orderId).populate(
				"receiver driver"
			);

			const [lat, lng] = order?.driver?.coordinates;

			const dest = order?.receiver?.address;

			if (!lat || !lng || !dest) return "";

			const response = await fetch(
				`https://maps.googleapis.com/maps/api/directions/json?origin=${lat},${lng}&destination=${dest}&key=${process.env.GOOGLE_API}`
			);

			const result = await response.json();

			const eta = result.routes[0].legs[0].duration.text;

			return eta;
		} catch (err) {
			throw err;
		}
	}
};

module.exports = orderResolver;
