import axios from "axios";
import { BASE_URL } from "@/constants/server";
import { LoggingUser, SignUpUser } from "@/types";

export const AuthService = {
  async login(data: LoggingUser) {
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("Login API Error:", error);
      throw error;
    }
  },
  async logout() {
    try {
      const response = await axios.post(`${BASE_URL}/logout`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async signup(body: SignUpUser) {
    try {
      const response = await axios.post(`${BASE_URL}/signup`, {
        body,
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
