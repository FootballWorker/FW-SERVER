import mongoose from 'mongoose'


const AttributeSchema = new mongoose.Schema(
  {
    recordedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    player: {
      type: mongoose.Schema.ObjectId,
      ref: "Player",
    },
    point: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Technical",
        "Mental",
        "Physical",
      ],
      required: [true, "You have to select category!"],
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("Attribute",AttributeSchema)