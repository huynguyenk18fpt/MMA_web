const mongoose = require("mongoose");
const UserActivity = require("../models/UserActivity");

const ObjectId = mongoose.Types.ObjectId;

exports.getActivitiesByFilter = async (filter) => {
  try {
    if (filter.userId && typeof filter.userId === "string") {
      if (ObjectId.isValid(filter.userId)) {
        filter.userId = new ObjectId(filter.userId);
      } else {
        return [];
      }
    }

    const activities = await UserActivity.find(filter)
      .populate({ path: "userId", select: "name" }) // ✅ populate name
      .sort({ timestamp: -1 })
      .lean();

    // ✅ Gán userName từ userId.name và convert userId thành string
    const enriched = activities.map((activity) => {
      const user = activity.userId;
      return {
        ...activity,
        userId: user?._id?.toString() || null,
        userName: user?.name || null,
      };
    });

    return enriched;
  } catch (err) {
    console.error("getActivitiesByFilter failed:", err);
    throw err;
  }
};
