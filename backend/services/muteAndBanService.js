const Report = require('../models/ReportModel')


exports.getAllReportWithExtend = async () => {
  const reports = await Report.find()
    .populate({
      path: 'reportedBy',
      select: '_id email name'
    })
    .populate({
      path: 'reportedUser',
      select: '_id email name isMuted muteReason mutedUntil isBanned banReason bannedUntil status'
    })
    .exec()

  return reports
}