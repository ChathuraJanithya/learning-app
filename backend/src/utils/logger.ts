import pino, { LoggerOptions, Logger } from "pino";

const options: LoggerOptions = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
};

const logger: Logger = pino(options);

export default logger;
