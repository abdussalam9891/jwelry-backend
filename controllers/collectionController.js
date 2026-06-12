// import Collection from "../models/collectionModel.js";
// import Product from "../models/productModel.js";

// export const getCollections =
//   async (req, res) => {

//     try {

//       const collections =
//         await Collection.find({

//           isActive: true,

//         })

//           .sort({
//             sortOrder: 1,
//             createdAt: -1,
//           })

//           .lean();

//       res.json({
//         success: true,
//         collections,
//       });

//     } catch (error) {

//       console.error(error);

//       res.status(500).json({
//         message: error.message,
//       });

//     }

//   };

// export const getCollectionBySlug =
//   async (req, res) => {

//     try {

//       const collection =
//         await Collection.findOne({

//           slug:
//             req.params.slug,

//           isActive: true,

//         }).lean();

//       if (!collection) {

//         return res.status(404).json({
//           message:
//             "Collection not found",
//         });

//       }

//       const products =
//         await Product.find({

//           status: "ACTIVE",

//           collections:
//             collection._id,

//         })

//           .select(
//             "name price originalPrice images slug isBestSeller isNewProduct"
//           )

//           .sort({
//             createdAt: -1,
//           })

//           .lean();

//       res.json({

//         success: true,

//         collection,

//         products,

//       });

//     } catch (error) {

//       console.error(error);

//       res.status(500).json({
//         message: error.message,
//       });

//     }

//   };
