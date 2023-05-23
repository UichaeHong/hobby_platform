const mongoose = require('mongoose')

const user_info = mongoose.Schema({
    name : {
        type :String,
        required : true
    },
    birthday : {
        type :String,
        required : true
    },
    email : {
        type :String,
        required : true
    },
    pw : {
        type :String,
        required : true
    },
    salt : {
        type :String,
        required : true
    },
    gender : {
        type :String,
        required : true
    },
})

const User_Info = mongoose.model('User_Info',user_info)
module.exports = User_Info