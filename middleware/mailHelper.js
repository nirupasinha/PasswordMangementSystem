var nodemailer = require('nodemailer');

function mailHelper(mailOptions) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nirupasinha99@gmail.com',
            pass: 'nirupa@123'
        }
    });

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = { mailHelper }