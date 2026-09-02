const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const sgMail = require('@sendgrid/mail');

const SMTP_HOST = "smtp.office365.com"
const SMTP_PORT = 587
const SMTP_USERNAME = "noreply-gotcha@thbs.com"
const SMTP_PASSWORD = "yjrsllpbskgjgmfv"
const SMTP_FROM_EMAIL = "noreply-gotcha@thbs.com"

const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
    }
});

const sendEmail = (receiver, subject, data) => {
    // sgMail.setApiKey(SENDGRID_API_KEY);
    ejs.renderFile(path.join(__dirname, "..", "email-templates", "reset-password.ejs"), { data }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                to: receiver,
                from: SMTP_FROM_EMAIL,
                subject: subject,
                html: data
            };

            transport.sendMail(mailOptions).then();

            // sgMail.send(mailOptions).then(() => { }, error => {
            //     console.error(error);

            //     if (error.response) {
            //         console.error(error.response.body)
            //     }
            // });
        }
    });
};

module.exports = {
    sendEmail
};