const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    resetToken: String,
    expireToken: Date,
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    profilepic : {
        type: String,
        default: "https://res.cloudinary.com/dyvfmtztg/image/upload/v1616071018/-abstract-user-icon-1_x6u8uz.png"
    }
})

module.exports = mongoose.model('User', userSchema)