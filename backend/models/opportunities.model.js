import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
  },
  trendingFields: [
    {
      field: { type: String, required: true },
      reason: { type: String, required: true },
    }
  ],
  industryOpportunities: [
    {
      role: { type: String, required: true },
      demandReason: { type: String, required: true },
    }
  ]
}, { timestamps: true });

const opportunityModel = mongoose.models.opportunities || mongoose.model("opportunities", opportunitySchema);

export default opportunityModel;
