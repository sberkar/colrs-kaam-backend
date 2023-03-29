const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const kaamRouter = require("./routes/kaams")
const userRouter = require("./routes/users")

require("dotenv").config()
const app = express()

app.use(bodyParser.json())

app.use("/api/kaam", kaamRouter)
app.use("/api/u", userRouter)

app.use((req, res, next) => {
    res.status(404).json({
        message: "route not found"
    })
})

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("db connected")
    app.listen(8000)
}).catch(err => {
    throw err
})