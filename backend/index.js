const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");

const driverAuth = require("./middleware/driverAuth");
const schema = require("./graphql/schema");
const resolver = require("./graphql/resolver");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use(driverAuth);

app.use(
	"/graphql",
	graphqlHTTP({
		schema: schema,
		rootValue: resolver,
		graphiql: true
	})
);

mongoose.connect(
	process.argv[2] === "testing"
		? process.env.MONGODB_TEST_CONNECTION
		: process.env.MONGODB_CONNECTION
);

app.listen(port, () => {
	console.log(
		`Backend${
			process.argv[2] === "testing" ? " testing " : " "
		}server listening at http://localhost:${port}`
	);
});
