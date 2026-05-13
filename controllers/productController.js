import Product from "../models/productModel.js";

// GET PRODUCTS (FILTER + PAGINATION + SORT)
const getProducts = async (req, res) => {
  try {
    const {
      category,

      subcategory,

      material,

      gender,

      minPrice,

      maxPrice,

      sort,

      page = 1,

      limit = 12,

      tag,

      search,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    // 🔥 BUILD CONDITIONS CLEANLY
    const conditions = [];

    // basic filters
    if (category) conditions.push({ category });
    if (subcategory) conditions.push({ subcategory });

    if (material) {
      conditions.push({
        "variants.material": material,
      });
    }

    if (gender) conditions.push({ gender });

    // price filter
    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      conditions.push({ price: priceQuery });
    }

    // 🔥 TAG FILTER (FIXED)
    if (tag === "trending") {
      conditions.push({ isBestSeller: true });
    }

    if (tag === "new") {
      conditions.push({ isNewProduct: true });
    }

    // 🔥 SEARCH
    if (typeof search === "string" && search.trim()) {
      const keywords = search.trim().split(/\s+/);

      keywords.forEach((word) => {
        conditions.push({
          $or: [
            { name: { $regex: word, $options: "i" } },
            {
  "description.short": {

    $regex: word,

    $options: "i",

  },
},
            { subcategory: { $regex: word, $options: "i" } },
            { category: { $regex: word, $options: "i" } },
            {
              "variants.material": {
                $regex: word,

                $options: "i",
              },
            },
          ],
        });
      });
    }

    // 🔥 FINAL QUERY
    const query = conditions.length ? { $and: conditions } : {};

    // 🔥 SORTING
    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1, _id: 1 };
    if (sort === "price_desc") sortOption = { price: -1, _id: -1 };
    if (sort === "newest") sortOption = { createdAt: -1, _id: -1 };

    // 🔥 EXECUTE
    const [products, total] = await Promise.all([
      Product.find(query)
        .select(
          "name price originalPrice images slug isBestSeller isNewProduct",
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Product.countDocuments(query),
    ]);

    res.json({
      products,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE PRODUCT (SLUG BASED)
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      subcategory,
      gender,
      images,
      description,
      stock,
      slug,
      isBestSeller,
      isNewProduct,
    } = req.body;

    if (!images || !images.length) {
      return res.status(400).json({ message: "Images required" });
    }

    const product = new Product({
      name,
      price,
      originalPrice,
      category,
      subcategory,
      gender,
      images,
      description,
      stock,
      slug,
      isBestSeller,
      isNewProduct,
    });

    const created = await product.save();
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      subcategory,
      gender,
      images,
      description,
      stock,
      slug,
      isBestSeller,
      isNewProduct,
      variants,
    } = req.body;

    const allowedFields = {
      name,
      price,
      originalPrice,
      category,
      subcategory,
      gender,
      images,
      description,
      stock,
      slug,
      isBestSeller,
      isNewProduct,
      variants,
    };

    const updateData = Object.fromEntries(
      Object.entries(allowedFields).filter(([_, v]) => v !== undefined),
    );

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    Object.assign(product, updateData);

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct,
};
