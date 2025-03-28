'use strict'
const { model, Schema, Types} = require('mongoose')

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'KeyTokens';

const keyTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
    collection: COLLECTION_NAME
}
)

module.exports = model(DOCUMENT_NAME, keyTokenSchema)