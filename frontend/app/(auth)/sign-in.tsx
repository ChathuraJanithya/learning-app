import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import { useRouter } from "expo-router";

import { LoggingUser } from "@/types";

import { useAuth } from "@/context/AuthContext";
import { AuthService } from "@/services/auth-service";

import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";

import { Eye, EyeOff, Lock } from "lucide-react-native";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
  const router = useRouter();
  const { handleLoginState } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: loginMutation, isPending: isLoading } = useMutation({
    mutationFn: (data: LoggingUser) => AuthService.login(data),
    onSuccess: (response) => {
      const user = handleLoginState(response);
      console.log(user);
      router.replace("/all-courses");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      alert("Login Failed");
      setError("Login Failed");
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LoggingUser>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const handleLogin = (data: LoggingUser) => {
    setError(null);
    loginMutation(data);
  };

  return (
    <SafeAreaView className="flex justify-center h-full bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-col"
      >
        <View className="flex-col px-6">
          {/* Header */}
          <View className="mb-12">
            <Text className="mb-2 text-3xl font-bold text-gray-900">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-600">
              Sign in to your account to continue
            </Text>
          </View>

          {/* Form */}
          <View className="flex flex-col gap-3 space-y-6">
            {/* Email Input */}

            <Controller
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Your First Name"
                  error={errors.email?.message}
                  label="Email"
                />
              )}
              name="email"
              rules={{ required: "You must enter your email" }}
            />

            {/* Password Input */}
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

            {/* Forgot Password */}
            <TouchableOpacity className="self-end">
              <Text className="text-sm font-medium text-blue-600">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {error && <Text className="mt-1 text-sm text-red-600">{error}</Text>}

          {/* Login Button */}
          <Button
            styles={"mt-8 "}
            onPress={handleSubmit(handleLogin)}
            disabled={isLoading || !isDirty}
          >
            <Text className="text-base font-semibold text-center text-white">
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </Button>
        </View>
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600">Don't have an account? </Text>
          <TouchableOpacity>
            <Link href="/sign-up">
              <Text className="font-medium text-blue-600">Sign Up</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
