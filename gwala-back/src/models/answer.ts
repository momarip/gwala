import mongoose, { Schema } from "mongoose";

const answerSchema: Schema = new Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
