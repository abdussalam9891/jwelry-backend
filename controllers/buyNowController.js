import Product from "../models/productModel.js";
import { getPurchasableProduct } from "../utils/productPurchase.js";
import { processCheckout } from "../service/order/orderWorkflowService.js";
import { getAddress } from "../service/order/addressService.js";

export const createBuyNowPreview = async (req, res) => {
  try {
    const preview = await getPurchasableProduct({
      productId: req.body.productId,
      variantId: req.body.variantId,
      quantity: req.body.quantity || 1,
    });

   res.json({
  mode: "BUY_NOW",
  item: preview.item,
  summary: preview.summary,
});
  } catch (err) {
    console.error("BUY NOW PREVIEW ERROR:", err);

    const clientErrors = [
      "Product is required",
      "Product not found",
      "Variant required",
      "Invalid variant",
      "Invalid quantity",
    ];

    if (
      clientErrors.includes(err.message) ||
      err.message.includes("Only")
    ) {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};





export const createBuyNowOrder = async (req, res) => {
  try {
    const {
      productId,
      variantId,
      quantity,
      addressId,
      paymentMethod,
      couponCode,
    } = req.body;

    const checkoutContext = {
      user: req.user,
      paymentMethod,
      couponCode,

      buyNow: {
        productId,
        variantId,
        quantity,
      },
    };

    checkoutContext.address = await getAddress({
      userId: req.user._id,
      addressId,
    });

    const response = await processCheckout(checkoutContext);

    return res.status(201).json({
      success: true,
      ...response,
    });

  } catch (error) {

    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "Server Error",
    });

  }
};
