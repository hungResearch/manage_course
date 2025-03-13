require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require("compression")
const app = express()

const {checkOverload} = require('./helpers/check.connect.database')

// init middlewars
app.use(morgan("dev")) // package to notice about result request
// morgan("combine") => product
// morgan("dev") => dev
app.use(helmet()) // package to sercure
app.use(compression()) // package to compress data

// init db
require('./dbs/init.mongodb')
// checkOverload()

// init route

app.get('/', (req, res, next) => {
    const content = "Hello"
    return res.status(200).json({
        message: 'welcome to my website!',
        metadata: content.repeat(100000)
    })
})

// init error

module.exports = app