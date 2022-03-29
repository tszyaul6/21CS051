const Order = require("../../models/Order");

const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const emailResolver = {
	sendEmail: async (args, req) => {
		const CLIENT_ID = process.env.CLIENT_ID;
		const CLIENT_SECRET = process.env.CLIENT_SECRET;
		const REDIRECT_URI = process.env.REDIRECT_URI;
		const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

		const oAuth2Client = new google.auth.OAuth2(
			CLIENT_ID,
			CLIENT_SECRET,
			REDIRECT_URI
		);

		oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

		try {
			// get the order information from database
			const order = await Order.findById(args.id).populate(
				"sender receiver"
			);

			if (!order) throw new Error("Order not found.");

			// generate the qrcode image by the order id
			const img = await QRCode.toDataURL(`${order._doc._id}`);

			// get the access token from oauth2
			const accessToken = await oAuth2Client.getAccessToken();

			// set uup the transport of nodemailer
			const transport = nodemailer.createTransport({
				service: "gmail",
				auth: {
					type: "OAuth2",
					user: process.env.GMAIL_USER,
					clientId: CLIENT_ID,
					clientSecret: CLIENT_SECRET,
					refreshToken: REFRESH_TOKEN,
					accessToken
				}
			});

			// fill in the mail options
			const mailOptions = {
				from: `TY Express 🚚 <${process.env.GMAIL_USER}>`,
				to: `${order._doc.sender.name} <${order._doc.sender.email}>, ${order._doc.receiver.name} <${order._doc.receiver.email}>`,
				subject: `[TY Express] Order Placed: ${order._doc.title}`,
				html: `
				<p>Dear Customers,</p><br/>

				<p>Thank you for choosing TY Express.
				${order._doc.sender.name} just sent a package to you, ${order._doc.receiver.name}.
				For more details, please visits: http://localhost:3000/receive and scan the attached QR code, or use the following ID: ${order._doc._id}.</p><br/>
				
				<p>
				Best Regards,<br/>
				TY Express
				</p>

				<img src=${img}>
				`
			};

			// send the mail
			await transport.sendMail(mailOptions);

			return order;
		} catch (err) {
			cosnole.log(err);
		}
	}
};

module.exports = emailResolver;
