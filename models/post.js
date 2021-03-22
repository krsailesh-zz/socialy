const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    photo : {
        type : String,
        required: true
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            text: {
                type: String
            },
            commentedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

module.exports = mongoose.model('Post', postSchema)