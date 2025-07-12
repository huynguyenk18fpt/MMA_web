const mongoose = require("mongoose")
const ReportModel = require("../models/ReportModel")

exports.getAllReport = async () => {
    return await ReportModel.find()
        .populate("reportedBy", "name email")      // chỉ lấy name và email của người báo cáo
        .populate("reportedUser", "name email")
        .populate("contentId", "type")
}

exports.updateReportStatus = async (reportId, status, resolution) => {
    if (!mongoose.Types.ObjectId.isValid(reportId)) return null

    const updated = await ReportModel.findByIdAndUpdate(
        reportId,
        {
            status,
            resolution: resolution || ""
        },
        { new: true }
    )
        .populate("reportedBy", "name email")      // chỉ lấy name và email của người báo cáo
        .populate("reportedUser", "name email")
        .populate("contentId", "type")
        return updated
}