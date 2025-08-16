import httpClient from "@/hooks/httpClient";

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
  async createCourse(data: any) {
    try {
      return await httpClient.post("/courses", data);
    } catch (error) {
      throw new Error("Failed to create course");
    }
  },
  async updateCourse(id: string, data: any) {
    try {
      return await httpClient.put(`/courses/${id}`, data);
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
