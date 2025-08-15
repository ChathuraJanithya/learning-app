import httpClient from "@/hooks/httpClient";
import { LoggingUser, SignUpUser } from "@/types";

export const login = async (body: LoggingUser) => {
  try {
    const response = await httpClient.post("/user/login", {
      body,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await httpClient.post("/logout");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signup = async (body: SignUpUser) => {
  try {
    const response = await httpClient.post("/signup", {
      body,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
