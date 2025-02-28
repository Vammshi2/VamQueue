import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { PlusCircle, MinusCircle, Eye, RotateCcw, Trash2, ArrowRightCircle, ArrowLeftCircle } from 'lucide-react';

const OperationsPanel: React.FC = () => {
  const { 
    queueType,
    maxSize,
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
    dequeueRear,
    isAnimating
  } = useQueue();
  
  const [inputValue, setInputValue] = useState<string>('');
  const [priorityValue, setPriorityValue] = useState<string>('0');
  
  const handleEnqueue = () => {
    if (!inputValue.trim()) return;
    
    if (queueType === 'priority') {
      enqueue(inputValue, parseInt(priorityValue, 10));
    } else {
      enqueue(inputValue);
    }
    
    setInputValue('');
  };
  
  const handleEnqueueFront = () => {
    if (!inputValue.trim()) return;
    enqueueFront(inputValue);
    setInputValue('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Queue Operations</h2>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <label className="block text-sm font-medium mr-2">Max Size:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={maxSize}
            onChange={(e) => setMaxSize(parseInt(e.target.value, 10))}
            className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
          />
        </div>
        
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
            />
            
            {queueType === 'priority' && (
              <input
                type="number"
                value={priorityValue}
                onChange={(e) => setPriorityValue(e.target.value)}
                placeholder="Priority"
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                min="0"
              />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleEnqueue}
              disabled={isFull() || isAnimating}
              className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PlusCircle size={16} className="mr-1" />
              Enqueue
            </button>
            
            <button
              onClick={dequeue}
              disabled={isEmpty() || isAnimating}
              className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <MinusCircle size={16} className="mr-1" />
              Dequeue
            </button>
            
            {queueType === 'deque' && (
              <>
                <button
                  onClick={handleEnqueueFront}
                  disabled={isFull() || isAnimating}
                  className="flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeftCircle size={16} className="mr-1" />
                  Enqueue Front
                </button>
                
                <button
                  onClick={dequeueRear}
                  disabled={isEmpty() || isAnimating}
                  className="flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRightCircle size={16} className="mr-1" />
                  Dequeue Rear
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button
          onClick={peek}
          disabled={isEmpty()}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Eye size={16} className="mr-1" />
          Peek
        </button>
        
        <button
          onClick={rear}
          disabled={isEmpty()}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Eye size={16} className="mr-1" />
          Rear
        </button>
        
        <button
          onClick={() => { isEmpty(); }}
          className="flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          isEmpty()
        </button>
        
        <button
          onClick={() => { isFull(); }}
          className="flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          isFull()
        </button>
        
        <button
          onClick={size}
          className="flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          size()
        </button>
        
        <button
          onClick={reverseQueue}
          disabled={isEmpty() || isAnimating}
          className="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw size={16} className="mr-1" />
          Reverse
        </button>
        
        <button
          onClick={clearQueue}
          disabled={isEmpty()}
          className="col-span-2 flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 size={16} className="mr-1" />
          Clear Queue
        </button>
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded">
        <h3 className="text-sm font-semibold mb-1">Queue Status</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Type:</span> {queueType}
          </div>
          <div>
            <span className="font-medium">Size:</span> {useQueue().queue.length}/{maxSize}
          </div>
          <div>
            <span className="font-medium">Empty:</span> {isEmpty() ? 'Yes' : 'No'}
          </div>
          <div>
            <span className="font-medium">Full:</span> {isFull() ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsPanel;