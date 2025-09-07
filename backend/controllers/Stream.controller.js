import { analyzeQuiz, CareerBrief, CareerOptions, DreamAnalyzer, getQuiz } from "../configs/gemini.js";
import analyzerModel from "../models/analyzer.model.js";
import courseModel from "../models/brief.model.js";
import careerModel from "../models/careerOptions.model.js";
import streamModel from "../models/stream.model.js";
; // import your schema

export const getQuizQuestions = async (req, res) => {
  try {
    const response = await getQuiz();
    const newQuiz = new streamModel({
      questions: response.questions,
    });
    await newQuiz.save();
    res.json({ success: true, data: newQuiz });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// export const analyzeAnswers=async(req,res)=>{
//    try {
//     let userAnswers = req.body.answers;
//     if (!Array.isArray(userAnswers)) {
//       return res.status(400).json({ success: false, message: "Invalid answers format" });
//     }
//     userAnswers = userAnswers.filter(ans => typeof ans === "string" && ans.trim() !== "");
//     const result = await analyzeQuiz(userAnswers);
//     res.json({ success: true, data: result });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// }

export const analyzeAnswers = async (req, res) => {
  try {
    let userAnswers = req.body.answers;
    if (!Array.isArray(userAnswers)) {
      return res.status(400).json({ success: false, message: "Invalid answers format" });
    }
    userAnswers = userAnswers.filter(ans => typeof ans === "string" && ans.trim() !== "");
    const result = await analyzeQuiz(userAnswers);
    const streams = Array.isArray(result?.streamSummary)
      ? result.streamSummary
          .map(item => (item && typeof item.stream === "string" ? item.stream : null))
          .filter(Boolean)
      : [];

    if (streams.length > 0) {
      const uniqueStreams = [...new Set(streams)];
      const data=await analyzerModel.create({ streams: uniqueStreams });
      return res.json({ success: true, data: data });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const DreamAnalyze = async (req, res) => {
  try {
    let userDream = req.body.dream;
    const result = await DreamAnalyzer(userDream);
    const streams = Array.isArray(result?.streamSummary)
      ? result.streamSummary
          .map(item => (item && typeof item.stream === "string" ? item.stream : null))
          .filter(Boolean)
      : [];
    if (streams.length > 0) {
      const data=await analyzerModel.create({ streams });
      res.json({ success: true, data:data });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const CareerOption = async (req, res) => {
  try {
    const { stream } = req.body;

    if (!stream || typeof stream !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Stream is required" });
    }
    const result = await CareerOptions(stream);
    console.log("CareerOptions result:", result);
    const courses = Array.isArray(result?.courses)
      ? result.courses
      : Object.values(result?.courses || {});
    const careerPaths = Array.isArray(result?.career_paths)
      ? result.career_paths
      : Object.values(result?.career_paths || {});

    if (result?.stream && courses.length && careerPaths.length) {
      const data = await careerModel.create({
        stream: result.stream,
        courses,
        career_paths: careerPaths,
      });

      return res.json({ success: true, data: data });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid format received from CareerOptions",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

export const Brief = async (req, res) => {
  try {
    const { course } = req.body;

    if (!course || typeof course !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Course is required" });
    }
    const result = await CareerBrief(course);

    if (
      result?.course &&
      typeof result.overview === "string" &&
      Array.isArray(result.career_paths) &&
      Array.isArray(result.related_skills)
    ) { 
      const data = await courseModel.create({
        course: result.course,
        overview: result.overview,
        career_paths: result.career_paths,
        related_skills: result.related_skills,
      });

      return res.json({ success: true, data: data });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid result format from CareerBrief",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};