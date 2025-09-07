import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  courses_offered: {
    type: [String],
    required: true,
  },
  facilities: {
    type: [String],
    required: true,
  },
  cutoff: {
    type: String,
    required: true,
  },
});

const collegeListSchema = new mongoose.Schema({
  location: {
    type: String, // keeping as string so ZIPs like "083100" won’t lose leading zeros
    required: true,
    trim: true,
  },
  degree_type: {
    type: String,
    required: true,
    trim: true,
  },
  colleges: {
    type: [collegeSchema],
    required: true,
  },
});

const CollegeListModel = mongoose.model("CollegeList", collegeListSchema);

export default CollegeListModel;
