import { Pod, PodResponseData, QueryResponse } from "../types";

import axios from "axios";

const API_BASE_URL = "https://api.videoindex.app";

export const getPods = async (): Promise<Pod[]> => {
  const response = await axios.get<Pod[]>(
    `https://api.videoindex.app/knowledge-bases`
  );
  console.log("Pods fetched: ", response.data);
  return response.data;
};

export const getPodById = async (id: string): Promise<PodResponseData> => {
  const response = await axios.get<PodResponseData>(
    `${API_BASE_URL}/knowledge-bases/${id}`
  );
  console.log("Pod fetched: ", response.data);
  return response.data;
};

export const queryPodStreaming = async (
  knowledge_base_id: string,
  query: string,
  onChunk: (chunk: QueryResponse) => void,
  max_results: number = 5
): Promise<void> => {
  console.log("Streaming query for pod with ID:", knowledge_base_id, "and query:", query);
  
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
    throw new Error('No response body reader available');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        // Process any remaining complete JSON in buffer before breaking
        if (buffer.trim()) {
          const lines = buffer.trim().split('\n');
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine && trimmedLine.startsWith('{') && trimmedLine.endsWith('}')) {
              try {
                const chunk = JSON.parse(trimmedLine) as QueryResponse;
                console.log("Received final streaming chunk:", chunk);
                onChunk(chunk);
              } catch (parseError) {
                console.warn("Failed to parse final chunk:", trimmedLine, parseError);
              }
            }
          }
        }
        break;
      }

      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });
      
      // Look for complete JSON objects in the buffer
      let processedUpTo = 0;
      let braceCount = 0;
      let inString = false;
      let escapeNext = false;
      let jsonStart = -1;
      
      for (let i = 0; i < buffer.length; i++) {
        const char = buffer[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\' && inString) {
          escapeNext = true;
          continue;
        }
        
        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') {
            if (braceCount === 0) {
              jsonStart = i;
            }
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            
            // Found complete JSON object
            if (braceCount === 0 && jsonStart !== -1) {
              const jsonStr = buffer.substring(jsonStart, i + 1);
              
              try {
                const chunk = JSON.parse(jsonStr) as QueryResponse;
                console.log("Received streaming chunk:", chunk);
                
                // Only call onChunk if there's actual response content
                if (chunk.response !== undefined) {
                  onChunk(chunk);
                }
                
                processedUpTo = i + 1;
                jsonStart = -1;
              } catch (parseError) {
                console.warn("Failed to parse JSON chunk:", jsonStr, parseError);
                // Reset and continue looking for next valid JSON
                braceCount = 0;
                jsonStart = -1;
              }
            }
          }
        }
      }
      
      // Remove processed data from buffer, keep unprocessed data
      if (processedUpTo > 0) {
        buffer = buffer.substring(processedUpTo).trim();
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
