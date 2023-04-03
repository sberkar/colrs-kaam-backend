const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const kaamRouter = require("./routes/kaams")
const userRouter = require("./routes/users")
const refreshRouter = require("./routes/refresh")

require("dotenv").config()
const app = express()

app.use(bodyParser.json())

app.use(cookieParser())

const allowedOrigins = ["http://localhost:5173"]

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use("/api/kaam", kaamRouter)
app.use("/api/u", userRouter)
app.use("/api/refresh", refreshRouter)

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