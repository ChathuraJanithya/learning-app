import React from "react";
import { Course } from "@/types";
import { useNavigation } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onEnroll: (courseId: string) => void;
  onUnenroll: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled,
  onEnroll,
  onUnenroll,
}) => {
  // @ts-ignore
  const navigation = useNavigation<any>();

  return (
    <View className="p-4 mb-4 bg-white shadow-md rounded-xl">
      {/* Title */}
      <View className="flex flex-row items-center justify-between ">
        <Text className="mb-1 text-lg font-bold text-gray-900">
          {course.title}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("[courseId]", { courseId: course._id });
          }}
        >
          <Text className="text-blue-500">View Details</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <Text className="mb-2 text-gray-700">{course.description}</Text>

      {/* Duration and Date */}
      <View className="flex-row justify-between mb-4">
        <Text className="text-sm text-gray-500">{course.duration} hrs</Text>
        <Text className="text-sm text-gray-500">
          {new Date(course.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Enroll Button */}
      {!isEnrolled ? (
        <TouchableOpacity
          onPress={() => onEnroll(course._id)}
          className="items-center px-4 py-2 bg-black rounded-lg"
        >
          <Text className="font-semibold text-white">Enroll</Text>
        </TouchableOpacity>
      ) : (
        <Text className="font-semibold text-gray-500">Enrolled</Text>
      )}

      {/* Unenroll Button */}
      {isEnrolled && (
        <TouchableOpacity
          onPress={() => onUnenroll(course._id)}
          className="items-center px-4 py-2 bg-red-600 rounded-lg"
        >
          <Text className="font-semibold text-white">Unenroll</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CourseCard;
