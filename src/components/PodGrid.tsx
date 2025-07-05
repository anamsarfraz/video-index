import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Pod } from '../types';
import PodCard from './PodCard';

interface PodGridProps {
  pods: Pod[];
  onPodClick: (pod: Pod) => void;
}

// Performance optimization: Memoized animation variants
const createAnimationVariants = (reducedMotion: boolean) => ({
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.05,
        delayChildren: reducedMotion ? 0 : 0.1,
        duration: reducedMotion ? 0.2 : 0.6,
      },
    },
  },
  card: {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 15,
      scale: reducedMotion ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reducedMotion ? 0.2 : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      y: reducedMotion ? 0 : -10,
      scale: reducedMotion ? 1 : 0.98,
      transition: {
        duration: reducedMotion ? 0.1 : 0.25,
        ease: "easeInOut",
      },
    },
    filtering: {
      scale: reducedMotion ? 1 : 0.96,
      opacity: reducedMotion ? 1 : 0.8,
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
  },
  loadMore: {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.2 : 0.5,
        ease: "easeOut",
      },
    },
  },
});

const PodGrid: React.FC<PodGridProps> = ({ pods, onPodClick }) => {
  const [visiblePods, setVisiblePods] = useState<Pod[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteringTimeoutId, setFilteringTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Performance optimization: Detect reduced motion preference
  const prefersReducedMotion = useReducedMotion();
  
  // Performance optimization: Memoize animation variants
  const animationVariants = useMemo(
    () => createAnimationVariants(prefersReducedMotion || false),
    [prefersReducedMotion]
  );
  
  // Performance optimization: Use refs to avoid unnecessary re-renders
  const previousPodsRef = useRef<Pod[]>([]);
  const isInitialLoadRef = useRef(true);
  
  const podsPerPage = 9; // 3x3 grid max

  // Performance optimization: Memoize visible pods calculation
  const { currentVisiblePods, hasMore } = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * podsPerPage;
    const slicedPods = pods.slice(startIndex, endIndex);
    
    return {
      currentVisiblePods: slicedPods,
      hasMore: currentPage * podsPerPage < pods.length,
    };
  }, [pods, currentPage, podsPerPage]);

  // Optimized filter change detection
  const handleFilterChange = useCallback(() => {
    // Clear any existing timeout to handle rapid filter changes
    if (filteringTimeoutId) {
      clearTimeout(filteringTimeoutId);
    }

    // Skip animation on initial load
    if (isInitialLoadRef.current) {
      setVisiblePods(currentVisiblePods);
      isInitialLoadRef.current = false;
      return;
    }

    // Check if pods actually changed to avoid unnecessary animations
    const podsChanged = 
      previousPodsRef.current.length !== currentVisiblePods.length ||
      previousPodsRef.current.some((pod, index) => 
        !currentVisiblePods[index] || pod.id !== currentVisiblePods[index].id
      );

    if (!podsChanged) {
      return;
    }

    // Start filtering animation
    setIsFiltering(true);

    // Optimized timing for smooth transitions
    const newTimeoutId = setTimeout(() => {
      setVisiblePods(currentVisiblePods);
      
      // End filtering animation after a brief delay
      setTimeout(() => {
        setIsFiltering(false);
      }, prefersReducedMotion ? 50 : 100);
    }, prefersReducedMotion ? 50 : 150);

    setFilteringTimeoutId(newTimeoutId);
    previousPodsRef.current = currentVisiblePods;
  }, [currentVisiblePods, filteringTimeoutId, prefersReducedMotion]);

  // Effect to handle pod changes
  useEffect(() => {
    handleFilterChange();
    
    // Cleanup timeout on unmount
    return () => {
      if (filteringTimeoutId) {
        clearTimeout(filteringTimeoutId);
      }
    };
  }, [handleFilterChange]);

  // Performance optimization: Memoized load more handler
  const loadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  // Performance optimization: Memoized pod click handler
  const handlePodClick = useCallback((pod: Pod) => {
    onPodClick(pod);
  }, [onPodClick]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <LayoutGroup>
        {/* Grid Container with optimized layout animations */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={animationVariants.container}
          initial="hidden"
          animate="visible"
          layout="position"
          transition={{
            layout: {
              duration: prefersReducedMotion ? 0.2 : 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            },
          }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visiblePods.map((pod, index) => (
              <motion.div
                key={pod.id}
                layout="position"
                variants={animationVariants.card}
                initial="hidden"
                animate={isFiltering ? "filtering" : "visible"}
                exit="exit"
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : {
                        scale: 1.02,
                        y: -4,
                        transition: { 
                          duration: 0.2, 
                          ease: "easeOut",
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        },
                      }
                }
                style={{
                  // Performance optimization: Use transform-origin for better animations
                  transformOrigin: "center center",
                  // Performance optimization: Enable hardware acceleration
                  willChange: isFiltering ? "transform, opacity" : "auto",
                }}
                transition={{
                  layout: {
                    duration: prefersReducedMotion ? 0.2 : 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                }}
              >
                <PodCard 
                  pod={pod} 
                  onClick={handlePodClick}
                  animationDelay={prefersReducedMotion ? 0 : index * 0.05}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button with optimized animations */}
        {hasMore && (
          <motion.div
            className="flex justify-center mt-16"
            variants={animationVariants.loadMore}
            initial="hidden"
            animate="visible"
            layout="position"
          >
            <motion.button
              onClick={loadMore}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { 
                      scale: 1.05,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }
              }
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              {/* Optimized button background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.3 }}
              />
              
              {/* Button content */}
              <span className="relative z-10 flex items-center">
                Load More Pods
                {!prefersReducedMotion && (
                  <motion.div
                    className="ml-2"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ↓
                  </motion.div>
                )}
              </span>
              
              {/* Optimized ripple effect */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full scale-0"
                  whileTap={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Enhanced Empty State */}
        {pods.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: prefersReducedMotion ? 0.2 : 0.6, 
              ease: "easeOut" 
            }}
            layout="position"
          >
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0],
                    }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            >
              <Play className="w-12 h-12 text-blue-600" />
            </motion.div>
            
            <motion.h3
              className="text-2xl font-bold text-gray-700 mb-3"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: prefersReducedMotion ? 0 : 0.2, 
                duration: prefersReducedMotion ? 0.2 : 0.5 
              }}
            >
              No pods found
            </motion.h3>
            
            <motion.p
              className="text-gray-500 text-lg"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: prefersReducedMotion ? 0 : 0.4, 
                duration: prefersReducedMotion ? 0.2 : 0.5 
              }}
            >
              Try adjusting your search or create your first pod!
            </motion.p>
            
            {/* Animated dots with reduced motion support */}
            {!prefersReducedMotion && (
              <motion.div
                className="flex justify-center space-x-2 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </LayoutGroup>
    </div>
  );
};

export default PodGrid;