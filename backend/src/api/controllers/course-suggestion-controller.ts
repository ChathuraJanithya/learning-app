// Fixed backend implementation
import { Response } from "express";
import { AuthRequest } from "@/interfaces";
import { openai } from "@/config/open-ai";
import logger from "@/utils/logger";

export const streamCourseSuggestions = async (
  req: AuthRequest,
  res: Response
) => {
  const prompt = req.query.prompt as string;
  logger.info("Received prompt:", prompt);

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Cache-Control");
  res.flushHeaders();

  let streamClosed = false;

  // Handle client disconnect
  req.on("close", () => {
    streamClosed = true;
    logger.info("Client disconnected, closing stream");
  });

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      max_tokens: 100,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful career advisor. Give a concise suggestion using the following format: 'I suggest you...' Keep your response under 150 words.",
        },
        { role: "user", content: prompt },
      ],
    });

    logger.info("SSE stream started");
    let hasContent = false;

    for await (const chunk of stream) {
      // Check if client disconnected
      if (streamClosed) {
        break;
      }

      const content = chunk.choices[0]?.delta?.content || "";
      console.log("Received chunk:", content);

      if (content) {
        hasContent = true;
        // Send data only if connection is still alive
        if (!res.destroyed && !streamClosed) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Check if stream is finished
      if (
        chunk.choices[0]?.finish_reason === "stop" ||
        chunk.choices[0]?.finish_reason === "length"
      ) {
        break;
      }
    }

    // Only send end event if we haven't closed and have content
    if (!streamClosed && !res.destroyed && hasContent) {
      res.write(
        `event: end\ndata: ${JSON.stringify({
          message: "Stream completed",
        })}\n\n`
      );
    }

    res.end();
    logger.info("SSE stream ended successfully");
  } catch (error: any) {
    logger.error("Error in SSE stream:", error);

    if (!streamClosed && !res.destroyed) {
      res.write(
        `event: error\ndata: ${JSON.stringify({
          error: error.message || "Internal server error",
        })}\n\n`
      );
    }

    if (!res.destroyed) {
      res.end();
    }
  }
};
