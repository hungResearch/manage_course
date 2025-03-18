'use strict'

const memberModel = require("../models/member.model")

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenServices = require("./keyToken.services")
const { createTokenPair, JWTVerify } = require("../auth/authUtils")
const { getInfoData } = require("../utils")

const { ForbidenRequestError, ConflictRequestError, AuthFailureError } = require("../core/error.response")
const { findByEmail } = require("./member.services")
const { createKeyPair } = require("../utils/access")

const RoleMember = {
    STUDENT: 0,
    TEACHER: 1,
    ADMIN: 2,
}

class AccessServices {
    
    /*
    */ 
    static handleRefreshToken = async (refreshToken) => {
        // 1 - check refreshToken in dbs
        const foundedKeyTokens = await KeyTokenServices.findByRefreshTokenUsed(refreshToken);
        console.log("[foundKeyTokens]:::", foundedKeyTokens)
        if (foundedKeyTokens) {
            // 2 - check refreshToken of who?
            const {userId, email} = JWTVerify(refreshToken, foundedKeyTokens.privateKey)
            console.log("[userId, email]:::", {userId, email})
            // 3 - Delete because refreshtoken is exposed
            await KeyTokenServices.removeKeyByUserId(userId)
            throw new ForbidenRequestError('the key token have issue! Pls relogin.')
        }
        
        // 3 - check refreshToken
        const holderKeyToken = await KeyTokenServices.findByRefreshToken(refreshToken);
        console.log("[holderKeyToken]:::", foundedKeyTokens)
        if (!holderKeyToken) throw new AuthFailureError('Member is not registered!');

        // 4 - verify token
        const {userId, email} = JWTVerify(refreshToken, holderKeyToken.privateKey)
        
        // 5 - check userid
        const foundMember = await findByEmail({email});
        if (!foundMember) throw new AuthFailureError('Member is not registered!');

        // 6 - create new token
        const tokens = await createTokenPair({userId, email}, holderKeyToken.publicKey, holderKeyToken.privateKey)

        // 7 - handle create new refreshToken and update refreshTokenUsed
        await holderKeyToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user: {userId, email},
            tokens
        }
    }

    /*
    */
    static logout = async (keyStore) => {
        console.log("[keyStore]:::", keyStore)
        const delKey = await KeyTokenServices.removeKeyById(keyStore._id);
        console.log({delKey});
        return delKey   
    }

    /*
        1 - check email in dbs
        2 - match password
        3 - create AT vs Rt and save
        4 - generate tokens
        5 - get data return login
    */
    static login = async ({email, password, refreshToken = null}) => {
        const foundMember = await findByEmail({email});
        if (!foundMember) throw new ForbidenRequestError('Member is not registered!')

        const match = bcrypt.compare(password, foundMember.password);
        if (!match) throw new AuthFailureError('Authentication error');

        const {privateKey, publicKey} = createKeyPair()
        console.log("privateKey, publicKey:::", privateKey, publicKey)

        const tokens = await createTokenPair({userId: foundMember._id, email}, publicKey, privateKey);
        
        console.log(`token:::`, tokens)

        await KeyTokenServices.createKeyToken({
            userId: foundMember._id,
            refreshToken: tokens.refreshToken,
            publicKey, privateKey
        })

        return {
            code: 201,
            metadata: {
                member: getInfoData({object: foundMember, fields: ['_id', 'name', 'email']}),
                tokens
            }
        }
    }

    static signUp = async ({ name, email, password, role = RoleMember.STUDENT}) => {
        // check email
        const isRegisteredMember = await memberModel.findOne({email}).lean();

        if (isRegisteredMember) {
            throw new ForbidenRequestError('Error: Member is registered!')
        }
        
        // hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // create student record
        const newMember = await memberModel.create({
            name, email, password: passwordHash, role 
        })

        // return token
        if (newMember) {
            
            const {privateKey, publicKey} = createKeyPair()

            // save to tokenKey collection
            const keyStore  = await KeyTokenServices.createKeyToken({
                userId: newMember._id,
                publicKey,
                privateKey
            })

            // created token pair
            if(!keyStore) {
                throw new ForbidenRequestError('Error: create keystore', 1003)
            }

            // create token pair
            const tokens = await createTokenPair({userId: newMember._id, email}, publicKey, privateKey);
            console.log(`created Token success::`, tokens);

            return {
                code: 201,
                metadata: {
                    member: getInfoData({ fields: ['_id', 'name', 'email'], object: newMember}),
                    tokens
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessServices