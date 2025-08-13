import mongoose, { Document, Schema, Model } from "mongoose";

interface ICourse extends Document {
  title: string;
  description: string;
  duration: number;
  content: string;
  instructor: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const courseSchema: Schema<ICourse> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Course: Model<ICourse> = mongoose.model("Course", courseSchema);

export default Course;
