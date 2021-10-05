const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendVerificationMail(address, id, activationCode) {
	const verificationUrl = `http://${process.env.APP_HOST}:${process.env.APP_PORT}/verify/${id}/${activationCode}`;
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		port: 587,
		secure: true,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD
		}
	});

	const info = await transporter.sendMail({
		from: `"Test Node App" <${process.env.EMAIL_USER}>`,
		to: address,
		subject: 'Confirm registration ✔',
		text: '',
		html: `<b>Please, click the link below to confirm registration: </b><br><a target="_blank" href='${verificationUrl}'>${verificationUrl}</a>`
	});

	return info;
}

module.exports = sendVerificationMail;
