import React from "react";
import { View, Text, ScrollView } from "react-native";

import { useQuery } from "@tanstack/react-query";

import { Course } from "@/types";
import CourseCard from "@/components/CourseCard";
import { useCourseContext } from "@/context/CourseContext";
import CourseService from "@/services/course-service";

export default function InstructorCourses() {
  const {
    courses,
    enrollCourse,
    unenrollCourse,
    isLoading,
    enrolledCourseIds,
    deleteCourseHandler,
  } = useCourseContext();

  const {
    data: coursesForInstructor,
    isFetching: isFetchingCoursesForInstructor,
  } = useQuery({
    queryKey: ["coursesforinstructor"],
    queryFn: () => CourseService.getCoursesForInstructor(),
    staleTime: Infinity,
    retryDelay: 1000,
  });

  return (
    <ScrollView
      className="h-full px-4 bg-white"
      contentContainerStyle={{ paddingVertical: 20 }}
    >
      <Text className="mb-4 text-2xl font-bold text-gray-800 text-start">
        All My Courses {coursesForInstructor?.data?.count}
      </Text>

      {isFetchingCoursesForInstructor ? (
        <Text>Loading...</Text>
      ) : (
        <View className="w-full ">
          {coursesForInstructor?.data?.data?.map((course: Course) => (
            <CourseCard
              course={course}
              key={course._id}
              onEnroll={(courseId) => enrollCourse(courseId)}
              //@ts-ignore
              isEnrolled={enrolledCourseIds.includes(course._id)}
              onUnenroll={(courseId) => unenrollCourse(courseId)}
              showControls={true}
              deleteCourse={(courseId) => deleteCourseHandler(courseId)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
