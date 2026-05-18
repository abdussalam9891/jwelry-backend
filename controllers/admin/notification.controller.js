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

        })

        .sort({
          createdAt: -1,
        })

        .limit(20);

      const unreadCount =
        notifications.filter(
          (n) => !n.read
        ).length;

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
        await Notification.findById(
          req.params.id
        );

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
