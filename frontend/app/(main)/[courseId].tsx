import React from "react";
import { studentDetails } from "@/types";

import { useAuth } from "@/context/AuthContext";
import { useCourseContext } from "@/context/CourseContext";

import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView } from "react-native";

import EnrolledCourseService from "@/services/enrolled-course-service";

export default function CoursePage() {
  const { courseId, showInfo } = useLocalSearchParams();
  const { courses } = useCourseContext();
  const { user } = useAuth();
  const course = courses?.data?.find((c) => c._id === courseId);
  const runGetDetails = user?.role === "instructor" && showInfo;

  const { data: studentDetails, isFetching: isFetchingStudentDetails } =
    useQuery({
      queryKey: ["studentDetails", courseId],
      queryFn: () =>
        EnrolledCourseService.getEnrolledStudents(courseId as string),
      staleTime: Infinity,
      retryDelay: 1000,
      enabled: !!runGetDetails,
    });

  return (
    <View className="w-full h-full p-4 bg-white">
      <ScrollView>
        {/* Header Section */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            {course?.title}
          </Text>
          <Text className="mt-1 text-gray-500">
            Published on{" "}
            {course?.createdAt
              ? new Date(course.createdAt).toLocaleDateString()
              : "N/A"}
          </Text>
        </View>

        {/* Description Section */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-semibold">Description</Text>
          <Text className="text-gray-700">{course?.description}</Text>
        </View>

        {/* Content Section */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-semibold">Course Content</Text>
          <Text className="text-gray-700">{course?.content}</Text>
        </View>

        {/* Extra Professional Details */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-semibold">Course Details</Text>
          <View className="space-y-2">
            <Text className="text-gray-700">
              Duration: {course?.duration} hours
            </Text>
            <Text className="text-gray-700">Level: Beginner</Text>
            <Text className="text-gray-700">Language: English</Text>
            <Text className="text-gray-700">Instructor: John Doe</Text>
            <Text className="text-gray-700">Category: Web Development</Text>
          </View>
        </View>

        {/* Action Buttons */}
        {/*    {user?.role === "student" && (
          <View className="flex flex-row mt-8 space-x-4">
            <TouchableOpacity
              className="flex-1 p-4 bg-blue-500 rounded-lg"
              onPress={() => enrollCourse(courseId as string)}
            >
              <Text className="font-semibold text-center text-white">
                Enroll Now
              </Text>
            </TouchableOpacity>
          </View>
        )} */}
        {runGetDetails == "true" && (
          <View className="mt-8">
            <Text className="mb-2 text-lg font-semibold">
              Enrolled Students
            </Text>
            {isFetchingStudentDetails ? (
              <Text>Loading enrolled students...</Text>
            ) : (
              <View className="space-y-2">
                {studentDetails?.data?.map((student: studentDetails) => (
                  <Text key={student._id} className="text-gray-700">
                    {student.firstName} {student.lastName} ({student.email})
                  </Text>
                ))}
                {studentDetails?.data?.length === 0 && (
                  <Text className="text-gray-500">
                    No students enrolled yet.
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
