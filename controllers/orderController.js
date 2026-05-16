import Address from "../models/addressModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;

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

    /* SHIPPING */

    const shippingPrice = 0;

    /* TOTAL */

    const totalPrice = itemsPrice + shippingPrice;





    /* ORDER NUMBER */

const orderNumber =
  `ORD-${Date.now()}`;

    /* CREATE ORDER */

    const order = await Order.create({
      /* USER */

      user: req.user._id,

      /* CUSTOMER SNAPSHOT */

      customerName: req.user.name,

      customerEmail: req.user.email,

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

      itemsPrice,

      shippingPrice,

      totalPrice,


// order number
      orderNumber,


       /* STATUS HISTORY */

    statusHistory: [

      {
        status: "PLACED",
      },

    ],

    
    });

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
