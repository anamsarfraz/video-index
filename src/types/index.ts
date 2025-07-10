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

export interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  videoSnippet?: {
    start: number;
    end: number;
  };
  feedback?: "like" | "dislike";
  feedbackText?: string;
  feedbackCategory?: string;
  timestamp: Date;
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
