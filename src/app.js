require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require("compression")
const app = express()

// const {checkOverload} = require('./helpers/check.connect.database')

// init middlewars
app.use(morgan("dev")) // package to notice about result request
// morgan("combine") => product
// morgan("dev") => dev
app.use(helmet()) // package to sercure
app.use(compression()) // package to compress data
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init db
require('./dbs/init.mongodb')
// checkOverload()

// init route
app.use('/', require('./routers'))

// init error
app.use((req, res, next) => {
    const error = new Error();
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    const statuCode = error.status || 500;
    return res.status(statuCode).json({
        status: 'error',
        code: statuCode,
        message: error.message || 'Internal Server error'
    })
})

module.exports = app