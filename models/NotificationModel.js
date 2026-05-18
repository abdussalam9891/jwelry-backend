import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(

    {

      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },


      type: {

        type: String,

        enum: [

          "order",

          "inventory",

          "customer",

          "system",

        ],

        required: true,

      },


      title: {

        type: String,

        required: true,

      },


      message: {

        type: String,

        required: true,

      },


      link: {

        type: String,

        default: null,

      },


      read: {

        type: Boolean,

        default: false,

      },


      metadata: {

        type: Object,

        default: {},

      },

    },

    {

      timestamps: true,

    }

  );

const Notification =
  mongoose.model(
    "Notification",
    notificationSchema
  );

export default Notification;
