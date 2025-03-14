'use strict'

const keyTokenModel = require('../models/keyToken.model')

class KeyTokenServices {
    
    static createKeyToken = async ({user_id, publicKey, privateKey}) => {
        try {
            // const publicKeyString = publicKey.toString();
            const token = await keyTokenModel.create({
                user_id: user_id,
                publicKey: publicKey,
                privateKey: privateKey
            })

            return token ? token.publicKey : null
        } catch (error) {
            return error
        }
    }
}


module.exports = KeyTokenServices