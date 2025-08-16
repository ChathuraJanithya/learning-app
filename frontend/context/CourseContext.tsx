import React, { createContext, useContext, ReactNode } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import CourseService from "@/services/course-service";
import EnrolledCourseService from "@/services/enrolled-course-service";
import { useMutation } from "@tanstack/react-query";
import { CourseResponse, EnrolledCourseResponse } from "@/types";

interface CourseContextType {
  courses: CourseResponse | undefined;
  enrolledCourseIds: Set<string>;
  isLoading: boolean;
  enrollCourse: (courseId: string) => void;
  unenrollCourse: (courseId: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  const [
    { data: allCourses, isFetching: isCoursesFetching },
    { data: enrolledCourses, isFetching: isEnrolledFetching },
  ] = useQueries({
    queries: [
      {
        queryKey: ["allCourses"],
        queryFn: () => CourseService.getAllCourses(),
        staleTime: Infinity,
      },
      {
        queryKey: ["enrolledCourses"],
        queryFn: () => EnrolledCourseService.enrolledCourseIds(),
        staleTime: Infinity,
      },
    ],
  });

  // Create a Set for efficient lookup of enrolled courses.
  // This logic should be placed outside the queries.
  const enrolledCourseIds = enrolledCourses?.data?.map(
    (item: EnrolledCourseResponse) => item.course
  );

  const { mutate: enroll, isPending: isEnrolling } = useMutation({
    mutationFn: (courseId: string) =>
      EnrolledCourseService.enrollInCourse(courseId),
    onSuccess: (data) => {
      console.log("Successfully enrolled in course:", data);
      alert("Enrolled successfully!");
      queryClient.invalidateQueries({ queryKey: ["enrolledCourses"] });
    },
    onError: (error) => {
      console.error("Error enrolling in course:", error);
    },
  });

  const enrollCourse = (courseId: string) => {
    enroll(courseId);
    queryClient.invalidateQueries({ queryKey: ["enrolledCourses"] });
  };

  const { mutate: unEnroll, isPending: isUnenrolling } = useMutation({
    mutationFn: (courseId: string) =>
      EnrolledCourseService.unenrollFromCourse(courseId),
    onSuccess: (data) => {
      alert("Unenrolled successfully!");
      console.log("Successfully unenrolled from course:", data);
      queryClient.invalidateQueries({ queryKey: ["enrolledCourses"] });
    },
    onError: (error) => {
      console.error("Error unenrolling from course:", error);
    },
  });

  const unenrollCourse = (courseId: string) => {
    unEnroll(courseId);
    // Invalidate the query to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ["enrolledCourses"] });
  };

  const isLoading = isCoursesFetching || isEnrolledFetching;

  return (
    <CourseContext.Provider
      value={{
        courses: allCourses,
        enrolledCourseIds,
        unenrollCourse,
        enrollCourse,
        isLoading,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};
