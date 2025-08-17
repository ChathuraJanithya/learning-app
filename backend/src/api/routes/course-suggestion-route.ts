import express, { Router } from "express";
import { streamCourseSuggestions } from "@/api/controllers/course-suggestion-controller";

const courseSuggestionRouter: Router = express.Router();

courseSuggestionRouter.get("/stream", streamCourseSuggestions);

export default courseSuggestionRouter;
