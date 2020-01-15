const nodemailer = require('nodemailer')

const sendMail = (req, res) => {
    const { to, subject, html } = req.body
    let answer
    console.log("SMTP utilizado -> "+process.env.MAILHOST)
    console.log(to, subject, html)
    const transporter = nodemailer.createTransport({
        host: process.env.MAILHOST,
        port: 25,
        secureConnection: true, // use SSL        
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASS
        },
    })

    const mailOptions = {
        from: 'anuencia@agenciarmbh.mg.gov.br',
        to: to,
        subject: subject,
        html: html
    }

    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            answer = res.status
        }
    })
    res.json(answer || 'check mail')
}

module.exports = { sendMail }