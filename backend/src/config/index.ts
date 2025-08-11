const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("Missing environment variable: MONGODB_URL");
}

const config = {
  DB_CONNECTION_STRING: MONGODB_URL,
};

export default config;
