'use strict'

const _ = require('lodash')

// get value-key fields in object
const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

module.exports = {
    getInfoData
}