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
};

export default EnrolledCourseService;
