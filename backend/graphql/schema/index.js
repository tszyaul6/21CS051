const { buildSchema } = require("graphql");

const schema = buildSchema(`
	type User {
		_id: ID!
		name: String!
		phone_no: String!
		email: String!
		address: String!
		coordinates: [Float]
		createdAt: String!
		updatedAt: String!
	}

	input UserInput {
		name: String!
		phone_no: String!
		email: String!
		address: String!
		coordinates: [Float]
	}


	type Driver {
        _id: ID!
        name: String!
        phone_no: String!
        email: String!
		password: String!
        coordinates: [Float!]
		location: String
		ordersInCharge: [Order!]
        createdAt: String!
        updatedAt: String!
    }

	input DriverInput {
        name: String!
        phone_no: String!
        email: String!
		password: String!
	}

	type Order {
		_id: ID!
		title: String!
		description: String
		sender: User!
		receiver: User!
		freight: Float!
		isPaidBySender: Boolean!
		driver: Driver
		status: String!
		eta: String
		createdAt: String
		updatedAt: String
	}

	type AuthData {
		driverId: ID!
		token: String!
		expiration: Int!
	}

	input OrderInput {
		title: String!
		description: String
		sender: UserInput!
		receiver: UserInput!
		isPaidBySender: Boolean!
	}

	input CoordinatesInput {
		lat: Float!,
		lng: Float!
	}

	type RootQuery {
		users: [User!]!
		driverLogin(email: String!, password: String!): AuthData!
		drivers: [Driver!]!
		driver(id: ID!): Driver!
		order(id: ID!): Order!
		orders: [Order!]!
		ordersWithoutReceived: [Order!]!
		ordersWithIdsArray(orderIds: [String!]!): [Order!]!
		sendEmail(id: ID!): Order!
		optOrders(driverId: ID!): [Order!]!
		dropDb: String!
		calculateEta(orderId: ID!): String!
	}

	type RootMutation {
		createUser(userInput: UserInput): User
		createDriver(driverInput: DriverInput): Driver
		createOrder(orderInput: OrderInput): Order
		acceptOrder(driverId: ID!, orderId: ID!): Order
		deliveringOrder(orderId: ID!): Order
		receiveOrder(orderId: ID!): Order
		updateDriverCoordinates(driverId: ID!, coordinatesInput: CoordinatesInput!): Driver
	}

	schema {
		query: RootQuery
		mutation: RootMutation
	}
`);

module.exports = schema;
