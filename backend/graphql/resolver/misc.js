const mongoose = require("mongoose");

const miscResolver = {
	dropDb: async () => {
		if (process.argv[2] !== "testing")
			return "cannot drop a non-test database";
		let connectedDb = await mongoose.connect(
			process.env.MONGODB_TEST_CONNECTION
		);
		connectedDb.connection.db.dropDatabase();
		return "database dropped successfully";
	}
};

module.exports = miscResolver;
