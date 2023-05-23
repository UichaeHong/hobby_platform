const express = require('express')
const controller_render = require('../controller/Crender')
const router = express.Router()
const {logined} = require('../routes/Auth')

router.get('/login',controller_render.RenderLogin)
router.get('/signup',controller_render.RenderSignup)
router.get('/makeRoom',logined,controller_render.RenderMakeRoom)
router.get('/chat',controller_render.RenderChat)

module.exports = router;