const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const { User } = require('../models/user')
const { CadastroRt } = require('../models/rtModel')
const { verifyEmail } = require('../config/verifyEmail')

const emailRegex = /\S+@\S+\.\S+/
//const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

const signup = (req, res, next) => {

    const { name, surName, email, password, confirmPassword, municipio, role } = req.body || ''
    const verified = false
    let answer

    if (!email.match(emailRegex)) {
        return res.send('E-mail inválido.')
    }

    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)
    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.send('Senhas não conferem.')
    }

    User.findOne({ email }, async (err, user) => {
        if (err) {
            return err
        } else if (user) {
            return res.send('Usuário já cadastrado.')
        } else {

            if (role === 'prefeitura') {
                const newUser = new User({ name, surName, email, municipio, password: passwordHash, role, verified })
                newUser.save((err, user) => {
                    if (err) {
                        return err
                    } else {
                        res.status(200).send(user)
                    }
                })
            } else {
                const defRole = new Promise((resolve, reject) => {
                    CadastroRt.findOne({ 'emailRt': email })
                        .then(res => {
                            if (res) resolve('rt')
                            resolve('empreend')
                        })
                        .catch(e => reject(e))
                })
                defRole.then(role => {
                    const newUser = new User({ name, surName, email, municipio, password: passwordHash, role, verified })
                    newUser.save(async (err, user) => {
                        if (err) return err
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
                            to: user.email,
                            subject: 'Confirmação de Cadastro',
                            html: verifyEmail(user.name, `https://www.anuenciadigital.ml/api/vUser?id=${user._id}`)
                        }                       
                        transporter.sendMail(mailOptions, function (err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                answer = res.status
                            }
                        })
                        res.send(answer)
                    })
                })
            }
        }
    })
}

const login = async (req, res, next) => {
    const email = req.body.email || ''
    const password = req.body.password || ''

    User.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(400).send(err)
        } else if (user && bcrypt.compareSync(password, user.password)) {
            user = { _id: user._id, name: user.name, surName: user.surName, email: user.email, municipio: user.municipio, role: user.role, verified: user.verified }

            if (user.verified) {
                const token = jwt.sign(user, process.env.AUTHSECRET, {
                    expiresIn: 60 * 60 * 4
                })
                res.cookie('_sim-ad', token, { maxAge: 1000 * 60 * 60 * 4 }).send(user)
                console.log('>> Login: '+user.email)
            } else {
                res.send('Aguardando verificação do usuário.')
            }

        } else {
            return res.status(400).send('Usuário/Senha inválidos')
        }
    })
}

module.exports = { signup, login }




/*   if (!password.match(passwordRegex)) {
          return res.status(400).send({
              errors: [
                  "Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$ %) e tamanho entre 6 - 20."
              ]
          })
      } */