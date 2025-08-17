import React from "react";
import { TouchableOpacity } from "react-native";

type ButtonProps = {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  styles?: string;
  isLoading?: boolean;
};

export default function Button({
  children,
  onPress,
  isLoading,
  disabled,
  styles,
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-black rounded-xl py-4 ${isLoading ? "opacity-70" : ""} ${styles}`}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
}
