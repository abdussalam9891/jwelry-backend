import Announcement from "../models/announcementModel.js";

export async function getAnnouncements(req, res) {
  const announcements = await Announcement.find({
    isActive: true,
  })
    .sort("order")
    .select("text");

  res.json({
    announcements,
  });
}
