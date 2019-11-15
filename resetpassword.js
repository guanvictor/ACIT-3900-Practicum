const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const api_key = require('./api_key.js');
const crypto = require('crypto');

const auth = api_key.auth

// const auth = {auth: {
//     api_key: process.env.API_KEY,
//     domain: process.env.DOMAIN
//     }}

const token = crypto.randomBytes(20).toString('hex');
console.log(token);


const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (email) => {
    let mailOptions = {
        from: "Victor <victor@mail.victorguan.com>",
        to: email,
        subject: 'Password Reset Link',
        text: "You requested a link to reset your password.\n\n" +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        `http://localhost:8080/forgotpassword?/${token}\n\n` +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('There is an error');
            
            console.log(err)
        } else {
            console.log('Link has been sent.');
        }   
    });
}



module.exports = sendMail;



{/* <script src="/static/js/api_key.js"></script> */ }