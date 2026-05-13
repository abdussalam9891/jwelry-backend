import Product from "../../models/productModel.js";
import {
  getInventoryData,
} from "../../utils/admin/productInventory.js";

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

      const category =
        req.query.category;

        const subcategory =
  req.query.subcategory;

const material =
  req.query.material;


      const query = {};

      /* SEARCH */

      if (search) {

        query.name = {

          $regex: search,

          $options: "i",

        };

      }

      /* CATEGORY */

      if (category) {

        query.category =
          category;

      }

      /* SUBCATEGORY */

if (subcategory) {

  query.subcategory =
    subcategory;

}

/* MATERIAL */

if (material) {

  query[
    "variants.material"
  ] = material;

}



      /* TOTAL */

      const totalProducts =
        await Product.countDocuments(
          query
        );

      const totalPages =
        Math.ceil(
          totalProducts / limit
        );

      /* PRODUCTS */

      const products =
        await Product.find(query)

          .sort(sort)

          .skip(skip)

          .limit(limit)

          .lean();

      /* INVENTORY */

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

      /* RESPONSE */

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
        await Product.find();

      /* TOTAL */

      const totalProducts =
        products.length;

      /* LOW STOCK */

      const lowStockProducts =
        products.filter(
          (product) => {

            const {
              totalStock,
            } =
              getInventoryData(
                product
              );

            return (

              totalStock > 0 &&

              totalStock <=
                product.lowStockThreshold

            );

          }
        ).length;

      /* OUT OF STOCK */

      const outOfStockProducts =
        products.filter(
          (product) => {

            const {
              totalStock,
            } =
              getInventoryData(
                product
              );

            return (
              totalStock === 0
            );

          }
        ).length;

      /* CATEGORIES */

      const totalCategories =
        new Set(

          products.map(
            (product) =>
              product.category
          )

        ).size;

      /* RESPONSE */

      res.json({

        totalProducts,

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


export const createProduct =
  async (req, res) => {

    try {

      const {

        name,

        slug,

        price,

        originalPrice,

        category,

        subcategory,

        gender,

        images,

        description,

        variants,

        stock,

        status,

        isBestSeller,

        isNewProduct,

        lowStockThreshold,

      } = req.body;

      /* REQUIRED VALIDATION */

      if (

        !name ||

        !slug ||

        !price ||

        !category ||

        !subcategory

      ) {

        return res.status(400).json({

          message:
            "Missing required fields",

        });

      }

      /* UNIQUE SLUG */

      const existingProduct =
        await Product.findOne({
          slug,
        });

      if (existingProduct) {

        return res.status(400).json({

          message:
            "Slug already exists",

        });

      }

      /* SKU */

      const sku =
        `SKU-${Date.now()}`;

      /* CREATE PRODUCT */

      const product =
        await Product.create({

          name,

          slug,

          price,

          originalPrice:
            originalPrice || 0,

          category,

          subcategory,

          gender:
            gender || "her",

          images:
            images || [],

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

      /* RESPONSE */

      res.status(201).json({

        success: true,

        message:
          "Product created successfully",

        product,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

  };



export const archiveProduct =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const product =
        await Product.findById(id);

      if (!product) {

        return res.status(404).json({

          message:
            "Product not found",

        });

      }

      /*
        TOGGLE STATUS
      */

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
