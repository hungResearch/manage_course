'use strict'

const express = require('express')
const accessControler = require('../../../controllers/access.controler')
const asyncHandler = require('../../../helpers/asyncHandler')
const { authentication } = require('../../../auth/authUtils')
const router = express.Router()


router.post('/member/signUp/', asyncHandler(accessControler.signUp))
router.post('/member/signIn/', asyncHandler(accessControler.login))

// authentication
router.use(authentication)

// logout
router.post('/member/logout/', asyncHandler(accessControler.logout))

module.exports = router