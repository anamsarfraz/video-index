export interface Pod {
  id: string;
  title: string;
  tags: string[];
  image: string;
  //description: string;
  //thumbnail: string;
  //category: string;
  //urls: string[];
  //createdAt: Date;
  //interactions: number;
  //followers: number;
  //status: 'ready' | 'processing' | 'uploading' | 'error';
  //isFollowing?: boolean;
}

export interface PodResponseData {
  id: string;
  title: string;
  tags: string[];
  image: string;
  video_path: string;
  introduction: string;
}

export interface QueryResponse {
  knowledge_base: string;
  query: string;
  response: string;
  video_path: string;
  image_path: string[];
  start_time: string;
  end_time: string;
}

export interface ChatMessage {
  id?: string;
  knowledgeBaseId?: string;
  type: "user" | "ai";
  question?: string;
  answer?: string;
  videoPath?: string;
  feedback?: "like" | "dislike";
  feedbackText?: string;
  feedbackCategory?: string;
  timestamp: string;
  videoTimestamp?: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface CreatePodFormData {
  title: string;
  description: string;
  urls: string[];
}
