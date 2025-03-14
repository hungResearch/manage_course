'use strict'

const signUpServices = require('../services/siginUp.services')

class AccessControler {

    signUp = async (req, res, next) => {
        try {
            console.log("[P]::signUp::", res.body);
            return res.status(201).json(await signUpServices.signUp(req.body))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccessControler()