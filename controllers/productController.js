import Product from "../models/productModel.js";


// 🔥 GET PRODUCTS (FILTER + PAGINATION + SORT)
const getProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,   // 🔥 NEW
      gender,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, parseInt(limit, 10) || 12); // cap limit
    const skip = (pageNum - 1) * limitNum;

    let query = {};

    // 🔥 FILTERS
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory; // 🔥 IMPORTANT
    if (gender) query.gender = gender;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }


       // 🔥 SEARCH
// 🔥 SEARCH (safe)
if (typeof search === "string" && search.trim().length > 0) {
  const keywords = search.trim().split(/\s+/).filter(Boolean);

  if (keywords.length > 0) {
    const andConditions = keywords.map(word => ({
      $or: [
        { name: { $regex: word, $options: "i" } },
        { description: { $regex: word, $options: "i" } },
        { subcategory: { $regex: word, $options: "i" } },
        { category: { $regex: word, $options: "i" } },
      ],
    }));

    // if you already have other $and conditions, merge instead of overwrite
    if (query.$and) {
      query.$and = query.$and.concat(andConditions);
    } else {
      query.$and = andConditions;
    }
  }
}

    // 🔥 SORT (with fallback for stability)
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === "price_asc") sortOption = { price: 1, _id: 1 };
    if (sort === "price_desc") sortOption = { price: -1, _id: -1 };
    if (sort === "newest") sortOption = { createdAt: -1, _id: -1 };

    // 🔥 QUERY
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(), // slight perf gain
      Product.countDocuments(query),



    ]);

    res.json({
      products,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔥 GET SINGLE PRODUCT (SLUG BASED)
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔥 CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    if (!req.body.images || !req.body.images.length) {
      return res.status(400).json({ message: "Images required" });
    }

    const product = new Product(req.body);
    const createdProduct = await product.save();

    res.status(201).json(createdProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔥 UPDATE PRODUCT (SMART UPDATE)
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔥 DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
