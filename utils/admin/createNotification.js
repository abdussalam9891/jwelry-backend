import Notification from "../../models/NotificationModel.js";
import User from "../../models/UserModel.js";

export async function createNotification({
  userId,
  type,
  title,
  message,
  link = null,
  metadata = {},
}) {


  
  const user = await User.findById(userId);

  if (!user) return null;



  const preferenceMap = {
    order: "orders",
    inventory: "stockAlerts",
    customer: "customers",
  };

    const preferenceKey =
    preferenceMap[type];



  if (
    preferenceKey &&
    user.notificationPreferences?.[
      preferenceKey
    ] === false
  ) {


    return null;
  }



  return await Notification.create({
    user: userId,
    type,
    title,
    message,
    link,
    metadata,
  });
}
