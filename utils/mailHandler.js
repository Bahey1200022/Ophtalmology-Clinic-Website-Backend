require('dotenv').config();
const nodemailer = require('nodemailer');

const sendemail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const emailOptions = {
        from: '"reddit clone admin" <clonereddit055@gmail.com>',
        to: options.email,
        subject: options.subject,
        html: options.text
    };

    await transporter.sendMail(emailOptions);
};

module.exports = sendemail;