'use strict'

const { CREATED, SuccessResponse } = require('../core/sucess.reponse');
const AccessServices = require('../services/access.services');
const accessServices = require('../services/access.services')

class AccessControler {

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout success!",
            metadata: await AccessServices.logout(req.keyStore)
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessServices.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {

        new CREATED({
            message: "Regiserted OK",
            metadata: await accessServices.signUp(req.body)
        }).send(res)
    }
}

module.exports = new AccessControler()