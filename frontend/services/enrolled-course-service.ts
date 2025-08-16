import httpClient from "@/hooks/httpClient";

const EnrolledCourseService = {
  async enrolledCourseIds() {
    try {
      const response = await httpClient.get(`/enrolled-course`);
      return response?.data;
    } catch (error) {
      console.error("Error enrolling in course:", error);
      throw error;
    }
  },

  async enrollInCourse(courseId: string) {
    try {
      const response = await httpClient.post(`/enrolled-course/${courseId}`);
      return response?.data;
    } catch (error) {
      console.error("Error enrolling in course:", error);
      throw error;
    }
  },

  async unenrollFromCourse(courseId: string) {
    try {
      const response = await httpClient.delete(`/enrolled-course/${courseId}`);
      return response?.data;
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      throw error;
    }
  },
};

export default EnrolledCourseService;
