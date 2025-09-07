import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    course_name: { type: String, required: true },
    duration: { type: String, required: true },
    motive: { type: String, required: true },
    eligibility: { type: String, required: true },
    cutoff: { type: String, required: true }
});

const collegeSchema = new mongoose.Schema({
    college_name: { type: String, required: true },
    courses_offered: { type: [courseSchema], required: true },
    facilities: { type: [String], required: true },
    email: { type: String, required: true },
    website: { type: String, required: true },
    phone_number: { type: String, required: true },
    address: { type: String, required: true }
});

const College = mongoose.model("College", collegeSchema);

export default College;
