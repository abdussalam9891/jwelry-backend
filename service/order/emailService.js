import { sendOrderStatusEmail } from "../../service/email/sendOrderStatusEmail.js";

export async function sendOrderStatus(
  checkoutContext,
  status
) {
  const { order } = checkoutContext;

  if (
    !order.customerEmail ||
    !order.customerEmail.trim()
  ) {
    return;
  }

  try {
    await sendOrderStatusEmail({
      email: order.customerEmail,
      customerName:
        order.customerName,
      orderNumber:
        order.orderNumber,
      status,
    });
  } catch (error) {
    console.error(
      "Order status email failed:",
      error
    );
  }
}
