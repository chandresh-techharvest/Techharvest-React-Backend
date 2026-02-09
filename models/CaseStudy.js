import mongoose from "mongoose";

const caseStudySchema = new mongoose.Schema({
  client: { type: String, required: true },
  title: { type: String, required: true },
  industry: { type: String, required: true },
  domain: { type: String, required: true },
  description: { type: String, required: true },
  challenge: { type: String},
  solution: { type: String },
  result: { type: String, required: true },
  tech: [],
  image: {
    type: String,
    default: null,
  },
  url: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CaseStudy", caseStudySchema);
