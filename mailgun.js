const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');




const auth = {
    auth: {
        api_key: 'c6ea6648aa1a2894c4bc326e959c093a-816b23ef-03d253aa',
        domain: 'sandbox41fa3dd81c83419e8d835b1f9ce51d6d.mailgun.org'
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (email, subject, text) => {

    const mailOptions = {
        from: email,
        to: 'collaboratorsevent2020@gmail.com',
        subject,
        text
    };

    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log('There is an error');
        } else {
            console.log('Message Received.');
        }
    });
}

module.exports = sendMail;

