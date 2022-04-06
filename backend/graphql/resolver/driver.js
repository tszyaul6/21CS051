const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const Driver = require("../../models/Driver");
const Order = require("../../models/Order");
const { getOptPath } = require("../../algorithms/tsp_brute_force");

const driverResolver = {
	driver: async (args, req) => {
		try {
			if (!req.isAuth) throw new Error("Unauthenticated");

			const driver = await Driver.findById(args.id);

			return driver;
		} catch (err) {
			throw err;
		}
	},
	drivers: async () => {
		try {
			const drivers = await Driver.find();
			return drivers;
		} catch (err) {
			throw err;
		}
	},
	driverLogin: async (args, req) => {
		try {
			const { email, password } = args;
			const driver = await Driver.findOne({ email });

			if (!driver) throw new Error("Driver not found");

			const isValidPassword = await bcrypt.compare(
				password,
				driver._doc.password
			);

			if (!isValidPassword) throw new Error("Incorrect password");

			const token = jwt.sign(
				{ driverId: driver._doc._id, email: driver.email },
				process.env.JWT_SECRET,
				{ expiresIn: "8h" }
			);

			return { driverId: driver._doc._id, token, expiration: 8 };
		} catch (err) {
			throw err;
		}
	},
	createDriver: async (args, req) => {
		try {
			const { name, phone_no, email, password } = args.driverInput;

			if (
				(await Driver.find({ phone_no: phone_no })).length ||
				(await Driver.find({ email: email })).length
			) {
				throw new Error("Driver exists");
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const newDriver = new Driver({
				name,
				phone_no,
				email,
				password: hashedPassword
			});

			const result = await newDriver.save();

			return result;
		} catch (err) {
			throw err;
		}
	},
	updateDriverCoordinates: async (args, req) => {
		try {
			if (!req.isAuth) throw new Error("Unauthenticated");

			const {
				driverId,
				coordinatesInput: { lat, lng }
			} = args;

			const fetchLocation = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API}`
			);
			const locationRes = await fetchLocation.json();

			const location = locationRes.results?.[0]?.formatted_address || "";

			const driver = await Driver.findOneAndUpdate(
				{ _id: driverId },
				{ coordinates: [lat, lng], location },
				{ new: true }
			);

			return driver;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	optOrders: async (args, req) => {
		// console.log(`The algorithm is running...`);
		// let startTime = performance.now();

		if (!req.isAuth) throw new Error("Unauthenticated");

		try {
			const driver = await Driver.findById(args.driverId).populate({
				path: "ordersInCharge",
				populate: {
					path: "receiver"
				}
			});

			const { coordinates: driverCoordinates, ordersInCharge } = driver;

			if (ordersInCharge.length === 0) return [];

			const simplifiedOrdersInCharge = ordersInCharge.map(
				(order, index) => {
					return {
						index: index + 1,
						orderId: order.id,
						orderCoordinates: order.receiver.coordinates
					};
				}
			);

			// Unshift the driver coordinates to the array
			simplifiedOrdersInCharge.unshift({
				index: 0,
				orderId: "driverAt",
				orderCoordinates: driverCoordinates
			});

			// Get information from google directions api
			// apiReference has {from_order_id, to_order_id, from_coord, to_coord and distance}
			// matrix only stores the distance
			let apiReference = [];
			let matrix = [];
			for (const order of simplifiedOrdersInCharge) {
				let matrix_row = [];

				for (const anotherOrder of simplifiedOrdersInCharge) {
					if (order === anotherOrder) {
						matrix_row.push(0);
						continue;
					}

					let directionApi = `https://maps.googleapis.com/maps/api/directions/json?origin=${order.orderCoordinates[0]},${order.orderCoordinates[1]}&destination=${anotherOrder.orderCoordinates[0]},${anotherOrder.orderCoordinates[1]}&key=${process.env.GOOGLE_API}`;

					const fetchDirection = await fetch(directionApi);
					const directionRes = await fetchDirection.json();

					const distance = directionRes?.routes[0]?.legs[0]?.distance;

					const result = {
						from: order.orderId,
						to: anotherOrder.orderId,
						fromCoordinates: order.orderCoordinates,
						toCoordinates: anotherOrder.orderCoordinates,
						distance
					};

					apiReference.push(result);
					matrix_row.push(distance?.value);
				}
				matrix.push(matrix_row);
			}

			const { optPath } = getOptPath(matrix);

			let optimizedOrderId = [];
			for (let optIndex of optPath) {
				if (optIndex === 0) continue;
				for (order of simplifiedOrdersInCharge) {
					if (order.index === optIndex) {
						optimizedOrderId.push(order.orderId);
					}
				}
			}

			let finalOptOrders = [];
			for (orderId of optimizedOrderId) {
				const order = await Order.findById(orderId).populate(
					"sender receiver driver"
				);
				finalOptOrders.push(order);
			}

			// console.log(`The algorithm ends.`);
			// let endTime = performance.now();
			// console.log(`It takes: ${(endTime - startTime) / 1000} seconds`);

			return finalOptOrders;
		} catch (err) {
			throw err;
		}
	}
};

module.exports = driverResolver;
