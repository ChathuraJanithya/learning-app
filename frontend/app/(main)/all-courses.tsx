import React from "react";
import { View, Text, ScrollView } from "react-native";

import { Course } from "@/types";

import CourseCard from "@/components/CourseCard";
import { useCourseContext } from "@/context/CourseContext";

export default function AllCourses() {
  const {
    courses,
    enrollCourse,
    unenrollCourse,
    isLoading,
    enrolledCourseIds,
  } = useCourseContext();

  return (
    <ScrollView
      className="h-full px-4 bg-white"
      contentContainerStyle={{ paddingVertical: 20 }}
    >
      <Text className="mb-4 text-2xl font-bold text-gray-800 text-start">
        All Courses {courses?.data?.length}
      </Text>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View className="w-full ">
          {courses?.data?.map((course: Course) => (
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
