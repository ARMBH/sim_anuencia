const nodemailer = require('nodemailer')

const sendMail = (req, res) => {
    const { to, subject, html } = req.body
    let answer    

    const transporter = nodemailer.createTransport({
        host: process.env.MAILHOST,
        port: 465,
        secureConnection: true, // use SSL        
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASS
        },
    })

    const mailOptions = {
        from: 'anuencia.digital@agenciarmbh.mg.gov.br',
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