import { Pod, PodResponseData, QueryResponse } from "../types";

import axios from "axios";

const API_BASE_URL = "https://api.videoindex.app";

export const getPods = async (): Promise<Pod[]> => {
  const response = await axios.get<Pod[]>(
    `https://api.videoindex.app/knowledge-bases`,
    {
      withCredentials: true,
    }
  );
  console.log("Pods fetched: ", response.data);
  return response.data;
};

export const getPodById = async (id: string): Promise<PodResponseData> => {
  try {
    const response = await axios.get<PodResponseData>(
      `${API_BASE_URL}/knowledge-bases/${id}`
    );
    console.log("Pod fetched: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching pod by ID:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Pod not found");
      }
      throw new Error(
        `Failed to fetch pod: ${error.response?.statusText || error.message}`
      );
    }
    throw new Error("Failed to fetch pod");
  }
};

export const queryPodStreaming = async (
  knowledge_base_id: string,
  query: string,
  onChunk: (chunk: QueryResponse) => void,
  max_results: number = 5
): Promise<void> => {
  console.log(
    "Streaming query for pod with ID:",
    knowledge_base_id,
    "and query:",
    query
  );

  const response = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      knowledge_base_id: Number(knowledge_base_id),
      query,
      max_results,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body reader available");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines (JSON objects separated by newlines)
      const lines = buffer.split("\n");

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || "";

      // Process each complete line
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          try {
            const chunk = JSON.parse(trimmedLine) as QueryResponse;
            console.log("Received streaming chunk:", chunk);
            onChunk(chunk);
          } catch (parseError) {
            console.warn(
              "Failed to parse JSON chunk:",
              trimmedLine,
              parseError
            );
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};
export const queryPod = async (
  knowledge_base_id: string,
  query: string,
  max_results: number = 5
): Promise<QueryResponse> => {
  console.log("Querying pod with ID:", knowledge_base_id, "and query:", query);
  const response = await axios.post<QueryResponse>(`${API_BASE_URL}/query`, {
    knowledge_base_id: Number(knowledge_base_id),
    query,
    max_results,
  });
  console.log("Pod query result: ", response.data);
  return response.data;
};

export const submitQueryFeedback = async (feedbackData: {
  knowledge_base_id: number;
  query: string;
  response: string;
  thumbs_up: boolean;
  comments?: string;
}): Promise<{ success: boolean }> => {
  console.log("Submitting feedback with data:", feedbackData);
  const response = await axios.post(
    `${API_BASE_URL}/query-feedback`,
    feedbackData
  );
  console.log("Feedback submission result: ", response.data);
  return { success: response.data.success };
};
