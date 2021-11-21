import mongoose from 'mongoose'

import Player from './player.model.js'


const PositionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

PositionSchema.pre("remove", async function (next) {
  try {
    await Player.updateMany(
      { position: this._id },
      { $unset: { position: 1 } },
      { multi: true }
    );
    return next();
  } catch (err) {
    return next(err);
  }
});

export default mongoose.model('Position',PositionSchema)