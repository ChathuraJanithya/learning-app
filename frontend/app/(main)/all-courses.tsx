import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import CourseService from "@/services/course-service";
import EnrolledCourseService from "@/services/enrolled-course-service";

import { Course } from "@/types";
import CourseCard from "@/components/CourseCard";

export default function AllCourses() {
  const queryClient = useQueryClient();

  const [
    { data: courses, isFetching: isFetchingCourses },
    { data: enrolledCourses, isFetching: isFetchingEnrolled },
  ] = useQueries({
    queries: [
      {
        queryKey: ["courses"],
        queryFn: () => CourseService.getAllCourses(),
        staleTime: Infinity,
        retryDelay: 1000,
      },
      {
        queryKey: ["enrolledCourses"],
        queryFn: () => EnrolledCourseService.enrolledCourseIds(),
        staleTime: Infinity,
        retryDelay: 1000,
      },
    ],
  });

  const enrolledCourseIds = enrolledCourses?.data?.map(
    (item: any) => item.course
  );
  const enrolledCourseIdsSet = new Set(enrolledCourseIds);

  const { mutate: enroll, isPending: isEnrolling } = useMutation({
    mutationFn: (courseId: string) =>
      EnrolledCourseService.enrollInCourse(courseId),
    onSuccess: (data) => {
      console.log("Successfully enrolled in course:", data);
      queryClient.invalidateQueries({ queryKey: ["enrolledCourses"] });
    },
    onError: (error) => {
      console.error("Error enrolling in course:", error);
    },
  });

  const handleEnroll = (courseId: string) => {
    enroll(courseId);
  };

  const { mutate: unEnroll, isPending: isUnenrolling } = useMutation({
    mutationFn: (courseId: string) =>
      EnrolledCourseService.unenrollFromCourse(courseId),
    onSuccess: (data) => {
      console.log("Successfully unenrolled from course:", data);
      queryClient.invalidateQueries({ queryKey: ["enrolledCourses"] });
    },
    onError: (error) => {
      console.error("Error unenrolling from course:", error);
    },
  });

  const handleUnenroll = (courseId: string) => {
    unEnroll(courseId);
  };

  return (
    <ScrollView
      className="h-full px-4 bg-white"
      contentContainerStyle={{ paddingVertical: 20 }}
    >
      <Text className="mb-4 text-2xl font-bold text-gray-800 text-start">
        All Courses {courses?.count}
      </Text>

      {isFetchingCourses ? (
        <Text>Loading...</Text>
      ) : (
        <View className="w-full ">
          {courses?.data?.map((course: Course) => (
            <CourseCard
              course={course}
              key={course._id}
              onEnroll={(courseId) => handleEnroll(courseId)}
              isEnrolled={enrolledCourseIdsSet.has(course._id)}
              onUnenroll={(courseId) => handleUnenroll(courseId)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
