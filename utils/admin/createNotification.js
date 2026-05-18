
import Notification
from "../../models/NotificationModel.js";

export async function
createNotification({

  userId,

  type,

  title,

  message,

  link = null,

  metadata = {},

}) {

  return await Notification.create({

    user: userId,

    type,

    title,

    message,

    link,

    metadata,

  });

}
