require('dotenv').config();

const mailer = require("nodemailer");
const { Hello } = require("./hello_template");
const getEmailData = (to, name, authCode) => {

    data = {
        from: "BabyAngel",
        to,
        subject: `Hello ${name}`,
        html: Hello(authCode)
    }
    return data;
}

const sendEmail = (to, name, type) => {
    const smtpTransport = mailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.NODEMAILER_USER,//보내는 사람 이메일
            pass: process.env.NODEMAILER_PASS //비밀번호
        }
    })

    const mail = getEmailData(to, name, type)

    smtpTransport.sendMail(mail, function(error, response) {
        if(error) {
            console.log(error)
        } else {
            console.log("email sent successfully")
        }
        smtpTransport.close();
    })

}

module.exports = { sendEmail }