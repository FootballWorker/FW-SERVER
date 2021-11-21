import mongoose from 'mongoose'


const JobSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.ObjectId,
      ref: "Department",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: [true, "The job is already exist!"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Job',JobSchema)