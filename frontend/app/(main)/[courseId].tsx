import React from "react";
import { View, Text } from "react-native";
import { useCourseContext } from "@/context/CourseContext";
import { useLocalSearchParams } from "expo-router";

export default function CoursePage() {
  const { courseId } = useLocalSearchParams();
  const { courses } = useCourseContext();
  const course = courses?.data?.find((c) => c._id === courseId);

  return (
    <View className="w-full h-full bg-white ">
      <Text>Course Details for {course?.title}</Text>
    </View>
  );
}
