import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Lock,
  ChevronDown,
  UserCheck,
  GraduationCap,
  BookOpen,
} from "lucide-react-native";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { Link } from "expo-router";
import InputField from "@/components/ui/InputField";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { SignUpUser } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { AuthService } from "@/services/auth-service";

// Zod validation schema
const signupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  contact: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number must be less than 15 digits")
    .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z
    .string()
    .refine(
      (val) =>
        ["689ad8b781797dc972c845cd", "689ad8ac81797dc972c845ca"].includes(val),
      {
        message: "Please select a role",
      }
    ),
});

type SignupFormData = z.infer<typeof signupSchema>;

const roleOptions = [
  { value: "689ad8b781797dc972c845cd", Text: "Student", icon: BookOpen },
  {
    value: "689ad8ac81797dc972c845ca",
    Text: "Instructor",
    icon: GraduationCap,
  },
];

export default function SignUp() {
  const router = useRouter();
  const { handleLoginState } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const { mutate: signupMutation, isPending: isLoading } = useMutation({
    mutationFn: (data: SignUpUser) => AuthService.signup(data),
    onSuccess: (response) => {
      const user = handleLoginState(response);
      console.log(user);
      reset();
      router.replace("/dashboard");
    },
    onError: (error) => {
      alert("Login Failed");
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignupFormData) => {
    signupMutation(data);
  };

  const handleRoleSelect = (roleValue: "student" | "instructor") => {
    setValue("role", roleValue);
    setShowRoleDropdown(false);
    trigger("role");
  };

  const getSelectedRoleOption = () => {
    return roleOptions.find((option) => option.value === selectedRole);
  };

  return (
    <SafeAreaView className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <ScrollView className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        {/* Header */}
        <View className="mb-8 text-center">
          <View className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-600">
            <UserCheck className="w-8 h-8 text-white" />
          </View>
          <Text className="mb-3 text-3xl font-bold text-gray-900">
            Create Account
          </Text>
          <Text className="text-gray-600">
            Join us and start your learning journey
          </Text>
        </View>

        {/* Form */}
        <KeyboardAvoidingView className="flex flex-col gap-3">
          {/* First Name */}
          <Controller
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="Your First Name"
                error={errors.firstName?.message}
                label="First Name"
              />
            )}
            name="firstName"
            rules={{ required: "You must enter your first name" }}
          />

          {/* Last Name */}
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="Your Last Name"
                error={errors.lastName?.message}
                label="Last Name"
              />
            )}
            rules={{ required: "You must enter your last name" }}
          />

          {/* Contact */}
          <Controller
            name="contact"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="Enter your phone number"
                label="Contact"
              />
            )}
            rules={{ required: "You must enter your Contacts" }}
          />

          {/* Email */}

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                placeholder="Enter your email"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.email?.message}
                label="Email"
              />
            )}
          />

          {/* Role Dropdown */}
          <View>
            <Text className="block mb-3 text-sm font-medium text-gray-700">
              I am a
            </Text>
            <View className="relative">
              <TouchableOpacity
                onPress={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`w-full flex items-center justify-between px-4 py-3.5 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-colors ${
                  errors.role ? "border-red-300" : "border-gray-200"
                }`}
              >
                {selectedRole ? (
                  <View className="flex flex-row items-center justify-between w-full">
                    {(() => {
                      const option = getSelectedRoleOption();
                      const IconComponent = option?.icon;
                      return (
                        <View className="flex flex-row items-center gap-3">
                          {IconComponent && (
                            <IconComponent className="w-5 h-5 mr-3 text-blue-600" />
                          )}
                          <Text className="text-gray-900">{option?.Text}</Text>
                        </View>
                      );
                    })()}
                    <ChevronDown
                      className={` text-gray-400 transition-transform ${showRoleDropdown ? "rotate-180" : ""}`}
                      size={20}
                    />
                  </View>
                ) : (
                  <Text className="text-gray-500">Select your role</Text>
                )}
              </TouchableOpacity>

              {showRoleDropdown && (
                <View className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-200 shadow-lg top-full rounded-xl">
                  {roleOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <TouchableOpacity
                        key={option.value}
                        /* @ts-ignore */
                        onPress={() => handleRoleSelect(option.value)}
                        className="flex items-center w-full px-4 py-3 transition-colors hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl"
                      >
                        <IconComponent className="w-5 h-5 mr-3 text-blue-600" />
                        <Text className="text-gray-900">{option.Text}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
            {errors.role && (
              <Text className="mt-1 text-sm text-red-600">
                {errors.role.message}
              </Text>
            )}
          </View>

          {/* Password */}
          <View>
            <Text className="block mb-3 text-sm font-medium text-gray-700">
              Password
            </Text>
            <View className="relative">
              <View className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </View>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    className={`block w-full py-3  px-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-colors ${
                      errors.password ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="Create a strong password"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <TouchableOpacity
                className="absolute right-4 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* Submit TouchableOpacity */}
          <TouchableOpacity
            className={`mt-8 bg-black rounded-xl py-4 ${isLoading ? "opacity-70" : ""}`}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <Text className="text-base font-semibold text-center text-white">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>

        {/* Sign In Link */}
        <View className="flex flex-row items-center justify-center my-6 text-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <Link href="/sign-in">
            <Text className="font-medium text-blue-600">Sign In</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
