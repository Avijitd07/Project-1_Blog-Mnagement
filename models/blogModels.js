const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    authorId: {
      type: ObjectId,
      ref: "Author",
    },
    body: {
      type:mongoose.SchemaTypes.Mixed,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    subcategory: {
      type: [String],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt:Date,
    publishedAt: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
/*********************************CREATE CONNECATION BLOG***************************************/
module.exports = mongoose.model("Blog", blogSchema);
