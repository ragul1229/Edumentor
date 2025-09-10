// models/Quiz.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
});

const quizSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true },
    questions: [questionSchema],
    score: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now }, // auto-set when created
  },
  { timestamps: true } // adds createdAt, updatedAt
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
