'use strict'

const express = require('express')
const accessControler = require('../../../controllers/access.controler')
const router = express.Router()

router.post('/member/signUp/', accessControler.signUp)

module.exports = router