import { Course } from "@/types";

import httpClient from "@/hooks/httpClient";

const PATH = "/course";

const CourseService = {
  async getAllCourses() {
    try {
      const response = await httpClient.get(PATH);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch courses");
    }
  },
  async getCourseById(id: string) {
    try {
      return await httpClient.get(`${PATH}/${id}`);
    } catch (error) {
      throw new Error("Failed to fetch course");
    }
  },
  async createCourse(data: Course) {
    try {
      const response = await httpClient.post(PATH, data);
      return response;
    } catch (error) {
      console.error("Create Course API Error:", error);
      throw error;
    }
  },
  async updateCourse(id: string, data: Course) {
    try {
      const response = await httpClient.put(`${PATH}/${id}`, data);
      return response;
    } catch (error) {
      throw new Error("Failed to update course");
    }
  },
  async deleteCourse(courseId: string) {
    try {
      const response = await httpClient.delete(`${PATH}/${courseId}`);
      return response;
    } catch (error) {
      throw new Error("Failed to delete course");
    }
  },
  async getCoursesForInstructor() {
    try {
      const response = await httpClient.get(`${PATH}/instructor/`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch courses by instructor");
    }
  },
};

export default CourseService;
