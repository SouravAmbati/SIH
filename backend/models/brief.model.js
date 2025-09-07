import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
    trim: true
  },
  overview: {
    type: String,
    required: true,
    trim: true
  },
  career_paths: {
    type: [String],   
    required: true
  },
  related_skills: {
    type: [String],   
    required: true
  }
});

const courseModel = mongoose.model("Course", courseSchema);

export default courseModel;
