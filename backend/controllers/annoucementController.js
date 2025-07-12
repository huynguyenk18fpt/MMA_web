const annoucementService = require("../services/annoucementService.js")

exports.getAllAnnoucement = async(req, res) => {
    try {
        const data = await annoucementService.getAllAnnoucement()
        res.json({success: true, announcements: data})
    } catch(err){
        console.error("Error getting announcements: ", err)
        res.status(500).json({success: false, message: "Internal server error"})
    }
}

exports.getRecipientGroups = async(req, res) => {
    try {
        const groups = await annoucementService.getRecipientGroups()
        res.json({success: true, groups})
    } catch(err){
        console.error("Error getting recipient groups: ", err)
        res.status(500).json({success: false, message: "Internal server error"})
    }
}

exports.createAnnoucement = async(req, res) => {
    try{
        const newData = req.body
        const created = await annoucementService.createAnnoucement(newData)
        res.status(201).json(created)

    } catch(err){
        console.error("Error creating annoucement: ", err)
        res.status(500).json("Internal server error")
    }
}