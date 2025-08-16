import React from "react";
import { Course } from "@/types";
import { useNavigation } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthContext";

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onEnroll: (courseId: string) => void;
  onUnenroll: (courseId: string) => void;
  showControls?: boolean;
  deleteCourse?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled,
  onEnroll,
  onUnenroll,
  showControls = false,
  deleteCourse,
}) => {
  // @ts-ignore
  const navigation = useNavigation<any>();
  const { user } = useAuth(); // Assuming you have a useAuth hook to get the current user

  return (
    <View className="p-4 mb-4 bg-white shadow-md rounded-xl">
      {/* Title */}
      <View className="flex flex-row items-center justify-between ">
        <Text className="mb-1 text-lg font-bold text-gray-900">
          {course.title}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("[courseId]", {
              courseId: course._id,
              showInfo: showControls as boolean,
            });
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
          {course.createdAt
            ? new Date(course.createdAt).toLocaleDateString()
            : "N/A"}
        </Text>
      </View>

      {/* Enroll/Enrolled Button - Only for students */}
      {user?.role === "student" &&
        (!isEnrolled ? (
          <TouchableOpacity
            onPress={() => onEnroll(course._id as string)}
            className="items-center px-4 py-2 bg-black rounded-lg"
          >
            <Text className="font-semibold text-white">Enroll</Text>
          </TouchableOpacity>
        ) : (
          <Text className="font-semibold text-gray-500">Enrolled</Text>
        ))}
      {isEnrolled && user?.role === "student" && (
        <TouchableOpacity
          onPress={() => onUnenroll(course._id as string)}
          className="items-center px-4 py-2 bg-red-600 rounded-lg"
        >
          <Text className="font-semibold text-white">Unenroll</Text>
        </TouchableOpacity>
      )}
      {showControls && (
        <View className="flex flex-row justify-between">
          <TouchableOpacity
            onPress={() => deleteCourse?.(course._id as string)}
            className="items-center px-4 py-2 bg-red-600 rounded-lg"
          >
            <Text className="font-semibold text-white">Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("update-course", { courseId: course._id });
            }}
            className="items-center px-4 py-2 bg-blue-600 rounded-lg"
          >
            <Text className="font-semibold text-white">Update</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CourseCard;
