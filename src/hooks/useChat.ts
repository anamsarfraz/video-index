import { useState, useCallback } from "react";
import { ChatMessage } from "../types";
import { queryPodStreaming, submitQueryFeedback } from "./usePod";

export const useChat = (id: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim()) return;

      const userMessage: ChatMessage = {
        type: "user",
        question,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Create a placeholder AI message that will be updated with streaming content
      const aiMessageId = `assistant-${Date.now()}`;
      const initialAiMessage: ChatMessage = {
        id: aiMessageId,
        type: "ai",
        answer: "",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, initialAiMessage]);
      try {
        await queryPodStreaming(id, question, (chunk) => {
          // Update the AI message with streaming content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    answer: chunk.response,
                    videoPath: chunk.video_path,
                    timestamp: chunk.start_time.toString(),
                  }
                : msg
            )
          );
        });
      } catch (error) {
        console.error("Error querying knowledge base:", error);
        
        // Update the placeholder message with error content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  answer: "I'm sorry, I encountered an error while processing your question. Please try again.",
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [id]
  );

  const submitFeedback = useCallback(
    async (
      messageId: string,
      feedback: "like" | "dislike",
      feedbackText?: string,
      category?: string
    ) => {
      const message = messages.find((msg) => msg.id === messageId);

      // Handle cases where required data might be missing
      if (!message) {
        console.error("Message not found for feedback");
        return;
      }

      // Default to pod ID if knowledgeBaseId is missing
      const knowledgeBaseId = message.knowledgeBaseId || id;

      // Get original question if available
      const originalQuestion = message.question || "Unknown question";

      // Optimistically update UI
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                feedback,
                feedbackComment: feedbackText,
                feedbackCategory: category,
              }
            : msg
        )
      );

      try {
        const feedbackData = {
          knowledge_base_id: parseInt(knowledgeBaseId, 10),
          query: originalQuestion,
          response: message.answer || "",
          thumbs_up: feedback === "like",
          comments: feedbackText,
          category: category,
        };

        await submitQueryFeedback(feedbackData);
        console.log("Feedback submitted successfully");
      } catch (error) {
        console.error("Failed to submit feedback:", error);

        // Revert UI changes on error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, feedback: undefined, feedbackComment: undefined }
              : msg
          )
        );
      }
    },
    [messages, id]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    submitFeedback,
    clearChat,
  };
};
