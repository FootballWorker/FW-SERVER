import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  textOne: {
    type: String,
    required: true,
  },
  imageOne: {
    data: Buffer,
    contentType: String,
  },
  textTwo: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: "Department",
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: "Job"
  },
  match: {
    type: mongoose.Schema.ObjectId,
    ref: "Match"
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: "Team",
  },
  player: {
    type: mongoose.Schema.ObjectId,
    ref: "Player",
  },
  news:{
    type: mongoose.Schema.ObjectId,
    ref: 'News'
  },
  pinned: {
    type: Boolean,
    default: false
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
  views:  {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.model('Post',PostSchema)