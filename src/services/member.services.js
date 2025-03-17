'use strict'

const memberModel = require("../models/member.model")

const findByEmail = async ({ email, select = {
    email: 1, password: 2, name: 1, status: 1, roles: 1
} }) => {
    return await memberModel.findOne({email}).select(select).lean()
}

module.exports = {
    findByEmail
}