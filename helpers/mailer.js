const nodemailer = require('nodemailer');
const handlebars = require("handlebars")
const { CommonEmail, EmailConfig } = require('../config/config');
const fs = require("fs")
const path = require("path")
require('dotenv').config()
const Mailer = {
    sendEmail: async (recipient, subject, body, templateUrl = "", footer = "", isHtml = false) => {
        try {
            const transport = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT),
                secure: process.env.EMAIL_IS_SECURE === 'true' ? true : false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER, // generated ethereal user
                    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
            templateUrl = templateUrl.trim();
            const mailOptions = {
                from: {
                    name: 'My Api',
                    address: EmailConfig.Email
                },
                to: Array.isArray(recipient) ? recipient.toString() : recipient,
                subject: subject
            }
            if (templateUrl && templateUrl.length > 0 && isHtml) {
                const emailTemplateSource = fs.readFileSync(path.join(__dirname, "/templates/" + templateUrl), "utf8")
                const template = handlebars.compile(emailTemplateSource)
                const htmlToSend = template({ body: body, footer: (footer) ? footer : CommonEmail.Footer })
                mailOptions.html = htmlToSend;
            }
            else {
                mailOptions.text = body;
            }
            return await transport.sendMail(mailOptions);
        } catch (err) {
            //console.log(err)
            throw new Error(err)
        }
    }
}
module.exports = Mailer;