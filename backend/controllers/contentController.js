const contentService = require("../services/contentService.js")

exports.getAllContent = async (req, res) => {
    try {
        const contents = await contentService.getAllContent()
        res.status(200).json({success: true, data: contents})
    } catch (error) {
        console.error("Error in get all Content controller", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}


exports.updateContentById = async (req,res) => {
    const contentId = req.params.id
    const {status, moderationNote} = req.body
    if(!status){
        return res.status(400).json({success: false, message: "Failed to get status"})
    }
    try {
        const updatedContent = await contentService.updateContentById(contentId,{
            status,
            moderationNote,
            lastModified: new Date()
        })
        if(!updatedContent){
            return res.status(404).json({success: false, message: "Failed to update content"})
        }
        res.status(200).json({success: true, data: updatedContent})
    } catch(error){
        console.error("Error in updatedContent controller:", error)
        res.status(500).json({success: false, message: "Internal server error"})
    }
}