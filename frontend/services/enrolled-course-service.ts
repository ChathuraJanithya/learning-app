import httpClient from "@/hooks/httpClient";

const PATH = "/enrolled-course";

const EnrolledCourseService = {
  async enrolledCourseIds() {
    try {
      const response = await httpClient.get(`${PATH}`);
      return response?.data;
    } catch (error) {
      console.error("Error enrolling in course:", error);
      throw error;
    }
  },

  async enrollInCourse(courseId: string) {
    try {
      const response = await httpClient.post(`${PATH}/${courseId}`);
      return response?.data;
    } catch (error) {
      console.error("Error enrolling in course:", error);
      throw error;
    }
  },

  async unenrollFromCourse(courseId: string) {
    try {
      const response = await httpClient.delete(`${PATH}/${courseId}`);
      return response?.data;
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      throw error;
    }
  },

  async getEnrolledStudents(courseId: string) {
    try {
      const response = await httpClient.get(`${PATH}/${courseId}/students`);
      return response?.data;
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
      throw error;
    }
  },
};

export default EnrolledCourseService;
