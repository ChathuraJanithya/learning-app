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
import { Eye, EyeOff, Mail, Lock } from "lucide-react-native";
import { Link } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { LoggingUser } from "@/types";
import { AuthService } from "@/services/auth-service";
import { useAuth } from "@/context/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const { handleLoginState } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: loginMutation, isPending: isLoading } = useMutation({
    mutationFn: (data: LoggingUser) => AuthService.login(data),
    onSuccess: (response) => {
      const user = handleLoginState(response);
      console.log(user);
      router.replace("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      alert("Login Failed");
    },
  });

  const handleLogin = () => {
    const data = {
      email,
      password,
    };
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
          <View className="space-y-6">
            {/* Email Input */}
            <View>
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Email Address
              </Text>
              <View className="relative">
                <View className="absolute z-10 left-4 top-4">
                  <Mail size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="w-full px-12 py-4 text-base text-gray-900 border border-gray-200 bg-gray-50 rounded-xl focus:border-blue-500 focus:bg-white"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View>
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Password
              </Text>
              <View className="relative">
                <View className="absolute z-10 left-4 top-4">
                  <Lock size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="w-full px-12 py-4 pr-12 text-base text-gray-900 border border-gray-200 bg-gray-50 rounded-xl focus:border-blue-500 focus:bg-white"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="self-end">
              <Text className="text-sm font-medium text-blue-600">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className={`mt-8 bg-black rounded-xl py-4 ${isLoading ? "opacity-70" : ""}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-base font-semibold text-center text-white">
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>
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
