// import mongoose from "mongoose";

// const collectionSchema =
//   new mongoose.Schema(
//     {
//       name: {
//         type: String,
//         required: true,
//         trim: true,
//         unique: true,
//       },

//       slug: {
//         type: String,
//         required: true,
//         trim: true,
//         unique: true,
//         lowercase: true,
//       },

//       description: {
//         type: String,
//         default: "",
//         trim: true,
//       },

//       bannerImage: {
//         url: {
//           type: String,
//           default: "",
//         },

//         public_id: {
//           type: String,
//           default: "",
//         },
//       },

//       isFeatured: {
//         type: Boolean,
//         default: false,
//         index: true,
//       },

//       isActive: {
//         type: Boolean,
//         default: true,
//         index: true,
//       },

//       sortOrder: {
//         type: Number,
//         default: 0,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// collectionSchema.index({
//   sortOrder: 1,
// });

// const Collection =
//   mongoose.models.Collection ||
//   mongoose.model(
//     "Collection",
//     collectionSchema
//   );

// export default Collection;
