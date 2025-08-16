import axios from "axios";
import { BASE_URL } from "@/constants/server";
import AsyncStorage from "@react-native-async-storage/async-storage";

const httpClient = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor - Attach Token
httpClient.interceptors.request.use(
  async (config) => {
    const userDetails = await AsyncStorage.getItem("user");

    if (userDetails) {
      const { token } = JSON.parse(userDetails);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;
