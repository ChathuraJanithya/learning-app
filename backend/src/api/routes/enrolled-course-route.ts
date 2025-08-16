import express, { Router } from "express";

import {
  enrollInCourse,
  getEnrolledCourseIds,
  unenrollFromCourse,
} from "@/api/controllers/enrolled-course-controller";

const enrolledCourseRouter: Router = express.Router();

enrolledCourseRouter.post("/:courseId", enrollInCourse);
enrolledCourseRouter.get("/", getEnrolledCourseIds);
enrolledCourseRouter.delete("/:courseId", unenrollFromCourse);

export default enrolledCourseRouter;
