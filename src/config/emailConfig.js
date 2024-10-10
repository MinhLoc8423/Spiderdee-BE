const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USEREMAIL,
        pass: process.env.PASSWORDEMAIL,
    },
});

module.exports = transporter;
