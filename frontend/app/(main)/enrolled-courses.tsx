import React from "react";
import { View, Text, ScrollView } from "react-native";

import { Course } from "@/types";
import CourseCard from "@/components/CourseCard";
import { useCourseContext } from "@/context/CourseContext";

export default function Enrolled() {
  const {
    courses,
    enrollCourse,
    unenrollCourse,
    isLoading,
    enrolledCourseIds,
  } = useCourseContext();

  const enrolledCourses = courses?.data?.filter((course: Course) =>
    //@ts-ignore
    enrolledCourseIds.includes(course._id)
  );

  return (
    <ScrollView
      className="h-full px-4 bg-white"
      contentContainerStyle={{ paddingVertical: 20 }}
    >
      <Text className="mb-4 text-2xl font-bold text-gray-800 text-start">
        Enrolled Courses
      </Text>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View className="w-full ">
          {enrolledCourses?.map((course: Course) => (
            <CourseCard
              course={course}
              key={course._id}
              onEnroll={(courseId) => enrollCourse(courseId)}
              //@ts-ignore
              isEnrolled={enrolledCourseIds.includes(course._id)}
              onUnenroll={(courseId) => unenrollCourse(courseId)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
