import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
  stream: {
    type: String,
    required: true,
    trim: true
  },
  courses: {
    type: [String],   
    required: true
  },
  career_paths: {
    type: [String],   
    required: true
  }
});

const careerModel= mongoose.model("Career", careerSchema);

export default careerModel
