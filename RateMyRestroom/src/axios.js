const instance = require('axios')
const IP = require('./ip.json')
const axios = instance.create({
    baseURL: `http://${IP.ip}:5000`
})

module.exports = axios