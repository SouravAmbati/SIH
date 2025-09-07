import mongoose from "mongoose";

const streamSchema = new mongoose.Schema({
  questions: [
    {
      question: { type: String, required: true },
      options: {
        A: { type: String, required: true },
        B: { type: String, required: true },
        C: { type: String, required: true },
        D: { type: String, required: true },
      },
    },
  ],
});

const streamModel = mongoose.models.stream || mongoose.model("stream", streamSchema);

export default streamModel;
