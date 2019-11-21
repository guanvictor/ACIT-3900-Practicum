const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const api_key = require('./api_key.js');
const crypto = require('crypto');
const db = require('./database.js')

const auth = api_key.auth

// const auth = {auth: {
//     api_key: process.env.API_KEY,
//     domain: process.env.DOMAIN
//     }}

// const token = crypto.randomBytes(20).toString('hex');
// console.log(token);



// crypto.randomBytes(20, function(err, buffer) {
//     const token = buffer.toString('hex');
//     console.log(token);
//   });

/**
 * This function randomly generates a 20 hex character token and is appended to reset password emails as a unique link
 *
 * 
 */
// const generateToken = () => {
//     crypto.randomBytes(20, function (err, buf) {
//         var token = buf.toString('hex');
//         // console.log(token);
//         return token
//     });
// }

/**
 * This function checks if the email exists in the database. If it does, return a message that the user has been found
 * and the email has been sent
 *
 * @param {*} email
 * @param {*} token
 */
const checkEmail = (email, token) => {

    crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');

        let con = db.getDb();
        let sql = `select * from accounts where email like "${email}"`

        con.query(sql, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.send("User was found. The e-mail has been sent.");
            } else {
                console.log("Email was not found. Re-type your email.")
            }

            email.resetPasswordToken = token;
            email.resetPasswordExpires = Date.now() + 3600000; // 1 hour


            return (err, token, email);

        });
    })};




    const transporter = nodemailer.createTransport(mailGun(auth));

    /**
     * This function sends an email to the user when they request a reset password link, that will generate a link with a token
     *
     *
     * @param {*} token
     * @param {*} email
     * 
     */
    const sendMail = (email) => {
        console.log(email);
        // let token = generateToken();
        // console.log(token);
        crypto.randomBytes(20, function (err, buf) {
            var token = buf.toString('hex');
            let mailOptions = {
                from: "Victor <mail@mail.victorguan.com>",
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
        });
    }


    module.exports = {
        sendMail,
        checkEmail,
    }
// module.exports = generateToken;
// module.exports = checkEmail;



// {/* <script src="/static/js/api_key.js"></script> */ }