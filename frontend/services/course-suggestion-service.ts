// Fetch-based SSE implementation (more reliable than EventSource in React Native)
import { BASE_URL } from "@/constants/server";
import AsyncStorage from "@react-native-async-storage/async-storage";

const activeControllers = new Map<string, AbortController>();

export const getCourseSuggestionsFetch = async (
  prompt: string,
  onMessage: (data: string) => void,
  onEnd: () => void,
  onError: (error: any) => void
) => {
  const requestId = Date.now().toString();
  console.log(`[${requestId}] Starting fetch-based SSE request`);

  // Cancel any existing requests
  activeControllers.forEach((controller, id) => {
    console.log(`[${requestId}] Aborting existing request: ${id}`);
    controller.abort();
  });
  activeControllers.clear();

  // Create new abort controller
  const abortController = new AbortController();
  activeControllers.set(requestId, abortController);

  try {
    const userDetails = await AsyncStorage.getItem("user");
    const { token } = userDetails ? JSON.parse(userDetails) : {};

    if (!token) {
      onError("Authentication token not found");
      return null;
    }

    const url = `${BASE_URL}/course-suggestion/stream?prompt=${encodeURIComponent(prompt)}`;
    console.log(`[${requestId}] Fetching URL:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
      signal: abortController.signal,
    });

    console.log(`[${requestId}] Response status:`, response.status);
    console.log(`[${requestId}] Response headers:`, response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] HTTP Error ${response.status}:`, errorText);
      activeControllers.delete(requestId);
      onError(`Server error: ${response.status} - ${errorText}`);
      return null;
    }

    // React Native fetch doesn't support streaming response.body
    // Use text() method and parse manually
    console.log(`[${requestId}] Reading response as text...`);

    let responseText = "";
    let messageCount = 0;

    try {
      responseText = await response.text();
      console.log(`[${requestId}] Full response text:`, responseText);

      if (!responseText || responseText.trim() === "") {
        activeControllers.delete(requestId);
        onError("Empty response from server");
        return null;
      }

      // Process the complete SSE response
      const lines = responseText.split("\n");
      let buffer = "";

      for (const line of lines) {
        console.log(`[${requestId}] Processing line:`, JSON.stringify(line));

        if (line.startsWith("data: ")) {
          try {
            const jsonData = line.substring(6).trim();

            if (jsonData === "") {
              console.log(`[${requestId}] Empty data line, skipping`);
              continue;
            }

            console.log(`[${requestId}] JSON data:`, jsonData);
            const parsed = JSON.parse(jsonData);
            console.log(`[${requestId}] Parsed data:`, parsed);

            if (parsed.type === "connected") {
              console.log(`[${requestId}] Connection confirmed by server`);
              continue;
            }

            if (parsed.content) {
              messageCount++;
              console.log(
                `[${requestId}] Message ${messageCount}:`,
                parsed.content
              );
              onMessage(parsed.content);
            }
          } catch (parseError) {
            console.error(
              `[${requestId}] JSON parse error:`,
              parseError,
              "for data:",
              line
            );
          }
        } else if (line.startsWith("event: end")) {
          console.log(`[${requestId}] End event received`);
          activeControllers.delete(requestId);
          onEnd();
          return null;
        }
      }

      // If we processed messages but didn't get explicit end event
      console.log(`[${requestId}] Processed ${messageCount} messages`);
      activeControllers.delete(requestId);

      if (messageCount > 0) {
        onEnd();
      } else {
        onError("No content received from server");
      }
    } catch (textError) {
      console.error(`[${requestId}] Error reading response text:`, textError);
      activeControllers.delete(requestId);

      //@ts-ignore
      if (textError.name === "AbortError") {
        console.log(`[${requestId}] Request was cancelled`);
      } else {
        //@ts-ignore
        onError(`Failed to read response: ${textError.message}`);
      }
    }
  } catch (error: any) {
    console.error(`[${requestId}] Request failed:`, error);
    activeControllers.delete(requestId);

    if (error.name === "AbortError") {
      console.log(`[${requestId}] Request was cancelled`);
    } else {
      onError(`Request failed: ${error.message}`);
    }
  }

  return {
    close: () => {
      console.log(`[${requestId}] Manual close requested`);
      abortController.abort();
      activeControllers.delete(requestId);
    },
  };
};

// Utility function to clean up all connections
export const closeAllFetchConnections = () => {
  console.log(`Aborting ${activeControllers.size} active requests`);
  activeControllers.forEach((controller, id) => {
    console.log(`Aborting request: ${id}`);
    controller.abort();
  });
  activeControllers.clear();
};
