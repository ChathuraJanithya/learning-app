import "dotenv/config";

import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

import logger from "@/utils/logger";

import { connect } from "./utils/database.connection";

import { AuthGuard } from "@/api/middleware/auth-guard";

import userRouter from "@/api/routes/user-routes";
import roleRouter from "@/api/routes/role-routes";
import courseRouter from "@/api/routes/course-routes";
import enrolledCourseRouter from "@/api/routes/enrolled-course-route";
import courseSuggestionRouter from "@/api/routes/course-suggestion-route";

const app = express();
const PORT = process.env.PORT || "8090";

app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "20mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// Auth middleware
app.use(AuthGuard);

app.use("/user", userRouter);
app.use("/role", roleRouter);
app.use("/course", courseRouter);
app.use("/enrolled-course", enrolledCourseRouter);
app.use("/course-suggestion", courseSuggestionRouter);

app.listen(PORT, () => {
  logger.info(`Server is up and running on ${PORT}`);
  connect();
});
