import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: String,
  text: String,
  from: String,
  link: String,
  forWho: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  status: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Notification", NotificationSchema);
