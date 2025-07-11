import { useState, useCallback } from "react";
import { ChatMessage } from "../types";
import { queryPod } from "./usePod";

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

      try {
        const response = await queryPod(id, question);
        const aiResponse: ChatMessage = {
          id: `assistant-${Date.now()}`,
          type: "ai",
          answer: response.response,
          videoPath: response.video_path,
          timestamp: response.start_time,
        };

        setMessages((prev) => [...prev, aiResponse]);
      } catch (error) {
        console.error("Error querying knowledge base:", error);
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          type: "ai",
          answer:
            "I'm sorry, I encountered an error while processing your question. Please try again.",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [id]
  );

  // const submitFeedback = useCallback(
  //   async (
  //     messageId: string,
  //     feedback: "positive" | "negative",
  //     comment?: string
  //   ) => {
  //     // Find the message to get the required data
  //     const message = messages.find((msg) => msg.id === messageId);
  //     if (
  //       !message ||
  //       message.type !== "assistant" ||
  //       !message.originalQuery ||
  //       !message.knowledgeBaseId
  //     ) {
  //       console.error("Cannot submit feedback: missing required message data", {
  //         messageFound: !!message,
  //         isAssistant: message?.type === "assistant",
  //         hasOriginalQuery: !!message?.originalQuery,
  //         hasKnowledgeBaseId: !!message?.knowledgeBaseId,
  //         message: message,
  //       });
  //       return;
  //     }

  //     // Optimistically update UI
  //     setMessages((prev) =>
  //       prev.map((msg) =>
  //         msg.id === messageId
  //           ? { ...msg, feedback, feedbackComment: comment }
  //           : msg
  //       )
  //     );

  //     try {
  //       // Prepare the feedback data with proper validation
  //       const feedbackData = {
  //         knowledge_base_id: parseInt(message.knowledgeBaseId, 10), // Convert to integer
  //         query: message.originalQuery,
  //         response: message.content,
  //         thumbs_up: feedback === "positive", // Required boolean field
  //         // Only include comments if provided and not empty
  //         ...(comment && comment.trim() && { comments: comment.trim() }),
  //       };

  //       // Validate the knowledge_base_id is a valid integer
  //       if (isNaN(feedbackData.knowledge_base_id)) {
  //         throw new Error(
  //           `Invalid knowledge base ID: ${message.knowledgeBaseId}`
  //         );
  //       }

  //       console.log("Submitting feedback with data:", feedbackData);

  //       // Submit feedback to API
  //       const result = await submitQueryFeedback(feedbackData);

  //       if (result.success) {
  //         console.log("Query feedback submitted successfully");
  //         // Show success message (you could add a toast notification here)
  //       } else {
  //         throw new Error(result.message);
  //       }
  //     } catch (error) {
  //       console.error("Failed to submit query feedback:", error);

  //       // Revert UI changes on error
  //       setMessages((prev) =>
  //         prev.map((msg) =>
  //           msg.id === messageId
  //             ? { ...msg, feedback: undefined, feedbackComment: undefined }
  //             : msg
  //         )
  //       );

  //       // You could show an error toast here
  //       alert("Failed to submit feedback. Please try again.");
  //     }
  //   },
  //   [messages]
  // );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    addFeedback: () => {}, // Placeholder for feedback function
    clearChat,
  };
};
