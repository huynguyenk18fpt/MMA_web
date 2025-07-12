const reportService = require("../services/reportService.js")

exports.getAllReports = async (req, res) => {
    try {
        const report = await reportService.getAllReport()
        res.status(200).json({success: true, message: "Get all reports successfully", report})
    } catch(error){
        console.error("Error fetching report:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.updateReportStatus = async (req, res) => {
  try {
    const reportId = req.params.id
    const { status, resolution } = req.body

    if (!status || typeof status !== "string") {
      return res.status(400).json({ success: false, message: "Status is required and must be a string" })
    }

    const updatedReport = await reportService.updateReportStatus(reportId, status, resolution)

    if (!updatedReport) {
      return res.status(404).json({ success: false, message: "Report not found" })
    }

    res.status(200).json(updatedReport)
  } catch (error) {
    console.error("Error updating report:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}