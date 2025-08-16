import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
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

// Zod validation schema
const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters"),
  contact: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number must be less than 15 digits")
    .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must be less than 255 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z
    .string()
    .refine((val) => ["12414124112", "2141241241"].includes(val), {
      message: "Please select a role",
    }),
});

type SignupFormData = z.infer<typeof signupSchema>;

const roleOptions = [
  { value: "12414124112", Text: "Student", icon: BookOpen },
  { value: "2141241241", Text: "Instructor", icon: GraduationCap },
];

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const selectedRole = watch("role");

  console.log("errors", errors);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    console.log("Form Data:", data);
    try {
      console.log("Signup Data:", data);
      // Add your signup API call here
      // await signupAPI(data);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        alert("Account created successfully!");
        reset();
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error("Signup error:", error);
    }
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
        <KeyboardAvoidingView className="flex flex-col gap-3 space-y-5">
          {/* First Name */}
          <View>
            <Text className="block mb-3 text-sm font-medium text-gray-700">
              First Name
            </Text>
            <View className="relative">
              <View className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </View>
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    className={`block w-full  px-2 py-3 border rounded-xl bg-gray-50 focus:outline-none text-start focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-colors ${
                      errors.firstName ? "border-red-300" : "border-gray-200"
                    }`}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Your First Name"
                  />
                )}
                name="firstName"
                rules={{ required: "You must enter your first name" }}
              />
            </View>
            {errors.firstName && (
              <Text className="mt-1 text-sm text-red-600">
                {errors.firstName.message}
              </Text>
            )}
          </View>

          {/* Last Name */}
          <View>
            <Text className="block mb-3 text-sm font-medium text-gray-700">
              Last Name
            </Text>
            <View className="">
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    className={`block w-full  px-2 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-colors ${
                      errors.lastName ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="Enter your last name"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </View>
            {errors.lastName && (
              <Text className="mt-1 text-sm text-red-600">
                {errors.lastName.message}
              </Text>
            )}
          </View>

          {/* Contact */}
          <View>
            <Text className="block mb-3 text-sm font-medium text-gray-700">
              Contact Number
            </Text>
            <View className="relative">
              <View className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Phone className="w-5 h-5 text-gray-400" />
              </View>
              <Controller
                name="contact"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    className={`block w-full  px-2 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-colors ${
                      errors.contact ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="Enter your phone number"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </View>
            {errors.contact && (
              <Text className="mt-1 text-sm text-red-600">
                {errors.contact.message}
              </Text>
            )}
          </View>

          {/* Email */}
          <View>
            <Text className="block mb-3 text-sm font-medium text-gray-700">
              Email Address
            </Text>
            <View className="relative">
              <View className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </View>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    className={`block w-full  px-2 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-colors ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="Enter your email"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </View>
            {errors.email && (
              <Text className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </Text>
            )}
          </View>

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
