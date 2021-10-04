const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendVerificationMail(adress) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD
		}
	});

	const info = await transporter.sendMail({
		from: '"Test Node App" <foo@example.com>',
		to: adress,
		subject: 'Confirm registration ✔',
		text: '',
		html: '<b>Please, click the link below: </b>'
	});
}

module.exports = sendVerificationMail;
