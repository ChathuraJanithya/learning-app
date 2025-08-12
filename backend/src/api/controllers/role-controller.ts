import { Request, Response } from "express";
import Role, { IRole } from "@/api/models/role-model";
import logger from "@/utils/logger";

export const addRole = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { roleName, roleDescription } = req.body;

  try {
    const existingRole = await Role.findOne({ roleName });

    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role: IRole = new Role({ roleName, roleDescription });

    await role.save();

    return res.status(201).json({
      message: "Role created successfully",
    });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(500).json({ error: "Could not add role" });
  }
};
