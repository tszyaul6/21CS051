const driverResolver = require("./driver");
const emailResolver = require("./email");
const miscResolver = require("./misc");
const orderResolver = require("./order");
const userResolver = require("./user");

const resolver = {
	...userResolver,
	...orderResolver,
	...driverResolver,
	...emailResolver,
	...miscResolver
};

module.exports = resolver;
