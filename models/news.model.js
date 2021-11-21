import mongoose from "mongoose";

import User from "./user.model.js";

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  photo: {
    data: Buffer,
    contentType: String,
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  editor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  employees: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  applications: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  subscribers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  subscriberLength: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

NewsSchema.pre("remove", async function (next) {
  try {
    await User.updateMany(
      { news: this._id },
      { $unset: { news: 1 } },
      { multi: true }
    );
    return next();
  } catch (err) {
    return next(err);
  }
});

export default mongoose.model("News", NewsSchema);
