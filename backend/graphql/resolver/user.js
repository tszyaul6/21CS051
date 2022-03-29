const User = require("../../models/User");

const userResolver = {
	users: async () => {
		try {
			const users = await User.find();
			return users;
		} catch (err) {
			throw err;
		}
	},

	createUser: async (args, req) => {
		try {
			const { name, phone_no, email, address } = args.userInput;

			const newUser = new User({
				name,
				phone_no,
				email,
				address
			});

			const result = await newUser.save();

			return result;
		} catch (err) {
			throw err;
		}
	}
};

module.exports = userResolver;
