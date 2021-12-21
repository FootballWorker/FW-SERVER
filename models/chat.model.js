import mongoose from 'mongoose'


const ChatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    readBy:[{ type: mongoose.Schema.ObjectId, ref: "User" }],
    groupAdmin: { type: mongoose.Schema.ObjectId, ref: "User" },
    messages : [
      {
        sender : {type : mongoose.Schema.ObjectId, ref:'User'},
        text : String,
        date : {
          type: Date,
          default : Date.now
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Chat',ChatSchema)