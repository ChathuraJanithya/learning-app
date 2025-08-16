import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for the EnrolledCourse document
interface IEnrolledCourse extends Document {
  student: mongoose.Schema.Types.ObjectId;
  course: mongoose.Schema.Types.ObjectId;
  enrollmentDate: Date;
}

// Schema for the EnrolledCourse collection
const enrolledCourseSchema: Schema<IEnrolledCourse> = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const EnrolledCourse: Model<IEnrolledCourse> = mongoose.model<IEnrolledCourse>(
  "EnrolledCourse",
  enrolledCourseSchema
);

export default EnrolledCourse;
