'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const KeyTokenServices = require('../services/keyToken.services')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}


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

const authentication = asyncHandler( async (req, res, next) => {
    /*
        1 - check userId missing?
        2 - get accessToken
        3 - verifyToken
        4 - check user in bds?
        5 - check keyStore with userId?
        6 - return next()
    */
    
    // console.log("[req.header]:::",req.headers)
    // 1 - check userId missing?
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request header');

    // 2 - check keyStore with userId?
    const keyStore = await KeyTokenServices.findByUserId({userId})
    if (!keyStore) throw new NotFoundError('Invalid Request keyStore');

    // 3 - get accessToken
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid Request accessToken');

    // 4 - check
    try {
        const decode = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decode.userId) {
            throw new AuthFailureError(' Invalid Userid');
        }
        req.keyStore = keyStore;
        return next()
    } catch (error) {
        throw error
    }
}
)

module.exports = {
    createTokenPair,
    authentication
}