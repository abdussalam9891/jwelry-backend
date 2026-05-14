import mongoose from "mongoose";

const variantSchema =
  new mongoose.Schema(

    {

      /*
        ONLY USED FOR:
        rings / bracelets
      */

      size: {
        type: String,
        trim: true,
      },

      /*
        MATERIAL TYPE
      */

      material: {

        type: String,

        required: true,

        enum: [

          "18K Gold",

          "22K Gold",

          "Silver",

          "Diamond",

          "Rose Gold",

          "White Gold",

          "Platinum",

          "Gemstone",

        ],

        trim: true,

      },

      /*
        VARIANT PRICE
      */

      price: {

        type: Number,

        required: true,

        min: 0,

      },

      /*
        INVENTORY
      */

      stock: {

        type: Number,

        default: 0,

        min: 0,

      },

      /*
        AUTO GENERATED SKU
      */

      sku: {

        type: String,

        required: true,

        uppercase: true,

        trim: true,

      },

    },

    {

      _id: true,

      timestamps: true,

    }

  );


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    //  BASE PRICE (for listing)
    price: {
      type: Number,
      required: true,
       min: 0,
    },

    originalPrice: {
      type: Number,
      min: 0,

      validate: {
        validator: function (value) {
          if (value == null) return true;

          return value >= this.price;
        },

        message:
          "Original price must be greater than or equal to price",
      },
    },

    status: {
      type: String,
      enum: ["ACTIVE", "DRAFT", "ARCHIVED"],
      default: "ACTIVE",
      index: true,
    },

   category: {
  type: String,
  required: true,
  index: true,

  enum: [
    "rings",
    "earrings",
    "necklaces",
    "bracelets",
  ],
},
    subcategory: [
      {
        type: String,

        enum: [
          "engagement",
          "wedding",
          "casual",
          "luxury",
          "bridal",
          "minimal",
        ],
      },
    ],

     targetAudience: {
      type: String,

      enum: [
        "men",
        "women",
        "unisex",
        "kids",
      ],

      default: "women",

      index: true,
    },
images: {
  type: [
    {
      url: {
        type: String,
        required: true,
      },

      public_id: {
        type: String,
        required: true,
      },
    },
  ],

  default: [],

  validate: {
    validator: function (v) {
      return Array.isArray(v) && v.length > 0;
    },

    message: "At least one image is required",
  },
},

     // DESCRIPTION

    description: {
      short: {
        type: String,
        trim: true,
      },

      design: {
        type: String,
        trim: true,
      },

      details: [
        {
          type: String,
          trim: true,
        },
      ],

      styling: {
        type: String,
        trim: true,
      },
    },


    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    lowStockThreshold: {
  type: Number,
  default: 5,
   min: 0,
},

    isNewProduct: {
      type: Boolean,
      default: false,
      index: true,
    },

    //  VARIANTS (REAL SOURCE OF TRUTH)
    variants: [variantSchema],

    //  FALLBACK STOCK (only if no variants)
    stock: {
      type: Number,
      default: 0,
       min: 0,
    },
    sku: {
  type: String,
  unique: true,
  sparse: true,
   trim: true,
},
  },
  { timestamps: true },
);



productSchema.pre("save", async function (next) {

  // IF VARIANTS EXIST
  // sync stock + price automatically

  if (
    Array.isArray(this.variants) &&
    this.variants.length > 0
  ) {

    // TOTAL STOCK

    this.stock = this.variants.reduce(
      (total, variant) => {
        return total + variant.stock;
      },
      0
    );



    // LOWEST VARIANT PRICE

    this.price = Math.min(
      ...this.variants.map(
        (variant) => variant.price
      )
    );
  }


});





//  INDEXES
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
