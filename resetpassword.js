const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const api_key = require('./api_key.js');

const auth = api_key.auth

// const auth = {auth: {
//     api_key: process.env.API_KEY,
//     domain: process.env.DOMAIN
//     }}


const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (email) => {
    let mailOptions = {
        from: "Victor <victor@mail.victorguan.com>",
        to: email,
        subject: 'Password Reset Link',
        text: "You requested a link to reset your password."
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