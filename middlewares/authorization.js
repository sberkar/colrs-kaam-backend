const jwt = require("jsonwebtoken")
const User = require("../models/user")

module.exports = (req, res, next) => {
    let authHeader = req.header("authorization");
    if(!authHeader){
        return res.status(401).json({
            message: "please authenticate first"
        })
    }
    let token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(403).json({
                message: "forbidden"
            })
        }
        User.findOne({email: decoded.email}).then(user => {
            req.user = user
            return next()
        }).catch(err => {
            return res.status(500).json({
                message: err.message
            })
        })
    })
}