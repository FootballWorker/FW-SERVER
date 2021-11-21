import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    uppercase: true,
    required: true,
    unique: [true, "The department is already exist!"],
  },
  aboutOne:String,
  aboutTwo:String,
  aboutThree:String,
  views: {
    type: Number,
    default: 0
  }
  },{
  timestamps: true
});

export default mongoose.model("Department", DepartmentSchema);
