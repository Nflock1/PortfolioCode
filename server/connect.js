'use strict';//no idea what this is

const { networkInterfaces } = require('os');
const axios = require('axios')
const fs = require('fs')
const nets = networkInterfaces();
const results = Object.create({});

async function getIP() {
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    let data;
    if (typeof results["Wi-Fi"] !== 'undefined') data = {ip: results["Wi-Fi"][0]}
	else data = {ip: results["Ethernet"][0]};
    fs.writeFile("../src/ip.json", JSON.stringify(data), (err) => {
	    if(err){console.log(err.name + ": " + err.message)}
    })
}

module.exports = getIP