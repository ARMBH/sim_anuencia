var express = require('express')
var router = express.Router()
const jwt = require('jsonwebtoken')

function getCookie(name, headers) {
    var value = "; " + headers;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

const auth = router.use((req, res, next) => {
    if (req.originalUrl.match('/api/vUser') || req.originalUrl.match('/api/forgotPassword') ) next()
    // CORS preflight request
    if (req.method === 'OPTIONS') {
        next()
    } else {  
        if (!req.headers.cookie) {
            return res.status(403).send('No token provided.')
        }
        let token = getCookie('_sim-ad',req.headers.cookie)
        jwt.verify(token, process.env.AUTHSECRET, function (err, decoded) {            
            if (err) {
                console.log('token expired!!!!')
                return res.status(403).send(err)          
            } else {
                req.decoded = decoded                
                next()
            }
        })
    }
})

module.exports = { auth }