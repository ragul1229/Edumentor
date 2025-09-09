import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  summary: { type: String },
  uploadedAt: { type: Date, default: Date.now },
user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // remove required: true

});

export default mongoose.model("Note", noteSchema);
