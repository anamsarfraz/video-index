import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Pod } from '../types';
import { useChat } from '../hooks/useChat';
import { mockChatMessages } from '../utils/mockData';
import VideoPlayer from './VideoPlayer';
import ChatInterface from './ChatInterface';

interface PodDetailProps {
  pod: Pod;
  onBack: () => void;
}

const PodDetail: React.FC<PodDetailProps> = ({ pod, onBack }) => {
  const [jumpToTime, setJumpToTime] = useState<number | undefined>();
  const { messages, sendMessage, addFeedback, isLoading } = useChat(mockChatMessages);

  const handleJumpToTime = (time: number) => {
    setJumpToTime(time);
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Pods
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {pod.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video and Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <VideoPlayer
                videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                jumpToTime={jumpToTime}
              />
            </div>

            {/* Pod Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {pod.title}
              </h1>
              
              <p className="text-gray-600 mb-4">
                {pod.description}
              </p>

              {/* URLs */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Source URLs:</h3>
                <div className="space-y-2">
                  {pod.urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span className="text-sm truncate">{url}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center text-sm text-gray-500">
                <span>Created: {pod.createdAt.toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{pod.interactions} interactions</span>
              </div>
            </div>
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <ChatInterface
                messages={messages}
                onSendMessage={sendMessage}
                onFeedback={addFeedback}
                isLoading={isLoading}
                onJumpToTime={handleJumpToTime}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PodDetail;