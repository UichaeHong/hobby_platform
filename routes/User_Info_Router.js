const express = require('express')
const controller_user = require('../controller/Cuser_Info')
const router = express.Router()
const {logined} = require('../routes/Auth')

router.post('/signup',controller_user.Signup)
router.post('/login',controller_user.Login)

router.get('/logout',logined,controller_user.Logout)

module.exports = router;