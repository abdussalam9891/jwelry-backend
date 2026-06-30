import User from "../../models/UserModel.js";
import { createNotification } from "../../utils/admin/createNotification.js";

export async function notifyNewOrder(checkoutContext) {
  const { order, user } = checkoutContext;

  const admin = await User.findOne({
    role: "admin",
  }).select("_id");

  if (!admin) return;

  await createNotification({
    userId: admin._id,
    type: "order",
    title: "New Order Received",
    message: `${order.customerName} placed ${order.orderNumber}`,
    link: `/admin/orders/${order._id}`,
    metadata: {
  orderId: order._id,
  orderNumber: order.orderNumber,
  customerId: order.user,
},
  });
}
