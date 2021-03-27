const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const bcryptjs = require('bcryptjs')
const { JWT_SECRET, GMAIL_USER, GMAIL_APP_PASS } = require('../config/keys')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASS
    }
})

router.post('/signup', (req, res) => {
    const { name, email, password, profilepic } = req.body
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please fill all the fields" })
    }

    userModel.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "Email is already registered!" })
            }

            bcryptjs.hash(password, 10)
                .then((hashedPassword) => {
                    const user = new userModel({
                        name,
                        email,
                        password: hashedPassword,
                        profilepic
                    })

                    user.save()
                        .then((user) => {
                            transporter.sendMail({
                                from: 'no-reply@socialy.com',
                                to: user.email,
                                subject: 'signed up successfully on socialy',
                                html: '<h2>Welcome to socialy</h2>'
                            })
                                .then(res => {
                                    res.json(res)
                                })
                                .catch(err => console.log(err))
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please fill all the fields!" })
    }

    userModel.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "Please signup first!" })
            }

            bcryptjs.compare(password, savedUser.password)
                .then((doMatch) => {
                    if (!doMatch) {
                        return res.status(422).json({ error: 'Incorrect password!' })
                    }
                    // res.json({message: 'Successfully logged in'})

                    const token = jwt.sign({ id: savedUser.id }, JWT_SECRET);
                    const { _id, name, email, followers, following, profilepic } = savedUser
                    res.json({ token, user: { _id, name, email, followers, following, profilepic } })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

module.exports = router