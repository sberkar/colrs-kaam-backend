const mongoose = require("mongoose")

let KaamSchema = new mongoose.Schema({
    kaam: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

module.exports = mongoose.model("Kaam", KaamSchema)