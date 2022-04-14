const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


module.exports = {
    /**
     * used for send quick mail
     * @param {string} template_id
     * @param {array} mailOptions
     * mailOption array format {reciver:['abc@xyz.com'],variable:{var:value}}
     */
    sendMail: function (template_event, mailOptions) {
        EmailTemplate.getTemplate({
            template_event: template_event
        }).then(template => {
            var transporter = nodemailer.createTransport(smtpTransport({
                pool: true,
                host: config.settings.smtp_host,
                port: parseInt(config.settings.smtp_port),
                auth: {
                    user: config.settings.smtp_email,
                    pass: config.settings.smtp_password
                },
                tls: {
                    rejectUnauthorized: false
                }
            }));
            let subject = template.subject;
            let html = template.html_body;
            let text = template.text_body;
            let value = mailOptions.variable;
            if (value != null) {
                for (let key in value) {
                    let find = new RegExp(key, 'g');
                    subject = subject.replace(find, value[key]);
                    html = html.replace(find, value[key]);
                    text = text.replace(find, value[key]);
                }
            }
            let options = {
                from: {
                    name: config.settings.smtp_from_name,
                    address: config.settings.smtp_from_email
                },
                to: mailOptions.reciver.toString(),
                subject: subject, // Subject line
                text: text, // plaintext body
                html: html // html body
            };
            transporter.sendMail(options, function (error, info) {
                options.mail_type = template_event;
                if (error) {
                    return false;
                } else {
                    return true;
                }
            });
        }).catch(err => {
            console.log(err);
            console.log('Error In Send Quick Mail Error : ', +err);
            return false;
        });
    }
};