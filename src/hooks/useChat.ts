import { useState } from "react";
import { ChatMessage } from "../types";
import { queryPod } from "./usePod";

export const useChat = (id: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (question: string) => {
    if (!question.trim()) return;

    setIsLoading(true);

    const response = await queryPod(id, question);

    const aiResponse: ChatMessage = {
      question: response.query,
      answer: response.response,
      videoPath: response.video_path,
      timestamp: response.start_time,
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsLoading(false);
  };

  const addFeedback = (
    messageId: string,
    feedback: "like" | "dislike",
    feedbackText?: string,
    category?: string
  ) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              feedback,
              ...(feedbackText && { feedbackText }),
              ...(category && { feedbackCategory: category }),
            }
          : msg
      )
    );

    // Log feedback for analytics (in real app, this would be sent to backend)
    if (feedback === "dislike" && (feedbackText || category)) {
      console.log("Negative feedback received:", {
        messageId,
        category,
        feedbackText,
        timestamp: new Date(),
      });
    }
  };

  return {
    messages,
    sendMessage,
    addFeedback,
    isLoading,
  };
};
