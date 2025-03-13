'use strict'

const { default: mongoose } = require("mongoose");
const os = require('os');
const process = require('process');
const _MILISECONDS = 5000;

// count connect
const countConnect = () => {
    const numberConnect = mongoose.connections.length;
    return numberConnect;
}

// check overload
const checkOverload = () => {
    setInterval( () => {
        const numberConnect = countConnect();
        const numCore = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximum number of connection based number of cores
        const maxConnections = numCore * 5;
        
        console.log(`Active connections: ${numberConnect} / ${maxConnections}`)
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024 } MB`);

        if (numberConnect > maxConnections) {
            console.log("Connection overload detected!");
            // send notification
        }

    }, _MILISECONDS) // Monitor every 5 second
}


module.exports = {
    countConnect,
    checkOverload
}