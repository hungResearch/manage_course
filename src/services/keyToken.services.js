'use strict'

const keyTokenModel = require('../models/keyToken.model')

const { Types } = require('mongoose')

class KeyTokenServices {
    
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken = ''}) => {
        try {
            // level 0
            // const token = await keyTokenModel.create({
            //     userId: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // })

            const filter = {userId: userId}, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = {upsert: true, new: true}
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options) 
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async({userId}) => {
        return await keyTokenModel.findOne({ userId: new Types.ObjectId(userId)}).lean()
    }

    static findByRefreshToken = async(refreshToken) => {
        return await keyTokenModel.findOne({refreshToken: refreshToken})
    }

    static findByRefreshTokenUsed = async(refreshToken) => {
        return await keyTokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }

    static removeKeyById = async({id}) => {
        console.log("[id]:::", id)
        return await keyTokenModel.deleteOne({_id: new Types.ObjectId(id)})
    }

    static removeKeyByUserId = async (userId) => {
        console.log("[userId]:::", userId)
        return await keyTokenModel.deleteOne({userId: new Types.ObjectId(userId)})
    }
}


module.exports = KeyTokenServices