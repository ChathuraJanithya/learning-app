import express, { Router } from "express";
import { signup, login } from "../controllers/user-controller";

const userRouter: Router = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);

export default userRouter;
