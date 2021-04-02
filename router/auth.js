const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const bcryptjs = require('bcryptjs')
const { JWT_SECRET, GMAIL_USER, GMAIL_APP_PASS, DOMAIN } = require('../config/keys')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

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
                                from: 'krsailesh2001@gmail.com',
                                to: user.email,
                                subject: 'signed up successfully on socialy',
                                html: '<h2>Welcome to socialy</h2>'
                            })
                                .catch(err => console.log(err))
                            res.json(user)
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

router.post('/resetpass', (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(422).json({ error: "fill the email field!" })
    }
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }

        const token = buffer.toString('hex')
        userModel.findOne({ email: email })
            .then(userdata => {
                if (!userdata) {
                    res.status(422).json({ error: 'There is no account registered with this email' })
                }

                userdata.resetToken = token;
                userdata.expireToken = Date.now() + 3600000
                userdata.save()
                    .then(saveduser => {
                        transporter.sendMail({
                            from: 'no-reply@socialy.com',
                            to: saveduser.email,
                            subject: 'Restore Password',
                            html: `<p>To reset your password, please use the following link:</p>
                                <h5><a href="${DOMAIN}/resetpass/${token}">link</a></h5>
                            `
                        })
                            .then(data => {
                                res.json(data)
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    })
})

router.post('/newpassword', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    userModel.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: 'Session has expired' })
            }

            bcryptjs.hash(newPassword, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword
                    user.resetToken = undefined
                    user.expireToken = undefined
                    user.save(saveduser => {
                        res.json({ message: 'Password updated successfully' })
                    })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        })
})

module.exports = router