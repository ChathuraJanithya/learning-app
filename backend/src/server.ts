import "dotenv/config";

import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

import logger from "@/utils/logger";

import { connect } from "./utils/database.connection";

import { AuthGuard } from "@/api/middleware/auth-guard";

import userRouter from "@/api/routes/user-routes";
import roleRouter from "@/api/routes/role-routes";

const app = express();
const PORT = process.env.PORT || "8090";

app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "20mb" }));

app.use(AuthGuard);
app.get("/", (req, res, next) => {
  res.send("<h2>Learning Management System</h2>");
  next();
});

app.use("/user", userRouter);
app.use("/role", roleRouter);

app.listen(PORT, () => {
  logger.info(`Server is up and running on ${PORT}`);
  connect();
});
