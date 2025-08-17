import { z } from "zod";
import {
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Course } from "@/types";
import CourseService from "@/services/course-service";

import InputField from "@/components/ui/InputField";

export const courseSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 characters"),
  description: z.string().min(1, "Description must be at least 1 characters"),
  duration: z.number({}).positive("Duration must be greater than 0"),
  content: z.string().min(1, "Content must be at least 1 characters"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CreateCourse() {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 0,
      content: "",
    },
  });

  const { mutate: createCourseMutation, isPending: isCreating } = useMutation({
    mutationFn: (data: Course) => CourseService.createCourse(data),
    onSuccess: () => {
      alert("Course created successfully!");
      queryClient.invalidateQueries({ queryKey: ["allCourses"] });
      queryClient.invalidateQueries({ queryKey: ["coursesforinstructor"] });
      reset();
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
    },
  });

  const onSubmit = (data: CourseFormValues) => {
    createCourseMutation(data);
  };

  return (
    <ScrollView className="flex-1 w-full h-full bg-white">
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
          className={`mt-8 bg-black rounded-xl py-4 ${isCreating ? "opacity-70" : ""}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isCreating}
        >
          <Text className="text-base font-semibold text-center text-white">
            {isCreating ? "Creating Course..." : "Create Course"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
