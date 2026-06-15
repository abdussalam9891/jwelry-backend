import mongoose from "mongoose";

import Product from "../../models/productModel.js";
import {
  getInventoryData,
} from "../../utils/admin/productInventory.js";
import cloudinary from "../../config/cloudinary.js";

// GET ADMIN PRODUCTS
export const getAdminProducts =
  async (req, res) => {

    try {

      const page =
        Number(req.query.page) || 1;

      const limit =
        Math.min(
          Number(req.query.limit) || 10,
          50
        );

      const skip =
        (page - 1) * limit;



      const search =
        req.query.search || "";





        let sortOption = {
  createdAt: -1,
};





switch (req.query.sort) {
 case "price_asc":
  sortOption = {
    price: 1,
    _id: 1,
  };
  break;

case "price_desc":
  sortOption = {
    price: -1,
    _id: -1,
  };
  break;

case "highest_rated":
  sortOption = {
    averageRating: -1,
    numReviews: -1,
  };
  break;

case "best_selling":
  sortOption = {
    soldCount: -1,
    averageRating: -1,
  };
  break;

  case "name_asc":
    sortOption = {
      name: 1,
    };
    break;

  case "name_desc":
    sortOption = {
      name: -1,
    };
    break;

  default:
    sortOption = {
      createdAt: -1,
    };
}






      const category =
        req.query.category;

       const productType =
  req.query.productType;

const targetAudience =
  req.query.targetAudience;

const style =
  req.query.style;

      const material =
        req.query.material;

      const status =
        req.query.status;



      // QUERY OBJECT

      const query = {};



      // STATUS

      if (status) {

        query.status = status;

      }



      

   // SEARCH

if (
  typeof search === "string" &&
  search.trim()
) {
  const keywords =
    search
      .trim()
      .split(/\s+/);

  query.$and = keywords.map(
    (word) => ({
      $or: [
        {
          name: {
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

        {
          slug: {
            $regex: word,
            $options: "i",
          },
        },

        {
          sku: {
            $regex: word,
            $options: "i",
          },
        },
      ],
    })
  );
}



      // CATEGORY

      if (category) {

        query.category = category;

      }





    if (productType) {
  query.productType =
    productType;
}

if (targetAudience) {
  query.targetAudience =
    targetAudience;
}

if (style) {
  query.styles = style;
}





      // TOTAL

      const totalProducts =
        await Product.countDocuments(
          query
        );



      const totalPages =
        Math.ceil(
          totalProducts / limit
        );



      // PRODUCTS

     const products =
  await Product.find(query)

    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .lean();



      // INVENTORY

      const formattedProducts =
        products.map(
          (product) => {

            const inventory =
              getInventoryData(
                product
              );

            return {

              ...product,

              ...inventory,

            };

          }
        );



      // RESPONSE

      res.json({

        products:
          formattedProducts,

        pagination: {

          totalProducts,

          totalPages,

          currentPage:
            page,

          limit,

        },

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

export const getProductStats = async (req, res) => {
  try {
    const products = await Product.find({
      status: { $ne: "ARCHIVED" },
    })
      .select(
        `
        category
        productType
        variants
        stock
        lowStockThreshold
        soldCount
        averageRating
      `
      )
      .lean();

    let lowStockProducts = 0;
    let outOfStockProducts = 0;

    const categories = new Set();
    const productTypes = new Set();

    let totalRating = 0;

    for (const product of products) {
      // Unique categories
      if (product.category) {
        categories.add(product.category);
      }

      // Unique product types
      if (product.productType) {
        productTypes.add(product.productType);
      }

      // Inventory stats
      const { totalStock } =
        getInventoryData(product);

      if (
        totalStock > 0 &&
        totalStock <= product.lowStockThreshold
      ) {
        lowStockProducts++;
      }

      if (totalStock === 0) {
        outOfStockProducts++;
      }

      totalRating +=
        product.averageRating || 0;
    }

    const totalProducts =
      products.length;

    const inStockProducts =
      totalProducts -
      outOfStockProducts;

    const bestSellerProducts =
      products.filter(
        (product) =>
          product.soldCount > 0
      ).length;

    const averageStoreRating =
      totalProducts > 0
        ? Number(
            (
              totalRating /
              totalProducts
            ).toFixed(1)
          )
        : 0;

    res.json({
      totalProducts,

      totalCategories:
        categories.size,

      totalProductTypes:
        productTypes.size,

      inStockProducts,

      lowStockProducts,

      outOfStockProducts,

      bestSellerProducts,

      averageStoreRating,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};












// CREATE PRODUCT

export const createProduct = async (req, res) => {

  try {

   const {
  name,
  slug,
  price,
  originalPrice,

  category,
  productType,
  styles,

  searchTags,

  targetAudience,

  description,
  variants,
  stock,
  status,

  isBestSeller,
  isNewProduct,

  lowStockThreshold,
  images,
} = req.body;



    // REQUIRED VALIDATION

   if (
  !name ||
  !slug ||

  !category ||
  !productType
) {

      return res.status(400).json({
        message: "Missing required fields",
      });

    }



    if (
  !Array.isArray(images) ||
  images.length === 0
) {

  return res.status(400).json({
    message: "At least one image is required",
  });

}



    // UNIQUE SLUG

    const existingProduct =
      await Product.findOne({ slug });

    if (existingProduct) {

      return res.status(400).json({
        message: "Slug already exists",
      });

    }







    // SKU

    const sku = `SKU-${Date.now()}`;



    // CREATE PRODUCT

  const product = await Product.create({
  name,

  slug,

  price,

  originalPrice:
    originalPrice || 0,

  category,

  productType,

  styles:
    styles || [],



  searchTags:
    searchTags || [],

  targetAudience:
    targetAudience || "women",

  images,

  description: {
    short:
      description?.short || "",

    design:
      description?.design || "",

    details:
      description?.details || [],

    styling:
      description?.styling || "",
  },

  variants:
    variants || [],

  stock:
    stock || 0,

  status:
    status || "ACTIVE",

  isBestSeller:
    isBestSeller || false,

  isNewProduct:
    isNewProduct || false,

  lowStockThreshold:
    lowStockThreshold || 5,

  soldCount: 0,

  averageRating: 0,

  numReviews: 0,

  sku,
});



    res.status(201).json({

      success: true,

      message:
        "Product created successfully",

      product,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
};







export const archiveProduct =
  async (req, res) => {

    try {

      const { id } =
        req.params;



      // VALIDATE ID

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {

        return res.status(404).json({

          message:
            "Product not found",

        });

      }



      const product =
        await Product.findById(id);



      if (!product) {

        return res.status(404).json({

          message:
            "Product not found",

        });

      }



      // TOGGLE STATUS

      product.status =

        product.status ===
        "ARCHIVED"

          ? "ACTIVE"

          : "ARCHIVED";



      await product.save();



      res.json({

        success: true,

        message:

          product.status ===
          "ARCHIVED"

            ? "Product archived successfully"

            : "Product restored successfully",

        status:
          product.status,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

  };



// UPDATE PRODUCT

export const updateProduct =
  async (req, res) => {

    try {

      const { id } =
        req.params;



      // VALIDATE ID

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {

        return res.status(404).json({
          message: "Product not found",
        });

      }



      // FIND PRODUCT

      const product =
        await Product.findById(id);



      if (!product) {

        return res.status(404).json({
          message: "Product not found",
        });

      }



      // SLUG CHECK

      if (
        req.body.slug &&
        req.body.slug !== product.slug
      ) {

        const existingSlug =
          await Product.findOne({
            slug: req.body.slug,
            _id: { $ne: id },
          });

        if (existingSlug) {

          return res.status(400).json({
            message:
              "Slug already exists",
          });

        }
      }







      // UPDATE FIELDS

const allowedFields = [
  "name",

  "slug",

  "price",

  "originalPrice",

  "category",

  "productType",

  "styles",



  "searchTags",

  "targetAudience",

  "description",

  "variants",

  "stock",

  "status",

  "isBestSeller",

  "isNewProduct",

  "lowStockThreshold",

  "images",
];



      for (const field of allowedFields) {

        if (
          req.body[field] !== undefined
        ) {

          product[field] =
            req.body[field];

        }
      }



      // SAVE

      await product.save();



      res.json({

        success: true,

        message:
          "Product updated successfully",

        product,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });

    }

  };






  export const deleteProduct =
  async (req, res) => {

    try {

      const { id } =
        req.params;



      // VALIDATE ID

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {

        return res.status(404).json({

          message:
            "Product not found",

        });

      }



      // FIND PRODUCT

      const product =

        await Product.findById(id);



      if (!product) {

        return res.status(404).json({

          message:
            "Product not found",

        });

      }



      // DELETE PRODUCT

      await product.deleteOne();



      res.json({

        success: true,

        message:
          "Product deleted successfully",

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

  };
