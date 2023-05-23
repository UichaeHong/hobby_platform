const express = require('express')
const controller_user = require('../controller/Cuser_Info')
const router = express.Router()

router.post('/signup',controller_user.Signup)
router.post('/login',controller_user.Login)
router.get('/logout',controller_user.Logout)

module.exports = router;