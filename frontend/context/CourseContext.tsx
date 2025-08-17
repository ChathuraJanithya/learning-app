import React, { createContext, useContext, ReactNode } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import CourseService from "@/services/course-service";
import { CourseResponse, EnrolledCourseResponse } from "@/types";
import EnrolledCourseService from "@/services/enrolled-course-service";

interface CourseContextType {
  courses: CourseResponse | undefined;
  enrolledCourseIds: Set<string>;
  isLoading: boolean;
  enrollCourse: (courseId: string) => void;
  unenrollCourse: (courseId: string) => void;
  deleteCourseHandler: (courseId: string) => void;
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

  const enrolledCourseIds = enrolledCourses?.data?.map(
    (item: EnrolledCourseResponse) => item.course
  );

  const { mutate: enroll, isPending: isEnrolling } = useMutation({
    mutationFn: (courseId: string) =>
      EnrolledCourseService.enrollInCourse(courseId),
    onSuccess: (data) => {
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

  const { mutate: deleteCourse, isPending: isDeleting } = useMutation({
    mutationFn: (courseId: string) => CourseService.deleteCourse(courseId),
    onSuccess: (data) => {
      alert("Deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["coursesforinstructor"] });
    },
    onError: (error) => {
      console.error("Error deleting course:", error);
    },
  });

  const deleteCourseHandler = (courseId: string) => {
    deleteCourse(courseId);
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
        deleteCourseHandler,
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
