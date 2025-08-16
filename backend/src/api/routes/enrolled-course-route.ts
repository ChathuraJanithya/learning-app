import express, { Router } from "express";

import {
  enrollInCourse,
  getEnrolledCourseIds,
  unenrollFromCourse,
  getEnrolledStudentDetails,
} from "@/api/controllers/enrolled-course-controller";

const enrolledCourseRouter: Router = express.Router();

enrolledCourseRouter.get("/", getEnrolledCourseIds);
enrolledCourseRouter.post("/:courseId", enrollInCourse);
enrolledCourseRouter.delete("/:courseId", unenrollFromCourse);
enrolledCourseRouter.get("/:courseId/students", getEnrolledStudentDetails);

export default enrolledCourseRouter;
