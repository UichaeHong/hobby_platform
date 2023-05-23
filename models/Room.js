const mongoose = require('mongoose')

const room = mongoose.Schema({
    title : {
        type :String,
        required : true
    },
    date : {
        type :String,
        required : true
    },
    location : {
        type :String,
        required : true
    },
    personnel : {
        type :String,
        required : true
    },
    price : {
        type :String,
        required : true
    },
    category : {
        type :String,
        required : true
    },
    src : {
        type :String,
        required : true
    },
})

const Room = mongoose.model('Room',room)
module.exports = Room;