import mongoose, { Document, Schema, Model } from "mongoose";

interface IEnrolledCourse extends Document {
  user: mongoose.Schema.Types.ObjectId | string;
  course: mongoose.Schema.Types.ObjectId | string;
  enrolledAt: Date;
}

const enrolledCourseSchema: Schema<IEnrolledCourse> = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrolledAt: { type: Date, default: Date.now },
});

const EnrolledCourse: Model<IEnrolledCourse> = mongoose.model(
  "EnrolledCourse",
  enrolledCourseSchema
);

export default EnrolledCourse;
