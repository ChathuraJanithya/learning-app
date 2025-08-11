import express, { Router } from "express";
import { addRole } from "@/api/controllers/role-controller";

const roleRouter: Router = express.Router();

roleRouter.post("/", addRole);

export default roleRouter;
