var nodemailer = require('nodemailer');

function mailHelper(usermail) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nirupasinha99@gmail.com',
            pass: 'nirupa@123'
        }
    });

    var mailOptions = {
        from: 'nirupasinha99@gmail.com',
        to: usermail,
        subject: 'Password Management System',
        text: `Your Registration is Done .`

    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = { mailHelper }