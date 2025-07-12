const annoucementModel = require("../models/Announcement.js")
const userModel = require("../models/UserModel.js")

exports.getAllAnnoucement = async() => {
    const annoucements = await annoucementModel.find().sort({sentAt: -1})
    return annoucements
}

exports.createAnnoucement = async(data)=>{
    const annoucement = new annoucementModel({
        ...data,
        sendAt: new Date(),
        readCount: 0,
    })
    return await annoucement.save()
}

exports.getRecipientGroups = async() => {
    const roles = ["User", "Author"]
    const groups = await Promise.all(
        roles.map(async (role) => {
            const count = await userModel.countDocuments({role})
            return {
                id: role.toLowerCase(),
                label: role + "s",
                count
            }
        })
    )
    const total = await userModel.countDocuments({role: {$in: roles} })
    return [{id: "all", label: "All Users", count: total}, ...groups]
}
