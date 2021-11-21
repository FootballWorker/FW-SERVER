import mongoose from 'mongoose'

import Team from './../models/team.model.js'


const PollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: "Team",
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  options: [
    {
      option: 
        {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
      votes: {
        type: Number,
        default: 0,
      },
    },
  ],
  voted: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  pollStart: {
    type: Date,
    default: Date.now,
  },
  pollEnd: {
    type: Date,
    required: [true,"Poll end time is required"],
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date
});


PollSchema.pre("remove", async function (next) {
  try {
    const team = await Team.findById(this.team);
    team.polls = team.polls.filter(
      (poll) => poll._id.toString() !== this._id.toString()
    );
    await team.save();
    return next();
  } catch (err) {
    return next(err);
  }
});

export default mongoose.model('Poll',PollSchema)