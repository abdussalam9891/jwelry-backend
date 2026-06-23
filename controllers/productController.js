import Product from "../models/productModel.js";

// GET PRODUCTS (FILTER + PAGINATION + SORT)
const getProducts = async (req, res) => {
  try {
   const {
  category,
  productType,
style,
  material,
  targetAudience,
  minPrice,
  maxPrice,
  sort,
  page = 1,
  limit = 12,
  tag,
  search,
  inStock,
} = req.query;

   const pageNum = Math.max(
  1,
  parseInt(page, 10) || 1
);

const limitNum = Math.min(
  50,
  parseInt(limit, 10) || 12
);

const skip =
  (pageNum - 1) * limitNum;

/* CONDITIONS */

const conditions = [
  {
    status: "ACTIVE",
  },
];

/* CATEGORY */

if (category) {
  conditions.push({
    category,
  });
}

/* PRODUCT TYPE */

if (productType) {
  conditions.push({
    productType,
  });
}

/* STYLE */

if (style) {
  conditions.push({
    styles: style,
  });
}

/* MATERIAL */

if (material) {
  conditions.push({
    "variants.material":
      material,
  });
}

/* TARGET AUDIENCE */

if (targetAudience) {
  conditions.push({
    targetAudience,
  });
}

/* IN STOCK */

if (inStock === "true") {
  conditions.push({
    stock: {
      $gt: 0,
    },
  });
}

/* PRICE RANGE */

if (
  minPrice ||
  maxPrice
) {
  const priceQuery = {};

  if (minPrice) {
    priceQuery.$gte =
      Number(minPrice);
  }

  if (maxPrice) {
    priceQuery.$lte =
      Number(maxPrice);
  }

  conditions.push({
    price: priceQuery,
  });
}

/* TAGS */

if (tag === "trending") {
  conditions.push({
    isBestSeller: true,
  });
}

if (tag === "new") {
  conditions.push({
    isNewProduct: true,
  });
}

/* SEARCH */

if (
  typeof search === "string" &&
  search.trim()
) {
  const keywords =
    search
      .trim()
      .split(/\s+/);

  keywords.forEach(
    (word) => {
      conditions.push({
        $or: [
          {
            name: {
              $regex: word,
              $options: "i",
            },
          },

          {
            "description.short": {
              $regex: word,
              $options: "i",
            },
          },

          {
            category: {
              $regex: word,
              $options: "i",
            },
          },

          {
            productType: {
              $regex: word,
              $options: "i",
            },
          },

          {
            styles: {
              $regex: word,
              $options: "i",
            },
          },

          {
            searchTags: {
              $regex: word,
              $options: "i",
            },
          },

          {
            "variants.material": {
              $regex: word,
              $options: "i",
            },
          },
        ],
      });
    }
  );
}

/* FINAL QUERY */

const query = {
  $and: conditions,
};



    // SORTING
   let sortOption = {
  createdAt: -1,
};

if (sort === "price_asc") {
  sortOption = {
    price: 1,
    _id: 1,
  };
}

if (sort === "price_desc") {
  sortOption = {
    price: -1,
    _id: -1,
  };
}

if (sort === "newest") {
  sortOption = {
    createdAt: -1,
    _id: -1,
  };
}

if (sort === "highest_rated") {
  sortOption = {
    averageRating: -1,
    numReviews: -1,
  };
}

if (sort === "best_selling") {
  sortOption = {
    soldCount: -1,
    averageRating: -1,
  };
}

if (sort === "featured") {
  sortOption = {
    isBestSeller: -1,
    averageRating: -1,
    createdAt: -1,
  };
}


    // EXECUTE
    const [products, total] = await Promise.all([
      Product.find(query)
 .select(`
  name
  price
  originalPrice
  images
  slug
  category
  productType
  averageRating
  numReviews
  isBestSeller
  isNewProduct
`)
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
   const product = await Product.findOne({
  _id: req.params.id,
  status: "ACTIVE",
})

.lean();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET SINGLE PRODUCT (SLUG BASED)
const getProductBySlug = async (req, res) => {
  try {
   const product = await Product.findOne({
  slug: req.params.slug,
  status: "ACTIVE",
})

.lean();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};



export const getSearchSuggestions =
  async (req, res) => {
    try {
      const q =
        req.query.q?.trim();

      if (!q) {
        return res.json([]);
      }

      const escapedQ =
        q.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

      const suggestions =
        await Product.find({
          status: "ACTIVE",

          name: {
            $regex: `\\b${escapedQ}`,
            $options: "i",
          },
        })
          .select(
            "name slug"
          )
          .limit(8)
          .lean();

      res.json(
        suggestions
      );
    } catch (error) {
      console.error(
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch suggestions",
      });
    }
  };

export { getProductById, getProductBySlug, getProducts };
