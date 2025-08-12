import express, { Router } from "express";

import { createCourse } from "@/api/controllers/course-controller";

const courseRouter: Router = express.Router();

courseRouter.post("/", createCourse);

export default courseRouter;
