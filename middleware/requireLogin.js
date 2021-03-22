const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const userModel = require('../models/user')

module.exports = (req,res,next) => {
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: 'You must be logged in to access this page'})
    }

    const token = authorization
    jwt.verify(token, JWT_SECRET, (err,payload) => {
        if(err){
            return res.status(401).json({error: 'You must be logged in to access this page'})
        }

        const { id } = payload
        userModel.findOne({_id:id})
            .then((userData) => {
                req.user = userData
                next()
            })
            .catch(err => console.log(err))
    })
}