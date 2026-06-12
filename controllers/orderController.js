import Address from "../models/addressModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import {
  createNotification,
} from "../utils/admin/createNotification.js";
import User from "../models/UserModel.js";
import Coupon from "../models/couponModel.js";
import CouponRedemption from "../models/couponRedemptionModel.js";
 import {
   sendOrderStatusEmail,
 } from "../utils/sendOrderStatusEmail.js";

export const createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod,  couponCode } = req.body;



    /* VALIDATE ADDRESS */

    const address = await Address.findOne({
      _id: addressId,

      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    /* GET CART */

    const cart = await Cart.findOne({
      user: req.user._id,
    })

      .populate("items.product");

    if (!cart || !cart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const orderItems = [];

    let itemsPrice = 0;

    /* VALIDATE PRODUCTS */

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product no longer exists",
        });
      }

      /* STOCK CHECK */

      let availableStock = product.stock;

      if (item.variantId) {
        const variant = product.variants.id(item.variantId);

        if (!variant) {
          return res.status(400).json({
            success: false,
            message: "Variant not found",
          });
        }

        availableStock = variant.stock;
      }

      if (item.quantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `${item.name} is out of stock`,
        });
      }









      /* SNAPSHOT ITEM */

      let finalPrice = product.price;

      let variantSnapshot = null;

      if (item.variantId) {
        const variant = product.variants.id(item.variantId);

        finalPrice = variant.price;

        variantSnapshot = {
          variantId: variant._id,

          sku: variant.sku,

          size: variant.size,

          material: variant.material,
        };
      }

      orderItems.push({
        product: product._id,

        slug: product.slug,

        name: product.name,

        image: product.images?.[0]?.url || "",

        price: finalPrice,

        quantity: item.quantity,

        variant: variantSnapshot,
      });

      itemsPrice += finalPrice * item.quantity;
    }



          /* PRICING */

const subtotalPrice = itemsPrice;

const shippingPrice = 0;

const taxPrice = 0;

let discountAmount = 0;

let couponSnapshot = null;

/* COUPON */

let coupon = null;

if (couponCode) {

  coupon = await Coupon.findOne({
    code: couponCode
      .toUpperCase()
      .trim(),

    isActive: true,
  });

  if (!coupon) {
    return res.status(400).json({
      success: false,
      message: "Invalid coupon",
    });
  }

  if (
    coupon.startsAt &&
    coupon.startsAt > new Date()
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Coupon not started yet",
    });
  }

  if (
    coupon.expiresAt &&
    coupon.expiresAt < new Date()
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Coupon expired",
    });
  }

  if (
    coupon.usageLimit &&
    coupon.usageCount >=
      coupon.usageLimit
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Coupon usage limit reached",
    });
  }

  const userRedemptions =
    await CouponRedemption.countDocuments({
      coupon: coupon._id,
      user: req.user._id,
    });

  if (
    userRedemptions >=
    coupon.perUserLimit
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Coupon usage limit reached",
    });
  }

  if (coupon.firstOrderOnly) {

    const previousOrder =
      await Order.exists({
        user: req.user._id,
      });

    if (previousOrder) {
      return res.status(400).json({
        success: false,
        message:
          "Coupon valid only for first order",
      });
    }

  }

  if (
    subtotalPrice <
    coupon.minOrderAmount
  ) {
    return res.status(400).json({
      success: false,
      message:
        `Minimum order ₹${coupon.minOrderAmount}`,
    });
  }

  if (
    coupon.discountType ===
    "PERCENTAGE"
  ) {

    discountAmount =
      (subtotalPrice *
        coupon.discountValue) /
      100;

    if (
      coupon.maxDiscountAmount
    ) {
      discountAmount = Math.min(
        discountAmount,
        coupon.maxDiscountAmount
      );
    }

  } else if (
    coupon.discountType ===
    "FIXED"
  ) {

    discountAmount = Math.min(
      coupon.discountValue,
      subtotalPrice
    );

  }

  couponSnapshot = {
    couponId:
      coupon._id,

    code:
      coupon.code,

    discountType:
      coupon.discountType,

    discountValue:
      coupon.discountValue,

    discountAmount,
  };
}




const totalPrice = Math.max(
  0,
  subtotalPrice -
    discountAmount +
    shippingPrice +
    taxPrice
);





    /* ORDER NUMBER */

const orderNumber =
  `ORD-${Date.now()}`;




    /* CREATE ORDER */

    const order = await Order.create({
      /* USER */

      user: req.user._id,

      /* CUSTOMER SNAPSHOT */

      customerName: req.user.name,

  customerEmail:
  req.user.email ||
  address.email ||
  "",

      customerPhone: address.phone,

      /* ITEMS */

      items: orderItems,

      /* SHIPPING ADDRESS */

      shippingAddress: {
        fullName: address.fullName,

        phone: address.phone,

        pincode: address.pincode,

        state: address.state,

        city: address.city,

        addressLine1: address.addressLine1,

        addressLine2: address.addressLine2,

        landmark: address.landmark,
      },

      /* PAYMENT */

      paymentMethod,

      /* PRICING */

     subtotalPrice,

itemsPrice,

discountAmount,

shippingPrice,

taxPrice,

totalPrice,

coupon:
  couponSnapshot,

// order number
      orderNumber,


       /* STATUS HISTORY */

    statusHistory: [

      {
        status: "PLACED",
      },

    ],


    });

const email =
  order.customerEmail;

if (
  order.customerEmail &&
  order.customerEmail.trim()
) {

  try {

    console.log({
  email: order.customerEmail,
  customerName: order.customerName,
  orderNumber: order.orderNumber,
});

    await sendOrderStatusEmail({

      email:
        order.customerEmail,

      customerName:
        order.customerName,

      orderNumber:
        order.orderNumber,

      status:
        "PLACED",

    });

  } catch (err) {

    console.error(
      "Order confirmation email failed:",
      err
    );

  }

}









if (coupon) {

  await CouponRedemption.create({
  coupon: coupon._id,
  user: req.user._id,
  order: order._id,
  discountAmount,
});

await Coupon.findByIdAndUpdate(
  coupon._id,
  {
    $inc: {
      usageCount: 1,
    },
  }
);

}

    for (const item of cart.items) {
      const product = item.product;

      if (item.variantId) {
        const variant = product.variants.id(item.variantId);

        variant.stock -= item.quantity;
      } else {
        product.stock -= item.quantity;
      }

      await product.save();
    }

    /* CLEAR CART */

    cart.items = [];

    await cart.save();



    // order creation notification
const admin =
  await User.findOne({
    role: "admin",
  });

if (admin) {

  await createNotification({

    userId:
      admin._id,

    type: "order",

    title:
      "New Order Received",

    message:
      `${req.user.name}
       placed
       ${order.orderNumber}`,

    link:
      `/admin/orders/${order._id}`,

  });

}










    /* RESPONSE */

    res.status(201).json({
      success: true,

      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};





export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,

      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,

      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,

      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};
