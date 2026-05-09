import Product from "../../models/productModel.js";

// GET ADMIN PRODUCTS
export const getAdminProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const sort = req.query.sort || "-createdAt";
    const category = req.query.category;

    const query = {};

    if (search) {
  query.name = {
    $regex: search,
    $options: "i",
  };
}


if (category) {
  query.category = category;
}


    const totalProducts = await Product.countDocuments(query);

    const totalPages = Math.ceil(totalProducts / limit);



    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      products,

      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit,
      },
    });
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
