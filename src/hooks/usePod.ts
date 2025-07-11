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
