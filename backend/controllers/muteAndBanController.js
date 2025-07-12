const muteAndBanService = require("../services/muteAndBanService.js")
const UserModel = require("../models/UserModel.js")

exports.getAllReportWithExtend = async (req, res) => {
    try {
        const report = await muteAndBanService.getAllReportWithExtend();
        res.status(200).json({ success: true, message: "Get all reports with extended successfully", report })
    } catch (error) {
        console.error("Error fetching report:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.updateMuteStatus = async (req, res) => {
    const { userId } = req.params
    const { isMuted, muteReason, muteUntil } = req.body
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isMuted,
                muteReason: isMuted ? muteReason : null,
                mutedUntil: isMuted ? muteUntil : null,
            },
            { new: true }
        )
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, message: "Mute status updated", user: updatedUser })
    } catch (err) {
        console.error("Error updating mute user status", err)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.updateBanStatus= async(req,res) => {
    const{userId} = req.params
    const{isBanned, banReason, bannedUntil} = req.body
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isBanned,
                banReason : isBanned ? banReason : null,
                bannedUntil : isBanned ? bannedUntil : null 
            },
            { new: true }
        )
        if(!updatedUser){
            return res.status(404).json({success: false, message: "User not found"})
        }
        res.status(200).json({success: true, message: "Ban status updated", user: updatedUser })
    } catch (err) {
        console.error("Error updating ban user status", err)
        res.status(500).json({ succcess: false, message: "Internal server error"})
    }
}