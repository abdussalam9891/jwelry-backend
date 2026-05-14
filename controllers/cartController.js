import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

const MAX_CART_ITEMS = 20;

// GET cart

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: "items.product",
        select: "slug stock isActive",
      })
      .lean();

    if (!cart) {
      return res.json({
        items: [],
        summary: {
          total: 0,
          savings: 0,
          itemCount: 0,
        },
      });
    }

    // 🔥 DO NOT FILTER ITEMS
    const items = cart.items || [];

    let total = 0;
    let savings = 0;
    let itemCount = 0;

    for (const item of items) {
      const price = item.price;
      const original = item.originalPrice || price;
      const qty = item.quantity;

      total += price * qty;
      savings += (original - price) * qty;
      itemCount += qty;
    }

    // FORMAT DATA FOR FRONTEND
    const formattedItems = items.map((item) => ({
      _id: item._id,

      productId: item.product?._id,
      name: item.name,
      image: item.image,

      price: item.price,
      originalPrice: item.originalPrice,

      quantity: item.quantity,
      slug: item.product?.slug,

      variantId: item.variantId || null,
      variantDetails: item.variantDetails || null,
    }));

    // 🔥 FINAL RESPONSE
    res.json({
      items: formattedItems,
      summary: {
        total,
        savings,
        itemCount,
      },
    });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ADD to cart

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variantId } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let selectedVariant = null;

    // 🔥 HANDLE VARIANT PRODUCTS
    if (product.variants && product.variants.length > 0) {
      if (!variantId) {
        return res.status(400).json({ message: "Variant required" });
      }

      selectedVariant = product.variants.id(variantId);

      if (!selectedVariant) {
        return res.status(400).json({ message: "Invalid variant" });
      }

      if (selectedVariant.stock < 1) {
        return res.status(400).json({ message: "Variant out of stock" });
      }
    } else {
      // 🔥 NON-VARIANT PRODUCT
      if (product.stock < 1) {
        return res.status(400).json({ message: "Out of stock" });
      }
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // 🔥 FIND EXISTING ITEM (product + variant combo)
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        String(item.variantId || "") === String(variantId || ""),
    );

    const price = selectedVariant ? selectedVariant.price : product.price;
    const stock = selectedVariant ? selectedVariant.stock : product.stock;

    if (existingItem) {
      if (existingItem.quantity >= 10) {
        return res.status(400).json({ message: "Max quantity reached" });
      }

      if (existingItem.quantity + 1 > stock) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      existingItem.quantity += 1;
    } else {
      if (cart.items.length >= MAX_CART_ITEMS) {
        return res.status(400).json({
          message: "Cart is full (max 20 items)",
        });
      }

      cart.items.push({
        product: product._id,
        variantId: selectedVariant?._id || null,

        // 🔥 STORE SNAPSHOT (Fix 3)
        name: product.name,
       image:
  product.images?.[0]?.url || null,

        price,
        originalPrice: product.originalPrice || price,

        quantity: 1,

        variantDetails: selectedVariant
          ? {
              size: selectedVariant.size,
              material: selectedVariant.material,
              sku: selectedVariant.sku,
            }
          : null,
      });
    }

    await cart.save();

    res.json({
      message: "Added to cart",
      cart,
    });
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// REMOVE from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { _id: itemId } } },
    );

    res.json({ message: "Removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE quantity


export const updateQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);

    // 🔥 validation
    const MAX_CART_QTY = 3;

    if (isNaN(qty) || qty < 1 || qty > MAX_CART_QTY) {
      return res.status(400).json({
        message: `Maximum ${MAX_CART_QTY} quantity allowed per item`,
      });
    }

    // 🔥 find cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // 🔥 find cart item
    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // 🔥 fetch full product
    const product = await Product.findById(item.product);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let availableStock = product.stock;

    // 🔥 variant stock handling
    if (item.variantId) {
      const variant = product.variants.id(item.variantId);

      if (!variant) {
        return res.status(400).json({
          message: "Variant not found",
        });
      }

      availableStock = variant.stock;
    }

    // 🔥 stock validation
    if (availableStock < qty) {
      return res.status(400).json({
        message: `Only ${availableStock} item(s) available`,
      });
    }

    // 🔥 update quantity
    item.quantity = qty;

    await cart.save();

    res.json({
      message: "Quantity updated",
      item: {
        _id: item._id,
        quantity: item.quantity,
      },
    });
  } catch (err) {
    console.error("UPDATE QUANTITY ERROR:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// CLEAR cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } },
      { new: true },
    ).lean();

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({
      message: "Cart cleared",
      items: [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const cleanCart = async (userId) => {
  await Cart.updateOne(
    { user: userId },
    {
      $pull: { items: { product: null } },
    },
  );
};
