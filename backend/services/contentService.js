const ContentModel = require("../models/ContentModel")

exports.getAllContent = async () => {
    return await ContentModel.find()
}

exports.updateContentById = async (id, updateData) => {
    return await ContentModel.findByIdAndUpdate(id, updateData, {new: true})
}