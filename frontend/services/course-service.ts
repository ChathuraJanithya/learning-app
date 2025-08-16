import httpClient from "@/hooks/httpClient";
import { Course } from "@/types";

const CourseService = {
  async getAllCourses() {
    try {
      const response = await httpClient.get("/course");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch courses");
    }
  },
  async getCourseById(id: string) {
    try {
      return await httpClient.get(`/courses/${id}`);
    } catch (error) {
      throw new Error("Failed to fetch course");
    }
  },
  async createCourse(data: Course) {
    try {
      const response = await httpClient.post("/course", data);
      console.log(response, "response from CreateCourse");
      return response;
    } catch (error) {
      console.error("Create Course API Error:", error);
      throw error;
    }
  },
  async updateCourse(id: string, data: any) {
    try {
      return await httpClient.put(`/course/${id}`, data);
    } catch (error) {
      throw new Error("Failed to update course");
    }
  },
  async deleteCourse(id: string) {
    try {
      return await httpClient.delete(`/courses/${id}`);
    } catch (error) {
      throw new Error("Failed to delete course");
    }
  },
};

export default CourseService;
