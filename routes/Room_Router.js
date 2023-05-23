const express = require('express')
const controller_room = require('../controller/Croom')
const router = express.Router()
const {logined} = require('../routes/Auth')

router.get('/getData',controller_room.GetData)
router.get('/main',controller_room.GetInitData)
router.get('/DetailedPage/:id',logined,controller_room.DetailPage)
router.post('/makeRoom',logined,controller_room.MakeRoom)


module.exports = router;
 