'use strict'


const StatusCode = {
    UNAUTHORIZED: 401,
    FORBIDEN: 404,
    CONFLICT: 409
}

const ReasonStatusCode = {
    UNAUTHORIZED: 'Unauthorized',
    FORBIDEN: 'Bad request error', 
    CONFLICT: 'Conflict error'
}

const {
    StatusCodes,
    ReasonPhrases
} = require('../utils/httpStatusCode')


class ErrorResponse extends Error {
    
    constructor(message, status) {
        super(message);
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {

    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode)
    }
}

class ForbidenRequestError extends ErrorResponse {

    constructor(message = ReasonStatusCode.FORBIDEN, statusCode = StatusCode.FORBIDEN) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse{

    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse{

    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode)
    }
}


module.exports = {
    ConflictRequestError,
    ForbidenRequestError,
    AuthFailureError,
    NotFoundError
}