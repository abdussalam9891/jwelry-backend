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



      const sort =
        req.query.sort ||
        "-createdAt";



      const allowedSorts = [
        "-createdAt",
        "createdAt",
        "price",
        "-price",
        "name",
        "-name",
      ];



      const sortOption =
        allowedSorts.includes(sort)
          ? sort
          : "-createdAt";



      const category =
        req.query.category;

      const subcategory =
        req.query.subcategory;

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

      if (search) {

        query.$or = [

          {
            name: {
              $regex: search,
              $options: "i",
            },
          },

          {
            slug: {
              $regex: search,
              $options: "i",
            },
          },

          {
            sku: {
              $regex: search,
              $options: "i",
            },
          },

        ];
      }



      // CATEGORY

      if (category) {

        query.category = category;

      }



      // SUBCATEGORY

      if (subcategory) {

        query.subcategory =
          subcategory;

      }



      // MATERIAL

      if (material) {

        query[
          "variants.material"
        ] = material;

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

export const getProductStats =
  async (req, res) => {

    try {

      const products =
        await Product.find({

          status: {
            $ne: "ARCHIVED",
          },

        })

          .select(
            "category variants stock lowStockThreshold"
          )

          .lean();



      let lowStockProducts = 0;

      let outOfStockProducts = 0;



      for (const product of products) {

        const {
          totalStock,
        } =
          getInventoryData(
            product
          );



        if (
          totalStock > 0 &&
          totalStock <=
            product.lowStockThreshold
        ) {

          lowStockProducts++;

        }



        if (totalStock === 0) {

          outOfStockProducts++;

        }
      }



      const totalCategories =
        new Set(

          products.map(
            (product) =>
              product.category
          )

        ).size;



      res.json({

        totalProducts:
          products.length,

        lowStockProducts,

        outOfStockProducts,

        totalCategories,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          error.message,

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
      subcategory,
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
  price == null ||
  !category
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

      subcategory,

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

  "subcategory",

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
