import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    link: {
      type: String,
      default: "",
      trim: true,
    },

    type: {
      type: String,
     enum: [
  "info",
  "success",
  "warning",
  "offer",
],
      default: "info",
    },

    status: {
      type: String,
      enum: [
        "draft",
        "scheduled",
        "active",
        "expired",
        "archived",
      ],
      default: "draft",
      index: true,
    },

    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 100,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deletedAt: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({
  title: "text",
  message: "text",
});

announcementSchema.index({
  status: 1,
  priority: -1,
});

announcementSchema.index({
  startDate: 1,
  endDate: 1,
});

export default mongoose.model(
  "Announcement",
  announcementSchema
);
