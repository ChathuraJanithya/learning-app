import express, { Router } from "express";

import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseByInstructorId,
} from "@/api/controllers/course-controller";

const courseRouter: Router = express.Router();

courseRouter.get("/", getAllCourses);
courseRouter.post("/", createCourse);
courseRouter.delete("/:id", deleteCourse);
courseRouter.get("/instructor", getCourseByInstructorId);
courseRouter.get("/instructor/:instructorId", getCourseByInstructorId);

export default courseRouter;
