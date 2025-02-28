import React, { createContext, useContext, useState, useEffect } from 'react';

export type QueueType = 'linear' | 'circular' | 'priority' | 'deque';
export type Language = 'javascript' | 'java' | 'python' | 'cpp';
export type AnimationSpeed = 'slow' | 'normal' | 'fast';

interface QueueItem {
  value: string | number;
  priority?: number;
  id: string;
}

interface QueueContextType {
  queue: QueueItem[];
  queueType: QueueType;
  language: Language;
  animationSpeed: AnimationSpeed;
  maxSize: number;
  logs: string[];
  isAnimating: boolean;
  
  setQueueType: (type: QueueType) => void;
  setLanguage: (lang: Language) => void;
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  setMaxSize: (size: number) => void;
  
  enqueue: (value: string | number, priority?: number) => void;
  dequeue: () => QueueItem | undefined;
  peek: () => QueueItem | undefined;
  rear: () => QueueItem | undefined;
  isEmpty: () => boolean;
  isFull: () => boolean;
  size: () => number;
  clearQueue: () => void;
  reverseQueue: () => void;
  
  // For deque operations
  enqueueFront: (value: string | number) => void;
  dequeueRear: () => QueueItem | undefined;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [queueType, setQueueType] = useState<QueueType>('linear');
  const [language, setLanguage] = useState<Language>('javascript');
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>('normal');
  const [maxSize, setMaxSize] = useState<number>(10);
  const [logs, setLogs] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Add a log entry
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`].slice(-20));
  };

  // Clear logs when queue type changes
  useEffect(() => {
    setLogs([`Queue type changed to ${queueType}`]);
    clearQueue();
  }, [queueType]);

  // Enqueue operation
  const enqueue = (value: string | number, priority?: number) => {
    if (isFull()) {
      addLog(`Cannot enqueue ${value}: Queue is full`);
      return;
    }

    setIsAnimating(true);
    
    const newItem: QueueItem = { 
      value, 
      id: Math.random().toString(36).substr(2, 9),
      ...(queueType === 'priority' && { priority: priority || 0 })
    };
    
    setTimeout(() => {
      if (queueType === 'priority') {
        // For priority queue, insert based on priority
        const newQueue = [...queue];
        let inserted = false;
        
        for (let i = 0; i < newQueue.length; i++) {
          if ((newQueue[i].priority || 0) > (priority || 0)) {
            newQueue.splice(i, 0, newItem);
            inserted = true;
            break;
          }
        }
        
        if (!inserted) {
          newQueue.push(newItem);
        }
        
        setQueue(newQueue);
      } else {
        // For other queue types, add to the end
        setQueue(prev => [...prev, newItem]);
      }
      
      addLog(`Enqueued: ${value}${priority !== undefined ? ` with priority ${priority}` : ''}`);
      setIsAnimating(false);
    }, getAnimationDuration());
  };

  // Dequeue operation
  const dequeue = () => {
    if (isEmpty()) {
      addLog('Cannot dequeue: Queue is empty');
      return undefined;
    }

    setIsAnimating(true);
    const item = queue[0];
    
    setTimeout(() => {
      setQueue(prev => prev.slice(1));
      addLog(`Dequeued: ${item.value}`);
      setIsAnimating(false);
    }, getAnimationDuration());
    
    return item;
  };

  // Peek operation
  const peek = () => {
    if (isEmpty()) {
      addLog('Cannot peek: Queue is empty');
      return undefined;
    }
    
    addLog(`Peek: ${queue[0].value}`);
    return queue[0];
  };

  // Rear operation
  const rear = () => {
    if (isEmpty()) {
      addLog('Cannot get rear: Queue is empty');
      return undefined;
    }
    
    addLog(`Rear: ${queue[queue.length - 1].value}`);
    return queue[queue.length - 1];
  };

  // Check if queue is empty
  const isEmpty = () => {
    const empty = queue.length === 0;
    return empty;
  };

  // Check if queue is full
  const isFull = () => {
    if (queueType === 'circular') {
      return queue.length >= maxSize;
    }
    return queue.length >= maxSize;
  };

  // Get queue size
  const size = () => {
    addLog(`Size: ${queue.length}`);
    return queue.length;
  };

  // Clear queue
  const clearQueue = () => {
    setQueue([]);
    addLog('Queue cleared');
  };

  // Reverse queue
  const reverseQueue = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      setQueue([...queue].reverse());
      addLog('Queue reversed');
      setIsAnimating(false);
    }, getAnimationDuration());
  };

  // For deque operations
  const enqueueFront = (value: string | number) => {
    if (queueType !== 'deque') {
      addLog('enqueueFront is only available for deque');
      return;
    }
    
    if (isFull()) {
      addLog(`Cannot enqueueFront ${value}: Queue is full`);
      return;
    }

    setIsAnimating(true);
    
    const newItem: QueueItem = { 
      value, 
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setTimeout(() => {
      setQueue(prev => [newItem, ...prev]);
      addLog(`Enqueued at front: ${value}`);
      setIsAnimating(false);
    }, getAnimationDuration());
  };

  const dequeueRear = () => {
    if (queueType !== 'deque') {
      addLog('dequeueRear is only available for deque');
      return undefined;
    }
    
    if (isEmpty()) {
      addLog('Cannot dequeueRear: Queue is empty');
      return undefined;
    }

    setIsAnimating(true);
    const item = queue[queue.length - 1];
    
    setTimeout(() => {
      setQueue(prev => prev.slice(0, -1));
      addLog(`Dequeued from rear: ${item.value}`);
      setIsAnimating(false);
    }, getAnimationDuration());
    
    return item;
  };

  // Helper function to get animation duration based on speed
  const getAnimationDuration = () => {
    switch (animationSpeed) {
      case 'slow': return 1000;
      case 'fast': return 200;
      default: return 500;
    }
  };

  const value = {
    queue,
    queueType,
    language,
    animationSpeed,
    maxSize,
    logs,
    isAnimating,
    
    setQueueType,
    setLanguage,
    setAnimationSpeed,
    setMaxSize,
    
    enqueue,
    dequeue,
    peek,
    rear,
    isEmpty,
    isFull,
    size,
    clearQueue,
    reverseQueue,
    
    enqueueFront,
    dequeueRear
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};