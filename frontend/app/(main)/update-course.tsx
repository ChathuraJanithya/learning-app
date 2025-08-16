import { z } from "zod";
import { useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/ui/InputField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CourseService from "@/services/course-service";
import { Course } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useCourseContext } from "@/context/CourseContext";
import { useRouter } from "expo-router";

export const courseSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 characters"),
  description: z.string().min(1, "Description must be at least 1 characters"),
  duration: z.number({}).positive("Duration must be greater than 0"),
  content: z.string().min(1, "Content must be at least 1 characters"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function UpdateCourse() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { courses } = useCourseContext();
  const { courseId } = useLocalSearchParams();

  const courseToUpdate = courses?.data?.find(
    (course) => course._id === courseId
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: courseToUpdate?.title || "",
      description: courseToUpdate?.description || "",
      duration: courseToUpdate?.duration || 0,
      content: courseToUpdate?.content || "",
    },
  });

  useEffect(() => {
    if (courseToUpdate) {
      reset({
        title: courseToUpdate.title,
        description: courseToUpdate.description,
        duration: courseToUpdate.duration,
        content: courseToUpdate.content,
      });
    }
  }, [courseToUpdate, reset]);

  const { mutate: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: (data: Course) =>
      CourseService.updateCourse(courseId as string, data),
    onSuccess: () => {
      alert("Course updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["allCourses"] });
      queryClient.invalidateQueries({ queryKey: ["coursesforinstructor"] });
      router.replace("/instructor-courses");
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
    },
  });

  const onSubmit = (data: CourseFormValues) => {
    updateMutation(data);
  };

  return (
    <ScrollView className="flex-1 w-full h-full bg-white">
      <Text className="p-4 text-2xl font-medium text-gray-800">
        Update Course : {courseToUpdate?.title}
      </Text>
      <KeyboardAvoidingView className="flex flex-col h-full gap-3 p-4 space-y-4">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              placeholder="Enter course title"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.title?.message}
              label="Course Title"
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              placeholder="Enter course description"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.description?.message}
              label="Description"
            />
          )}
        />

        {/* Duration */}
        <Controller
          name="duration"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              placeholder="Enter duration in hours"
              value={field.value.toString()}
              onChangeText={(text) => field.onChange(Number(text))}
              onBlur={field.onBlur}
              error={errors.duration?.message}
              label="Duration (in hours)"
              type="numeric"
            />
          )}
        />

        {/* Content */}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              placeholder="Enter course content"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.content?.message}
              label="Content"
            />
          )}
        />

        <TouchableOpacity
          className={`mt-8 bg-black rounded-xl py-4 ${isUpdating ? "opacity-70" : ""}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isUpdating}
        >
          <Text className="text-base font-semibold text-center text-white">
            {isUpdating ? "Updating Course..." : "Update Course"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
