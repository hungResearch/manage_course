'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Member'
const COLLECTION_NAME = 'Members'

// decrale schema of member model
const memberSchema = new Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    stauts: {
        type: String,
        enum: ['inactive', 'active'],
        default: 'inactive'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

// export module
module.exports = model(DOCUMENT_NAME, memberSchema)