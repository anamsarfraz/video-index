import React from 'react';
import { motion } from 'framer-motion';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

interface PerformanceDebuggerProps {
  enabled?: boolean;
}

const PerformanceDebugger: React.FC<PerformanceDebuggerProps> = ({ enabled = false }) => {
  const { metrics } = usePerformanceMonitor(enabled);

  if (!enabled) return null;

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getFrameTimeColor = (frameTime: number) => {
    if (frameTime <= 16.67) return 'text-green-500'; // 60fps
    if (frameTime <= 33.33) return 'text-yellow-500'; // 30fps
    return 'text-red-500';
  };

  return (
    <motion.div
      className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg font-mono text-sm z-50 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-blue-400 font-bold mb-2">Performance Metrics</h3>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={getFPSColor(metrics.fps)}>{metrics.fps}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Frame Time:</span>
          <span className={getFrameTimeColor(metrics.frameTime)}>
            {metrics.frameTime.toFixed(2)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Render Time:</span>
          <span className="text-blue-400">{metrics.renderTime.toFixed(2)}ms</span>
        </div>
        
        {metrics.memoryUsage && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="text-purple-400">
              {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
            </span>
          </div>
        )}
      </div>
      
      {/* Performance indicators */}
      <div className="mt-3 pt-2 border-t border-gray-600">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            metrics.fps >= 55 ? 'bg-green-500' : 
            metrics.fps >= 30 ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-xs">
            {metrics.fps >= 55 ? 'Excellent' : 
             metrics.fps >= 30 ? 'Good' : 'Poor'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceDebugger;