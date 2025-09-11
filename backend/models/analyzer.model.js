import mongoose from "mongoose";

const analyzerSchema = new mongoose.Schema({
  streams: [
    {
      stream: { type: String, required: true },
      percentage: { type: Number, required: true },
      recommendation: { type: String, required: true }
    }
  ],
  bestStream: {
    type: [String],  // multiple if tie
    required: true
  }
});

const analyzerModel =
  mongoose.models.analyzers || mongoose.model("analyzers", analyzerSchema);

export default analyzerModel;
