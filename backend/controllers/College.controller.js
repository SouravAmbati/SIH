import { getCollegeDetails, getColleges } from "../configs/gemini.js"
import CollegeListModel from "../models/college.model.js";
import College from "../models/college_detail.model.js";

export const GetColleges = async (req, res) => {
  try {
    const { location, degree_type } = req.body;

    if (!location || !degree_type) {
      return res
        .status(400)
        .json({ success: false, message: "Location and degree_type are required" });
    }
    const result = await getColleges(location, degree_type);

    if (result?.location && result?.degree_type && Array.isArray(result.colleges)) {
      const data = await CollegeListModel.create({
        location: result.location,
        degree_type: result.degree_type,
        colleges: result.colleges,
      });

      return res.json({ success: true, data });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Invalid data format from service" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

export const CollegeDetails = async (req, res) => {
  try {
    const { collegename } = req.body;

    // Assuming getCollegeDetails fetches the full college JSON based on name
    const collegeData = await getCollegeDetails(collegename);

    if (!collegeData) {
      return res.status(404).json({ message: "College not found" });
    }

    const newCollege = new College({
      college_name: collegeData.college_name,
      courses_offered: collegeData.courses_offered,
      facilities: collegeData.facilities,
      email: collegeData.email,
      website: collegeData.website,
      phone_number: collegeData.phone_number,
      address: collegeData.address
    });

    const savedCollege = await newCollege.save();

    res.status(201).json({ success: true, data: savedCollege });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};