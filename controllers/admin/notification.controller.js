import Notification
from "../../models/NotificationModel.js";

export const
getNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({

          user:
            req.user._id,
            isDeleted: false,

        })

        .sort({
          createdAt: -1,
        })

        .limit(10);

     const unreadCount =
  await Notification.countDocuments({
    user: req.user._id,
    read: false,
    isDeleted: false,
  });

      res.json({

        notifications,

        unreadCount,

      });

    } catch {

      res.status(500).json({

        message:
          "Failed to fetch notifications",

      });

    }

};


export const markAsRead =
  async (req, res) => {

    try {

      const notification =
  await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

      if (!notification) {

        return res.status(404).json({

          message:
            "Notification not found",

        });

      }

      notification.read = true;

      await notification.save();

      res.json({

        success: true,

      });

    } catch {

      res.status(500).json({

        message:
          "Failed to update notification",

      });

    }

};


export const markAllRead =
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          user: req.user._id,
          read: false,
        },
        {
          $set: {
            read: true,
          },
        }
      );

      res.json({
        success: true,
      });
    } catch {
      res.status(500).json({
        message:
          "Failed to update notifications",
      });
    }
  };



export const clearNotifications =
  async (req, res) => {
    try {
      await Notification.updateMany(
  { user: req.user._id },
  { $set: { isDeleted: true } }
);

      res.json({
        success: true,
      });
    } catch {
      res.status(500).json({
        message:
          "Failed to clear notifications",
      });
    }
  };


  export const deleteNotification =
  async (req, res) => {
    try {
     const notification =
  await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

if (!notification) {
  return res.status(404).json({
    message: "Notification not found",
  });
}

res.json({
  success: true,
});
    } catch {
      res.status(500).json({
        message:
          "Failed to delete notification",
      });
    }
  };
