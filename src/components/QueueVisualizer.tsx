import React, { useEffect, useRef } from 'react';
import { useQueue } from '../context/QueueContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const QueueVisualizer: React.FC = () => {
  const { 
    queue, 
    queueType, 
    maxSize, 
    isAnimating,
    animationSpeed,
    setAnimationSpeed
  } = useQueue();
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to the end when new items are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [queue]);

  const getItemStyle = (index: number) => {
    // Base styles
    let styles = "flex items-center justify-center min-w-16 h-16 rounded-lg shadow-md transition-all duration-300 transform";
    
    // Add animation for the newest item (last one)
    if (index === queue.length - 1 && isAnimating) {
      styles += " animate-pulse";
    }
    
    // Different colors based on queue type
    if (queueType === 'linear' || queueType === 'circular') {
      styles += " bg-blue-500 text-white";
    } else if (queueType === 'priority') {
      // Color gradient based on priority
      const priority = queue[index].priority || 0;
      const hue = Math.max(0, 200 - priority * 20); // Higher priority = more red
      styles += ` bg-[hsl(${hue},70%,50%)] text-white`;
    } else if (queueType === 'deque') {
      styles += " bg-purple-500 text-white";
    }
    
    return styles;
  };

  const renderQueueItems = () => {
    if (queue.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center h-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Queue is empty</p>
        </div>
      );
    }

    return queue.map((item, index) => (
      <div 
        key={item.id} 
        className={getItemStyle(index)}
        style={{ 
          zIndex: queue.length - index,
          marginRight: index < queue.length - 1 ? '0.5rem' : '0'
        }}
      >
        <span className="font-bold">{item.value}</span>
        {queueType === 'priority' && (
          <span className="absolute -top-2 -right-2 bg-white text-xs text-gray-800 rounded-full w-5 h-5 flex items-center justify-center border border-gray-300">
            {item.priority}
          </span>
        )}
      </div>
    ));
  };

  const renderQueueIndicators = () => {
    if (queue.length === 0) return null;
    
    return (
      <>
        <div className="absolute -bottom-5 left-0 flex flex-col items-center">
        


          <ArrowRight className="text-green-500" size={20} />
          <span className="text-xs font-semibold">Front</span>
        </div>
        
        <div className="absolute -bottom-5 right-0 flex flex-col items-center">
        


          <ArrowLeft className="text-red-500" size={20} />
          <span className="text-xs font-semibold">Rear</span>
        </div>
      </>
    );
  };

  const renderCircularQueueSlots = () => {
    if (queueType !== 'circular') return null;
    
    // Create array of empty slots to represent the circular queue capacity
    const emptySlots = maxSize - queue.length;
    
    if (emptySlots <= 0) return null;
    
    return Array(emptySlots).fill(0).map((_, index) => (
      <div 
        key={`empty-${index}`} 
        className="min-w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center"
      >
        <span className="text-gray-400 dark:text-gray-500">Empty</span>
      </div>
    ));
  };

  return (
    // <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Queue Visualization</h2>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">Speed:</span>
          <select
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(e.target.value as any)}
            className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      </div>
      
      {/* <div className="relative mb-10"> */}
    <div className="relative flex-grow">


        <div 
          ref={containerRef}
          className="flex overflow-x-auto pb-2 pt-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
          style={{ minHeight: '5rem' }}
        >
          {queueType === 'circular' ? (
            <div className="flex space-x-2">
              {renderQueueItems()}
              {renderCircularQueueSlots()}
            </div>
          ) : (
            <div className="flex space-x-2">
              {renderQueueItems()}
            </div>
          )}
        </div>
        
        {renderQueueIndicators()}
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Console Logs</h3>
        <div className="bg-gray-100 dark:bg-gray-900 rounded p-3 h-32 overflow-y-auto text-sm font-mono">
          {useQueue().logs.map((log, index) => (
            <div key={index} className="mb-1">
              <span className="text-gray-500 dark:text-gray-400">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueueVisualizer;


