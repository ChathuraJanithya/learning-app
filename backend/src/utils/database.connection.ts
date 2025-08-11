import logger from "@/utils/logger";
import config from "@/config/index";
import mongoose, { Connection } from "mongoose";

let database: Connection | undefined;

export const connect = async (): Promise<void> => {
  const MONGODB_URL: string = config.DB_CONNECTION_STRING;

  if (database) return;

  try {
    const connection = await mongoose.connect(MONGODB_URL);
    database = connection.connection;
    logger.info("Database Synced");
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    } else {
      logger.error("Unknown database connection error");
    }
  }
};
