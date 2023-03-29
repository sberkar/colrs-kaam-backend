const router = require("express").Router()
const { isValidObjectId } = require("mongoose")
const AuthMiddleWare = require("../middlewares/authorization")

const Kaam = require("../models/kaam")


router.use(AuthMiddleWare)

router.post("/", (req, res) => {
    let kaam = req.body.kaam;
    let isCompleted = req.body.isCompleted;
    let createdAt = new Date()

    let kaamObject = new Kaam({
        kaam,
        isCompleted,
        createdAt,
        userId: req.user.id
    })

    kaamObject.save().then(doc => res.status(201).json(doc)).catch(err => {
        res.status(500).json({
            message: err.message
        })
    })

})

router.get("/all", (req, res) => {
    Kaam.find({ userId: req.user.id }).then(kaams => {
        res.status(200).json(kaams)
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
})

router.get("/:id", (req, res) => {
    let id = req.params.id;

    if(!isValidObjectId(id)) return res.status(400).json({
        message: "id is not valid"
    })
    Kaam.findOne({_id: id, userId: req.user.id }).then(kaam => {
        if(!kaam){
            return res.status(404).json({
                message: "no kaam found"
            })
        }
        return res.status(200).json(kaam)
    })
})

router.put("/:id", (req, res) => {
    let id = req.params.id;
    let kaam = req.body.kaam;
    let isCompleted = req.body.isCompleted

    Kaam.findOneAndUpdate({ _id: id, userId: req.user.id}, { kaam, isCompleted }, { new: true}).then(doc => {
        res.status(200).json(doc)
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
})

router.delete("/:id", (req, res) => {
    let id = req.params.id;
    
    if(!isValidObjectId(id)) return res.status(400).json({
        message: "id is not valid"
    })

    Kaam.findOneAndDelete({_id: id, userId: req.user.id }).then(response => {
        return res.sendStatus(204)
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
})

module.exports = router