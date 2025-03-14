'use strict'

const memberModel = require("../models/member.model")

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenServices = require("./keyToken.services")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")

const RoleMember = {
    STUDENT: 0,
    TEACHER: 1,
}

class SignUpServices {
    
    static signUp = async ({ name, email, password, role}) => {
        try {
            // check email
            const isRegisteredMember = await memberModel.findOne({email}).lean();

            if (isRegisteredMember) {
                return {
                    code: '1002',
                    message: 'Member is registered!'
                }
            }
            
            // hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // create student record
            const newMember = await memberModel.create({
                name, email, password: passwordHash, role 
            })
    
            // return token
            if (newMember) {
                // create privateKey, publicKey
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                // console.log({privateKey, publicKey})

                // save to tokenKey collection
                const keyStore  = await KeyTokenServices.createKeyToken({
                    user_id: newMember._id,
                    publicKey,
                    privateKey
                })

                // created token pair
                if(!keyStore) {
                    return {
                        code: '1003',
                        message: 'create keystore error'
                    }
                }

                // const publicKeyObject = crypto.createPublicKey(publicKey)

                // create token pair
                const tokens = await createTokenPair({userId: newMember._id, email}, publicKey, privateKey);
                console.log(`created Token success::`, tokens);

                return {
                    code: 201,
                    metadata: {
                        member: getInfoData({ fields: ['_id', 'name', 'email'], newMember}),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            return {
                code: '1003',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = SignUpServices