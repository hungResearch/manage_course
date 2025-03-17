'use strict'

const crypto = require('crypto')
const createKeyPair = () => {
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
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    return {privateKey, publicKey}
}

module.exports = {
    createKeyPair
}