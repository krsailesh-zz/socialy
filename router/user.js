const express = require('express')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
const postModel = require('../models/post')
const userModel = require('../models/user')

router.get('/user/:id', requireLogin, (req,res) => {
    userModel.findOne({_id:req.params.id})
    .select('-password')
    .then(user => {
        postModel.find({postedBy:user._id})
        .populate("postedBy",["_id","name"])
        .then(posts => {
            res.json({user,posts})
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.put('/follow/:id', requireLogin, (req,res) => {
    userModel.findByIdAndUpdate(req.params.id,{
        $push: {followers: req.user._id}
    },{
        new: true
    })
    .select('-password')
    .then(followedUser => {
        userModel.findByIdAndUpdate(req.user._id,{
            $push: {following: req.params.id}
        },{
            new: true
        })
        .select('-password')
        .then(followingUser => {
            res.json({followedUser,followingUser})
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.put('/unfollow/:id', requireLogin, (req,res) => {
    userModel.findByIdAndUpdate(req.params.id,{
        $pull: {followers: req.user._id}
    },{
        new: true
    })
    .select('-password')
    .then(followedUser => {
        userModel.findByIdAndUpdate(req.user._id,{
            $pull: {following: req.params.id}
        },{
            new: true
        })
        .select('-password')
        .then(followingUser => {
            res.json({followedUser,followingUser})
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.put('/updateprofilepic', requireLogin, (req,res) => {
    userModel.findByIdAndUpdate(req.user._id,{
        $set: {'profilepic': req.body.url}
    },{
        new: true
    })
    .then(doc => {
        res.json(doc)
    })
    .catch(err => console.log(err))
})

module.exports = router