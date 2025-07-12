const userActivityService = require('../services/userActivityService')

exports.getUserActivities = async (req, res) => {
  const { userId, type, contentId, contentTitle, ipAddress, userAgent, description } = req.query;

  try {
    const filter = {};
    if (userId) filter.userId = userId;
    if (type) filter.type = type;
    if (contentId) filter.contentId = contentId;
    if (contentTitle) filter.contentTitle = contentTitle;
    if (ipAddress) filter.ipAddress = ipAddress;
    if (userAgent) filter.userAgent = userAgent;
    if (description) filter.description = { $regex: description, $options: "i" };

    const activities = await userActivityService.getActivitiesByFilter(filter);
    res.status(200).json({ success: true, activities });
  } catch (err) {
    console.error("Failed to get user activities:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

