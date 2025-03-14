'use strict'
const { model, Schema, Types} = require('mongoose')

const DOCUMENT_NAME = 'KeyToken';
const COLLECTION_NAME = 'KeyTokens';

const keyTokenSchema = new Schema({
    user_id: {
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
    refreshToken: {
        type: Array,
        default: []
    }
},
{
    timestamps: true,
    collection: COLLECTION_NAME
}
)

module.exports = model(DOCUMENT_NAME, keyTokenSchema)