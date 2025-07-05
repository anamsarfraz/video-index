import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Calendar, Eye } from 'lucide-react';
import { Pod } from '../types';

interface PodCardProps {
  pod: Pod;
  onClick: (pod: Pod) => void;
  animationDelay?: number;
  isClicked?: boolean;
}

const PodCard: React.FC<PodCardProps> = memo(({ pod, onClick, animationDelay = 0, isClicked = false }) => {
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

  // Enhanced animations for opening effect
  const getCardAnimations = () => {
    if (isClicked && !prefersReducedMotion) {
      return {
        scale: 1.1,
        rotateY: 10,
        z: 100,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      };
    }
    
    return prefersReducedMotion ? {} : {
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
      whileTap: { scale: 0.98 }
    };
  };

  return (
    <motion.div
      className={`group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 ${
        isClicked ? 'z-50 relative' : ''
      }`}
      onClick={handleClick}
      style={{
        willChange: "transform",
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
      }}
      animate={getCardAnimations()}
      {...(!prefersReducedMotion && !isClicked ? {
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
        whileTap: { scale: 0.98 }
      } : {})}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.img
          src={pod.thumbnail}
          alt={pod.title}
          className="w-full h-full object-cover"
          loading="lazy"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        
        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          initial={{ opacity: 0.3 }}
          whileHover={prefersReducedMotion ? undefined : { opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Play Button Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: animationDelay + 0.2, duration: 0.4 }}
        >
          <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-full shadow-lg">
            {pod.category}
          </span>
        </motion.div>

        {/* Interaction Count Badge */}
        <motion.div
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0, x: 20 }}
          whileHover={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: animationDelay + 0.1, duration: 0.4 }}
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
          initial={{ opacity: 0.8 }}
          whileHover={prefersReducedMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {pod.description}
        </motion.p>

        {/* Meta Information */}
        <motion.div
          className="flex items-center justify-between text-xs text-gray-500"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: animationDelay + 0.3, duration: 0.4 }}
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
      </motion.div>

      {/* Hover Glow Effect */}
      {!prefersReducedMotion && (
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 pointer-events-none ${
            isClicked ? 'opacity-20' : ''
          }`}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Opening Animation Overlay */}
      {isClicked && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
});

PodCard.displayName = 'PodCard';

export default PodCard;