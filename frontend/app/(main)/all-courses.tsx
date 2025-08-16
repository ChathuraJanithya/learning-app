import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useQueries, useQuery } from "@tanstack/react-query";
import CourseService from "@/services/course-service";
import EnrolledCourseService from "@/services/enrolled-course-service";

import { Course } from "@/types";
import CourseCard from "@/components/CourseCard";

export default function AllCourses() {
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
              onEnroll={(courseId) =>
                console.log(`Enrolled in course: ${courseId}`)
              }
              isEnrolled={enrolledCourseIdsSet.has(course._id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
