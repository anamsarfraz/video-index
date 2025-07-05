import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Calendar, Eye } from 'lucide-react';
import { Pod } from '../types';

interface PodCardProps {
  pod: Pod;
  onClick: (pod: Pod) => void;
  animationDelay?: number;
}

// Performance optimization: Memoize the component to prevent unnecessary re-renders
const PodCard: React.FC<PodCardProps> = memo(({ pod, onClick, animationDelay = 0 }) => {
  const prefersReducedMotion = useReducedMotion();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Performance optimization: Memoize click handler
  const handleClick = React.useCallback(() => {
    onClick(pod);
  }, [onClick, pod]);

  // Performance optimization: Conditional animations based on reduced motion preference
  const cardAnimations = prefersReducedMotion
    ? {
        whileHover: undefined,
        whileTap: undefined,
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        whileHover: { 
          y: -8,
          scale: 1.02,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
          },
        },
        whileTap: { scale: 0.98 },
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { 
          duration: 0.5,
          delay: animationDelay,
          ease: [0.25, 0.46, 0.45, 0.94]
        },
      };

  const imageAnimations = prefersReducedMotion
    ? {}
    : {
        whileHover: { scale: 1.1 },
        transition: { duration: 0.4, ease: "easeOut" },
      };

  const overlayAnimations = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0.3 },
        whileHover: { opacity: 0.5 },
        transition: { duration: 0.3 },
      };

  const playButtonAnimations = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.8 },
        whileHover: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, ease: "easeOut" },
      };

  return (
    <motion.div
      className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
      onClick={handleClick}
      layout="position"
      layoutId={`pod-${pod.id}`}
      style={{
        // Performance optimization: Enable hardware acceleration
        willChange: "transform",
        // Performance optimization: Use transform-origin for better scaling
        transformOrigin: "center center",
      }}
      {...cardAnimations}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.img
          src={pod.thumbnail}
          alt={pod.title}
          className="w-full h-full object-cover"
          loading="lazy"
          {...imageAnimations}
        />
        
        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          {...overlayAnimations}
        />
        
        {/* Play Button Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          {...playButtonAnimations}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-xl"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Play className="w-8 h-8 text-blue-600 ml-1" />
          </motion.div>
        </motion.div>

        {/* Category Badge */}
        <motion.div
          className="absolute top-4 left-4"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={prefersReducedMotion ? {} : { delay: animationDelay + 0.2, duration: 0.4 }}
        >
          <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-full shadow-lg">
            {pod.category}
          </span>
        </motion.div>

        {/* Interaction Count Badge */}
        <motion.div
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
          whileHover={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
            <Eye className="w-3 h-3 mr-1" />
            {pod.interactions}
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <motion.div
        className="p-6"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? {} : { delay: animationDelay + 0.1, duration: 0.4 }}
      >
        {/* Title */}
        <motion.h3
          className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {pod.title}
        </motion.h3>
        
        {/* Description */}
        <motion.p
          className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed"
          initial={prefersReducedMotion ? {} : { opacity: 0.8 }}
          whileHover={prefersReducedMotion ? {} : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {pod.description}
        </motion.p>

        {/* Meta Information */}
        <motion.div
          className="flex items-center justify-between text-xs text-gray-500"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 5 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { delay: animationDelay + 0.3, duration: 0.4 }}
        >
          <div className="flex items-center group-hover:text-blue-600 transition-colors duration-200">
            <Calendar className="w-3 h-3 mr-1" />
            <span className="font-medium">{formatDate(pod.createdAt)}</span>
          </div>
          
          <motion.div
            className="flex items-center space-x-1"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-medium">Ready</span>
          </motion.div>
        </motion.div>

        {/* Progress Bar (Visual Enhancement) */}
        <motion.div
          className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden"
          initial={prefersReducedMotion ? {} : { scaleX: 0 }}
          animate={prefersReducedMotion ? {} : { scaleX: 1 }}
          transition={prefersReducedMotion ? {} : { delay: animationDelay + 0.4, duration: 0.6 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            initial={prefersReducedMotion ? {} : { width: "0%" }}
            animate={prefersReducedMotion ? {} : { width: `${Math.min(100, (pod.interactions / 200) * 100)}%` }}
            transition={prefersReducedMotion ? {} : { delay: animationDelay + 0.6, duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>
      </div>

      {/* Hover Glow Effect */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 pointer-events-none"
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
});

PodCard.displayName = 'PodCard';

export default PodCard;