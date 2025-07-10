import { Pod, PodResponseData } from "../types";

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
