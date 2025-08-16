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
  async updateCourse(id: string, data: Course) {
    try {
      const response = await httpClient.put(`/course/${id}`, data);
      return response;
    } catch (error) {
      throw new Error("Failed to update course");
    }
  },
  async deleteCourse(courseId: string) {
    try {
      const response = await httpClient.delete(`/course/${courseId}`);
      return response;
    } catch (error) {
      throw new Error("Failed to delete course");
    }
  },
  async getCoursesForInstructor() {
    try {
      const response = await httpClient.get(`course/instructor/`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch courses by instructor");
    }
  },
};

export default CourseService;
