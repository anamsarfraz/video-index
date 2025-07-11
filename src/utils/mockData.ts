import { Pod, ChatMessage } from "../types";

export const mockPods: Pod[] = [
  {
    id: "1",
    title: "Advanced React Patterns and Best Practices",
    description:
      "Learn modern React patterns including hooks, context, and performance optimization techniques.",
    thumbnail:
      "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "React",
    urls: [
      "https://www.youtube.com/watch?v=example1",
      "https://www.youtube.com/watch?v=example2",
    ],
    createdAt: new Date("2024-01-15"),
    interactions: 142,
    followers: 89,
    status: "ready",
    isFollowing: false,
  },
  {
    id: "2",
    title: "TypeScript for Modern Web Development",
    description:
      "Master TypeScript fundamentals and advanced features for building scalable applications.",
    thumbnail:
      "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "TypeScript",
    urls: ["https://www.youtube.com/watch?v=example3"],
    createdAt: new Date("2024-01-10"),
    interactions: 89,
    followers: 156,
    status: "processing",
    isFollowing: true,
  },
  {
    id: "3",
    title: "Node.js Backend Architecture",
    description:
      "Build scalable backend services with Node.js, Express, and modern database patterns.",
    thumbnail:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Node.js",
    urls: [
      "https://www.youtube.com/watch?v=example4",
      "https://www.youtube.com/watch?v=example5",
    ],
    createdAt: new Date("2024-01-08"),
    interactions: 203,
    followers: 234,
    status: "ready",
    isFollowing: false,
  },
  {
    id: "4",
    title: "CSS Grid and Flexbox Mastery",
    description:
      "Create responsive layouts with CSS Grid and Flexbox. Learn modern CSS techniques.",
    thumbnail:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "CSS",
    urls: ["https://www.youtube.com/watch?v=example6"],
    createdAt: new Date("2024-01-05"),
    interactions: 156,
    followers: 67,
    status: "uploading",
    isFollowing: true,
  },
  {
    id: "5",
    title: "JavaScript ES6+ Features Deep Dive",
    description:
      "Explore modern JavaScript features including async/await, destructuring, and modules.",
    thumbnail:
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "JavaScript",
    urls: [
      "https://www.youtube.com/watch?v=example7",
      "https://www.youtube.com/watch?v=example8",
    ],
    createdAt: new Date("2024-01-03"),
    interactions: 187,
    followers: 198,
    status: "ready",
    isFollowing: false,
  },
  {
    id: "6",
    title: "Database Design and SQL Optimization",
    description:
      "Learn database design principles and SQL query optimization techniques.",
    thumbnail:
      "https://images.pexels.com/photos/1181233/pexels-photo-1181233.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Database",
    urls: ["https://www.youtube.com/watch?v=example9"],
    createdAt: new Date("2024-01-01"),
    interactions: 94,
    followers: 45,
    status: "error",
    isFollowing: false,
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    question: "What are the main benefits of using React hooks?",
    answer:
      "React hooks provide several key benefits: 1) They allow you to use state and lifecycle features in functional components, 2) They promote code reusability through custom hooks, 3) They make components easier to test and understand, and 4) They help avoid the complexity of class components.",
    videoSnippet: {
      start: 120,
      end: 180,
    },
    feedback: "like",
    timestamp: new Date("2024-01-16T10:30:00"),
  },
  {
    id: "2",
    question: "How do you handle state management in large React applications?",
    answer:
      "For large React applications, you can use several approaches: 1) Context API for global state, 2) Redux or Zustand for complex state management, 3) React Query for server state, and 4) Local state for component-specific data. The choice depends on your specific needs and complexity.",
    videoSnippet: {
      start: 300,
      end: 420,
    },
    timestamp: new Date("2024-01-16T10:45:00"),
  },
  {
    id: "3",
    question: "What are the performance optimization techniques in React?",
    answer:
      "Key React performance optimization techniques include: 1) Using React.memo for preventing unnecessary re-renders, 2) Implementing useMemo and useCallback for expensive calculations, 3) Code splitting with React.lazy, 4) Optimizing bundle size, and 5) Using the React Profiler to identify bottlenecks.",
    videoSnippet: {
      start: 500,
      end: 600,
    },
    feedback: "like",
    timestamp: new Date("2024-01-16T11:00:00"),
  },
];
