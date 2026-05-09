import Product from "../../models/productModel.js";

// GET ADMIN PRODUCTS
export const getAdminProducts = async (req, res) => {
  try {

    const products = await Product.find()
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  res.json({
    message: "Create product admin route",
  });
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  res.json({
    message: "Update product admin route",
  });
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  res.json({
    message: "Delete product admin route",
  });
};
