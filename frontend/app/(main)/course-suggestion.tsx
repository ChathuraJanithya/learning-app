// Example usage in a React Native component
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Alert } from "react-native";
import {
  getCourseSuggestionsFetch,
  closeAllFetchConnections,
} from "@/services/course-suggestion-service";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

const CourseSuggestionComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const connectionRef = useRef<any>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeAllFetchConnections();
    };
  }, []);

  const handleGetSuggestion = async () => {
    if (!prompt.trim()) {
      Alert.alert("Error", "Please enter a prompt");
      return;
    }

    if (isLoading) {
      Alert.alert("Info", "Request already in progress");
      return;
    }

    setIsLoading(true);
    setSuggestion("");

    try {
      connectionRef.current = await getCourseSuggestionsFetch(
        prompt,
        (content) => {
          // Append new content
          setSuggestion((prev) => prev + content);
        },
        () => {
          // Stream ended
          setIsLoading(false);
          console.log("Suggestion completed");
        },
        (error) => {
          // Handle error
          setIsLoading(false);
          Alert.alert("Error", error);
          console.error("Stream error:", error);
        }
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Failed to get suggestions");
    }
  };

  const handleCancel = () => {
    if (connectionRef.current) {
      connectionRef.current.close();
    }
    setIsLoading(false);
  };

  return (
    <View className="flex-1 w-full p-4 bg-white ">
      <InputField
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Enter your career question..."
        multiline
      />

      <Button
        onPress={isLoading ? handleCancel : handleGetSuggestion}
        isLoading={isLoading}
        styles=" mt-4"
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {isLoading ? "Cancel" : "Get Suggestion"}
        </Text>
      </Button>

      {suggestion && (
        <View
          className="p-4 mt-4 bg-gray-100 rounded-lg"
          style={{ maxHeight: 200, overflowY: "scroll" }}
        >
          <Text>{suggestion}</Text>
        </View>
      )}

      {isLoading && (
        <Text className="mt-2 text-center text-gray-500 animate-pulse">
          Getting suggestion...
        </Text>
      )}
    </View>
  );
};

export default CourseSuggestionComponent;
