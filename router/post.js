const express = require('express')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
const postModel = require('../models/post')

router.get('/allposts', requireLogin, (req, res) => {
    postModel.find()
        .populate('postedBy', ['_id', 'name', 'profilepic'])
        .populate('comments.commentedBy', ['_id', 'name'])
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/create', requireLogin, (req, res) => {
    const { title, body, url } = req.body
    if (!title || !body || !url) {
        return res.status(422).json({ error: 'Fill all the fields' })
    }

    req.user.password = undefined                   // to hide the password
    const post = new postModel({
        title,
        body,
        photo: url,
        postedBy: req.user
    })

    post.save()
        .then((postedData) => {
            res.json({ post: postedData })
        })
        .catch(err => console.log(err))
})

router.get('/myposts', requireLogin, (req, res) => {
    postModel.find({ postedBy: req.user._id })
        .populate('postedBy', ['_id', 'name'])
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, (req, res) => {
    postModel.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    })
        .populate("postedBy",["_id","name"])
        .populate("comments.commentedBy",["_id","name"])
        .then(doc => {
            res.json(doc)
        })
        .catch(err => console.log(err))
})

router.put('/unlike', requireLogin, (req, res) => {
    postModel.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    })
        .populate("postedBy",["_id","name"])
        .populate("comments.commentedBy",["_id","name"])
        .then(doc => {
            res.json(doc)
        })
        .catch(err => console.log(err))
})

router.put('/comment', requireLogin, (req, res) => {
    const { text, postId } = req.body
    const commentedBy = req.user._id
    postModel.findByIdAndUpdate(postId, {
        $push: { comments: { text, commentedBy } }
    }, {
        new: true
    })
        .populate('postedBy', ['_id', 'name'])
        .populate("comments.commentedBy", ['_id', 'name'])
        .then(doc => {
            res.json(doc)
        })
        .catch(err => console.log(err))
})

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    postModel.findOne({ _id: req.params.postId })
        .populate("postedBy",["_id"])
        .then((post) => {
            if(post.postedBy._id.toString()==req.user._id.toString()){
                post.remove()
                .then(data => {
                    res.json(data)
                })
                .catch(err => console.log(err))
            }
            else{
                res.json({error: "only creater of this post can delete this post!"})
            }
        })
        .catch(err => console.log(err))
})

router.get('/subscribedposts', requireLogin, (req, res) => {
    postModel.find({postedBy: {$in: req.user.following}})
        .populate('postedBy', ['_id', 'name'])
        .populate('comments.commentedBy', ['_id', 'name'])
        .then(posts => {
            res.json(posts)
        })
        .catch(err => {
            console.log(err)
        })
})

module.exports = router