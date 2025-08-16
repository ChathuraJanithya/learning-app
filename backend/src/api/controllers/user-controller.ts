import { Request, Response } from "express";
import User from "@/api/models/user-model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger";
import Role from "@/api/models/role-model";

export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { firstName, lastName, contact, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const validRole = await Role.findById(role);

    if (!validRole) {
      return res.status(400).json({ message: "Invalid role" });
    }

    console.log(validRole, "exposed");

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      firstName,
      lastName,
      contact,
      email,
      role,
      password: hashedPassword,
    });

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      logger.error("SECRET_KEY is not defined");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      {
        id: result._id.toString(),
        role: { _id: validRole._id.toString(), roleName: validRole.roleName },
      },
      secretKey,
      { expiresIn: "1d" }
    );

    const userData = {
      email: result.email,
      name: `${result.firstName} ${result.lastName}`,
      role: validRole.roleName,
    };

    return res.status(201).json({ user: userData, token });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email }).populate(
      "role",
      "roleName"
    );

    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    console.log(existingUser, "exposed");

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userData = {
      email: existingUser.email,
      role: (existingUser.role as any).roleName,
      name: `${existingUser.firstName} ${existingUser.lastName}`,
    };

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      logger.error("SECRET_KEY is not defined");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: existingUser._id.toString(), role: existingUser.role },
      secretKey,
      { expiresIn: "1d" }
    );

    return res.status(201).json({ user: userData, token });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
