'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // create access token 
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        })

        // verify
        JWT.verify(accessToken, publicKey, (error, decode) => {
            if (error) {
                console.error(`error verify::`, error);
            } else {
                console.log(`decode verify::`, decode)
            }
        })
        return {accessToken, refreshToken}
    } catch (error) {
        return error
    }
}

module.exports = {
    createTokenPair
}