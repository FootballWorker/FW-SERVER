import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  title: String,
  textOne: {
    type: String,
    required: true,
  },
  imageOne: {
    data: Buffer,
    contentType: String,
  },
  adherence: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
  },
  commentedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  department : {
    type: mongoose.Schema.ObjectId,
    ref: 'Department'
  },
  job : {
    type: mongoose.Schema.ObjectId,
    ref: 'Job'
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  likeLength: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  },
});


export default mongoose.model("Comment", CommentSchema);
