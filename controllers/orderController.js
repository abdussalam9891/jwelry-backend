import Address from "../models/addressModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;

    // 🔥 validate address
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

    // 🔥 get cart
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || !cart.items.length) {
      return res.status(400).json({
        success: false,

        message: "Cart is empty",
      });
    }

    const orderItems = [];

    let itemsPrice = 0;

    // 🔥 validate products + stock
    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          success: false,

          message: "Product no longer exists",
        });
      }

      // 🔥 stock check
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


      // 🔥 snapshot item
      orderItems.push({
        product: product._id,

        name: item.name,
        image: item.image,
        price: item.price,

        quantity: item.quantity,
      });

      itemsPrice += item.price * item.quantity;
    }

    // 🔥 shipping
    const shippingPrice = 0;

    // 🔥 total
    const totalPrice = itemsPrice + shippingPrice;

    // 🔥 create order
    const order = await Order.create({
      user: req.user._id,

      items: orderItems,

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

      paymentMethod,

      itemsPrice,

      shippingPrice,

      totalPrice,
    });

    // 🔥 clear cart
    cart.items = [];

    await cart.save();

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
