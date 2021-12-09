const axios = require('axios')
const fs = require('fs')


async function getIP() {
    const res = await axios.get('https://geolocation-db.com/json/')
    console.log("function: " + res.data.IPv4)
    let data = {ip: res.data.IPv4}
    console.log("return: " + JSON.stringify(data))
    fs.writeFile("../src/ip.json", JSON.stringify(data), (err) => {
	if(err){console.log(err.name + ": " + err.message)}
    })
}

module.exports = getIP