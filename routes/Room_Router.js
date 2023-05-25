const express = require('express')
const controller_room = require('../controller/Croom')
const router = express.Router()
const {logined} = require('../routes/Auth')

router.get('/getData',controller_room.GetData)
router.get('/DetailedPage/:id',logined,controller_room.DetailPage)
router.post('/make/room',logined,controller_room.MakeRoom)


module.exports = router;
 