const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")

require("dotenv").config()
const User = require("../models/user")

router.post("/", [
    check("email").isEmail().withMessage("please enter a valid email"),
    check("password").isStrongPassword().withMessage("please enter a strong password")
], (req, res) => {
    let error = validationResult(req)

    if(!error.isEmpty()) return res.status(400).json({
        error: error.array()
    })

    let email = req.body.email;
    let password = req.body.password;

    User.findOne({email}).then(userInfo => {
        if(userInfo) return res.status(417).json({
            message: "user already exists"
        })
        bcrypt.hash(password, 12).then(hashPassword => {
        let userObject = new User({
            email,
            password: hashPassword
        })

        userObject.save().then(user => {
            res.status(201).json({
                message: "user created successfully"
            })
        }).catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
    })

    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
})

router.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password

    User.findOne({email}).then(user => {
        if(!user) return res.status(417).json({
            message: "invalid credentials"
        })
        bcrypt.compare(password, user.password).then(matched => {
            if(!matched) return res.status(417).json({
                message: "invalid credential"
            })
            let accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m"})
            let refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1h"})

            res.cookie("rtc", refreshToken, { httpOnly: true, maxAge: 15 * 60 * 1000 }) 

            res.status(200).json({accessToken})
        })
    })
})

module.exports = router