import { analyzeQuiz, CareerBrief, CareerOptions, DreamAnalyzer, getCourseOpportunities, getQuiz, getSkillRoadmap, StreamChatBot } from "../configs/gemini.js";
import analyzerModel from "../models/analyzer.model.js";
import courseModel from "../models/brief.model.js";
import careerModel from "../models/careerOptions.model.js";
import opportunityModel from "../models/opportunities.model.js";
import streamModel from "../models/stream.model.js";
import jwt from "jsonwebtoken"
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

// export const analyzeAnswers = async (req, res) => {
//   try {
//     let userAnswers = req.body.answers;
//     if (!Array.isArray(userAnswers)) {
//       return res.status(400).json({ success: false, message: "Invalid answers format" });
//     }
//     userAnswers = userAnswers.filter(ans => typeof ans === "string" && ans.trim() !== "");
//     const result = await analyzeQuiz(userAnswers);
//     const streams = Array.isArray(result?.streamSummary)
//       ? result.streamSummary
//           .map(item => (item && typeof item.stream === "string" ? item.stream : null))
//           .filter(Boolean)
//       : [];

//     if (streams.length > 0) {
//       const uniqueStreams = [...new Set(streams)];
//       const data=await analyzerModel.create({ streams: uniqueStreams });
//       return res.json({ success: true, data: data });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

export const analyzeAnswers = async (req, res) => {
  try {
    let userAnswers = req.body.answers;

    if (!Array.isArray(userAnswers)) {
      return res.status(400).json({ success: false, message: "Invalid answers format" });
    }

    // Clean answers
    userAnswers = userAnswers.filter(ans => typeof ans === "string" && ans.trim() !== "");

    // Analyze via Gemini
    const result = await analyzeQuiz(userAnswers);

    if (!result || !Array.isArray(result.streams)) {
      return res.status(500).json({ success: false, message: "AI analysis failed" });
    }

    const streams = result.streams.map(item => ({
      stream: item.stream,
      percentage: item.percentage,
      recommendation: item.recommendation
    }));

    const bestStream = Array.isArray(result.bestStream) ? result.bestStream : [];

    // Save to DB
    const data = await analyzerModel.create({
      streams,
      bestStream
    });

    return res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



// export const DreamAnalyze = async (req, res) => {
//   try {
//     let userDream = req.body.dream;

//     if (!userDream || typeof userDream !== "string") {
//       return res.status(400).json({ success: false, message: "Dream input is required" });
//     }

//     const result = await DreamAnalyzer(userDream);

//     if (!result || !Array.isArray(result.streams)) {
//       return res.status(500).json({ success: false, message: "AI analysis failed" });
//     }

//     const streams = result.streams.map(item => ({
//       stream: item.stream,
//       percentage: item.percentage,
//       recommendation: item.recommendation
//     }));

//     const bestStream = Array.isArray(result.bestStream) ? result.bestStream : [];

//     const data = await analyzerModel.create({ streams, bestStream });

//     return res.json({ success: true, data });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


export const DreamAnalyze = async (req, res) => {
  try {
    let userDream = req.body.dream;

    if (!userDream || typeof userDream !== "string") {
      return res.status(400).json({ success: false, message: "Dream input is required" });
    }

    const result = await DreamAnalyzer(userDream);

    if (!result || !Array.isArray(result.streams)) {
      return res.status(500).json({ success: false, message: "AI analysis failed" });
    }

    const streams = result.streams.map(item => ({
      stream: item.stream,
      percentage: item.percentage,
      recommendation: item.recommendation
    }));

    const bestStream = Array.isArray(result.bestStream) ? result.bestStream : [];

    const data = await analyzerModel.create({ streams, bestStream });

    return res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
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

const chatHistories = {};

export const chatBot = async (req, res) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - No token" });
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userId = decoded.id;

    // 3. Support both POST (body) and GET (query)
    const stream = req.body?.stream || req.query?.stream;
    const question = req.body?.question || req.query?.question;

    if (!stream || !question) {
      return res.status(400).json({ success: false, message: "Stream and question are required" });
    }

    // 4. Initialize history for this user if not exists
    if (!chatHistories[userId]) {
      chatHistories[userId] = [];
    }

    // 5. Call Gemini (pass stream + history + new question)
    const result = await StreamChatBot(stream, question, chatHistories[userId]);

    // 6. Save only structured Q&A to history
    chatHistories[userId].push({
      student_question: result.student_question,
      response: result.response,
      status: result.status
    });

    // 7. Send response
    res.json({ success: true, answer: result, history: chatHistories[userId] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const courseOpportunities = async (req, res) => {
  try {
    const { coursename } = req.body;

    if (!coursename) {
      return res.status(400).json({ success: false, message: "Course name is required" });
    }
    const response = await getCourseOpportunities(coursename);

    if (response.error) {
      return res.status(500).json({ success: false, message: "AI failed to generate opportunities" });
    }
    const newEntry = new opportunityModel({
      course: response.course,
      trendingFields: response.trendingFields,
      industryOpportunities: response.industryOpportunities,
    });

    await newEntry.save();
    res.json({ success: true, data: newEntry });

  } catch (error) {
    console.error("Error in courseOpportunities:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const Roadmap=async(req,res)=>{
  const {skill}=req.body;
  const response=await getSkillRoadmap(skill)
  res.json(response);
}