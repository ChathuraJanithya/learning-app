import React from "react";
import { TextInput, Text, View } from "react-native";

type InputFieldType = "text" | "email" | "password" | "phone" | "numeric";

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  label?: string;
  type?: InputFieldType;
  multiline?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChangeText,
  onBlur,
  placeholder = "",
  error,
  label,
  type = "text",
  multiline = false,
}) => {
  function getType(type: string) {
    switch (type) {
      case "email":
        return "email-address";
      case "phone":
        return "phone-pad";
      default:
        return "default";
    }
  }

  return (
    <View className="flex flex-col gap-2">
      {label && (
        <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      )}
      <TextInput
        className={`block w-full px-2 py-3 border rounded-xl bg-gray-50 focus:outline-none text-start
          focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-colors
          ${error ? "border-red-300" : "border-gray-200"}`}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={getType(type)}
        secureTextEntry={type === "password"}
        multiline={multiline}
      />
      {error ? <Text className="mt-1 text-red-500">{error}</Text> : null}
    </View>
  );
};

export default InputField;
