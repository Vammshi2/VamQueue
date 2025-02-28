import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { Code, Play } from 'lucide-react';

const CodePanel: React.FC = () => {
  const { language, setLanguage, queueType } = useQueue();
  const [codeSnippets, setCodeSnippets] = useState<Record<string, string>>({});
  const [pseudocode, setPseudocode] = useState<string>('');
  const [selectedOperation, setSelectedOperation] = useState<string>('enqueue');
  const [output, setOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'pseudocode' | 'code'>('pseudocode');

  // Update code snippets and pseudocode when language or queue type or operation changes
  useEffect(() => {
    setCodeSnippets(getCodeSnippets(language, queueType));
    setPseudocode(getPseudocode(selectedOperation, queueType));
  }, [language, queueType, selectedOperation]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as any);
  };

  const handleOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOperation(e.target.value);
  };

  const executeCode = () => {
    setIsExecuting(true);
    setOutput('Executing...');
    
    // Only JavaScript can be executed directly in the browser
    if (language === 'javascript') {
      try {
        // Create a safe execution environment
        const executeInSandbox = () => {
          // Create a queue implementation based on the current queue type
          let queue: any[] = [];
          const maxSize = 10;
          
          // Basic queue operations
          const enqueue = (value: any, priority?: number) => {
            if (queue.length >= maxSize) {
              return "Queue is full";
            }
            
            if (queueType === 'priority' && priority !== undefined) {
              // For priority queue
              const item = { value, priority };
              let inserted = false;
              
              for (let i = 0; i < queue.length; i++) {
                if (queue[i].priority > priority) {
                  queue.splice(i, 0, item);
                  inserted = true;
                  break;
                }
              }
              
              if (!inserted) {
                queue.push(item);
              }
              
              return `Enqueued ${value} with priority ${priority}`;
            } else {
              // For other queue types
              queue.push({ value });
              return `Enqueued ${value}`;
            }
          };
          
          const dequeue = () => {
            if (queue.length === 0) {
              return "Queue is empty";
            }
            const item = queue.shift();
            return `Dequeued ${item.value}`;
          };
          
          const peek = () => {
            if (queue.length === 0) {
              return "Queue is empty";
            }
            return `Front element: ${queue[0].value}`;
          };
          
          const rear = () => {
            if (queue.length === 0) {
              return "Queue is empty";
            }
            return `Rear element: ${queue[queue.length - 1].value}`;
          };
          
          const isEmpty = () => {
            return `Queue is ${queue.length === 0 ? 'empty' : 'not empty'}`;
          };
          
          const isFull = () => {
            return `Queue is ${queue.length >= maxSize ? 'full' : 'not full'}`;
          };
          
          const size = () => {
            return `Queue size: ${queue.length}`;
          };
          
          const clearQueue = () => {
            queue = [];
            return "Queue cleared";
          };
          
          const reverseQueue = () => {
            queue.reverse();
            return "Queue reversed";
          };
          
          // Deque specific operations
          const enqueueFront = (value: any) => {
            if (queueType !== 'deque') {
              return "Operation only available for deque";
            }
            
            if (queue.length >= maxSize) {
              return "Queue is full";
            }
            
            queue.unshift({ value });
            return `Enqueued ${value} at front`;
          };
          
          const dequeueRear = () => {
            if (queueType !== 'deque') {
              return "Operation only available for deque";
            }
            
            if (queue.length === 0) {
              return "Queue is empty";
            }
            
            const item = queue.pop();
            return `Dequeued ${item.value} from rear`;
          };
          
          // Execute the selected operation
          switch (selectedOperation) {
            case 'enqueue':
              return enqueue(42);
            case 'dequeue':
              return dequeue();
            case 'peek':
              return peek();
            case 'rear':
              return rear();
            case 'isEmpty':
              return isEmpty();
            case 'isFull':
              return isFull();
            case 'size':
              return size();
            case 'clearQueue':
              return clearQueue();
            case 'reverseQueue':
              return reverseQueue();
            case 'enqueueFront':
              return enqueueFront(42);
            case 'dequeueRear':
              return dequeueRear();
            default:
              return "Unknown operation";
          }
        };
        
        const result = executeInSandbox();
        setOutput(result);
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      // For other languages, show a message that execution is simulated
      setTimeout(() => {
        setOutput(`Simulated execution for ${language} code.\nIn a real environment, this would execute the ${selectedOperation} operation.`);
      }, 1000);
    }
    
    setTimeout(() => {
      setIsExecuting(false);
    }, 1000);
  };

return (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
      <h2 className="text-xl font-bold flex items-center text-black dark:text-white">
        <Code className="mr-2" size={20} />
        Code Implementation
      </h2>

      <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-gray-200"
        >
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>

        <select
          value={selectedOperation}
          onChange={handleOperationChange}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-gray-200"
        >
          <option value="enqueue">enqueue()</option>
          <option value="dequeue">dequeue()</option>
          <option value="peek">peek()</option>
          <option value="rear">rear()</option>
          <option value="isEmpty">isEmpty()</option>
          <option value="isFull">isFull()</option>
          <option value="size">size()</option>
          <option value="clearQueue">clearQueue()</option>
          <option value="reverseQueue">reverseQueue()</option>
          {queueType === 'deque' && (
            <>
              <option value="enqueueFront">enqueueFront()</option>
              <option value="dequeueRear">dequeueRear()</option>
            </>
          )}
        </select>
      </div>
    </div>

    {/* <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'pseudocode'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('pseudocode')}
        >
          Pseudocode & Explanation
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'code'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('code')}
        >
          Code Implementation
        </button>
      </div>
    </div> */}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-black dark:text-gray-200">
          Pseudocode & Explanation
        </h3>
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto h-64">
          <div
            className="text-black dark:text-gray-200 text-sm"
            dangerouslySetInnerHTML={{ __html: pseudocode }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-black dark:text-gray-200">
          Code Implementation
        </h3>
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto h-64">
          <pre className="text-sm font-mono text-black dark:text-gray-200">
            {codeSnippets[selectedOperation] || 'Code not available for this operation'}
          </pre>
        </div>
      </div>
    </div>
  </div>
);

};
// Helper function to get pseudocode and explanations
const getPseudocode = (operation: string, queueType: string): string => {
  const pseudocodes: Record<string, Record<string, string>> = {
    linear: {
      enqueue: `
        <h3 class="text-lg font-bold mb-2">Enqueue Operation in Linear Queue</h3>
        <p>The <strong>enqueue()</strong> operation is used to insert an element into the queue following the <strong>FIFO (First In, First Out)</strong> principle. It ensures that elements are added at the <strong>rear</strong> end of the queue.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is full</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is full (in a fixed-size array implementation), return an error or resize the queue.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Add the new element at the rear</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Increment the rear pointer.</li>
              <li>Place the new element at the rear position.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update queue size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Increment the size counter to reflect the new element.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return success</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>The element is now successfully added to the queue.</li>
            </ul>
          </li>
        </ol>
      `,
      
      dequeue: `
        <h3 class="text-lg font-bold mb-2">Dequeue Operation in Linear Queue</h3>
        <p>The <strong>dequeue()</strong> operation removes and returns the element at the <strong>front</strong> of the queue, following the FIFO principle.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Retrieve the front element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Get the element at the front position.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update the front pointer</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Increment the front pointer to point to the next element.</li>
              <li>If the queue becomes empty (front > rear), reset pointers.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update queue size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Decrement the size counter.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return the removed element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>The element that was at the front is returned to the caller.</li>
            </ul>
          </li>
        </ol>
      `,
      
      peek: `
        <h3 class="text-lg font-bold mb-2">Peek Operation in Linear Queue</h3>
        <p>The <strong>peek()</strong> operation returns the element at the <strong>front</strong> of the queue without removing it.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return the front element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the element at the front position without modifying the queue.</li>
            </ul>
          </li>
        </ol>
      `,
      
      rear: `
        <h3 class="text-lg font-bold mb-2">Rear Operation in Linear Queue</h3>
        <p>The <strong>rear()</strong> operation returns the element at the <strong>rear</strong> of the queue without removing it.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return the rear element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the element at the rear position without modifying the queue.</li>
            </ul>
          </li>
        </ol>
      `,
      
      isEmpty: `
        <h3 class="text-lg font-bold mb-2">isEmpty Operation in Linear Queue</h3>
        <p>The <strong>isEmpty()</strong> operation checks if the queue contains any elements.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check the queue size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return true if the size is 0 (or if front > rear in array implementation).</li>
              <li>Return false otherwise.</li>
            </ul>
          </li>
        </ol>
      `,
      
      isFull: `
        <h3 class="text-lg font-bold mb-2">isFull Operation in Linear Queue</h3>
        <p>The <strong>isFull()</strong> operation checks if the queue has reached its maximum capacity.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check the queue size against capacity</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return true if the size equals the maximum capacity.</li>
              <li>Return false otherwise.</li>
            </ul>
          </li>
        </ol>
      `,
      
      size: `
        <h3 class="text-lg font-bold mb-2">Size Operation in Linear Queue</h3>
        <p>The <strong>size()</strong> operation returns the number of elements currently in the queue.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Return the size counter</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the current value of the size variable.</li>
              <li>In array implementation without a size variable, calculate as (rear - front + 1).</li>
            </ul>
          </li>
        </ol>
      `,
      
      clearQueue: `
        <h3 class="text-lg font-bold mb-2">Clear Operation in Linear Queue</h3>
        <p>The <strong>clearQueue()</strong> operation removes all elements from the queue.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1) or O(n) depending on implementation</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Reset queue pointers</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Set front to 0 or initial position.</li>
              <li>Set rear to -1 or initial position.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Reset size counter</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Set size to 0.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Optional: Clear memory</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>In some implementations, you might need to explicitly free memory or set array elements to null.</li>
            </ul>
          </li>
        </ol>
      `,
      
      reverseQueue: `
        <h3 class="text-lg font-bold mb-2">Reverse Operation in Linear Queue</h3>
        <p>The <strong>reverseQueue()</strong> operation reverses the order of elements in the queue.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(n)</li>
          <li><strong>Space Complexity:</strong> O(n)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty, return as there's nothing to reverse.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Use a temporary stack</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Create a temporary stack.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Dequeue all elements and push to stack</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>While the queue is not empty, dequeue each element and push it onto the stack.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Pop from stack and enqueue back</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>While the stack is not empty, pop each element and enqueue it back into the queue.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Queue is now reversed</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>The elements are now in reverse order in the queue.</li>
            </ul>
          </li>
        </ol>
      `
    },
    
    circular: {
      enqueue: `
        <h3 class="text-lg font-bold mb-2">Enqueue Operation in Circular Queue</h3>
        <p>The <strong>enqueue()</strong> operation adds an element to the rear of the circular queue, efficiently using the array space by wrapping around when reaching the end.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is full</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is full, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Handle the first element case</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty (front = -1), set front to 0.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update the rear pointer with circular logic</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Increment rear: rear = (rear + 1) % capacity</li>
              <li>This formula ensures the pointer wraps around to 0 when it reaches the end of the array.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Insert the new element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Place the new element at the updated rear position.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update queue size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Increment the size counter.</li>
            </ul>
          </li>
        </ol>
      `,
      
      dequeue: `
        <h3 class="text-lg font-bold mb-2">Dequeue Operation in Circular Queue</h3>
        <p>The <strong>dequeue()</strong> operation removes and returns the element at the front of the circular queue.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty (front = -1), return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Retrieve the front element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Get the element at the front position.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Handle the last element case</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If front equals rear (only one element in queue), reset front and rear to -1.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update the front pointer with circular logic</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Increment front: front = (front + 1) % capacity</li>
              <li>This formula ensures the pointer wraps around to 0 when it reaches the end of the array.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update queue size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Decrement the size counter.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return the removed element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the element that was at the front.</li>
            </ul>
          </li>
        </ol>
      `,
      
      peek: `
        <h3 class="text-lg font-bold mb-2">Peek Operation in Circular Queue</h3>
        <p>The <strong>peek()</strong> operation returns the element at the front of the circular queue without removing it.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty (front = -1), return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return the front element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the element at the front position without modifying the queue.</li>
            </ul>
          </li>
        </ol>
      `,
      
      rear: `
        <h3 class="text-lg font-bold mb-2">Rear Operation in Circular Queue</h3>
        <p>The <strong>rear()</strong> operation returns the element at the rear of the circular queue without removing it.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty (rear = -1), return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return the rear element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the element at the rear position without modifying the queue.</li>
            </ul>
          </li>
        </ol>
      `,
      
      isEmpty: `
        <h3 class="text-lg font-bold mb-2">isEmpty Operation in Circular Queue</h3>
        <p>The <strong>isEmpty()</strong> operation checks if the circular queue contains any elements.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check the front pointer</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return true if front is -1 (indicating an empty queue).</li>
              <li>Alternatively, check if size is 0.</li>
              <li>Return false otherwise.</li>
            </ul>
          </li>
        </ol>
      `,
      
      isFull: `
        <h3 class="text-lg font-bold mb-2">isFull Operation in Circular Queue</h3>
        <p>The <strong>isFull()</strong> operation checks if the circular queue has reached its maximum capacity.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the next position after rear is front</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Calculate next position: (rear + 1) % capacity</li>
              <li>Return true if next position equals front.</li>
              <li>Alternatively, check if size equals capacity.</li>
              <li>Return false otherwise.</li>
            </ul>
          </li>
        </ol>
      `,
      
      size: `
        <h3 class="text-lg font-bold mb-2">Size Operation in Circular Queue</h3>
        <p>The <strong>size()</strong> operation returns the number of elements currently in the circular queue.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Return the size counter</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the current value of the size variable.</li>
              <li>In implementations without a size variable, calculate based on front and rear positions.</li>
            </ul>
          </li>
        </ol>
      `,
      
      clearQueue: `
        <h3 class="text-lg font-bold mb-2">Clear Operation in Circular Queue</h3>
        <p>The <strong>clearQueue()</strong> operation removes all elements from the circular queue.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Reset queue pointers</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Set front to -1 (indicating an empty queue).</li>
              <li>Set rear to -1 (indicating an empty queue).</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Reset size counter</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Set size to 0.</li>
            </ul>
          </li>
        </ol>
      `,
      
      reverseQueue: `
        <h3 class="text-lg font-bold mb-2">Reverse Operation in Circular Queue</h3>
        <p>The <strong>reverseQueue()</strong> operation reverses the order of elements in the circular queue.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(n)</li>
          <li><strong>Space Complexity:</strong> O(n)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty, return as there's nothing to reverse.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Use a temporary array or stack</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Create a temporary array or stack to hold all elements.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Dequeue all elements and store</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>While the queue is not empty, dequeue each element and store it in the temporary structure.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Reset queue pointers</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Reset front and rear to their initial values.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Enqueue elements back in reverse order</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Pop/remove elements from the temporary structure and enqueue them back into the queue.</li>
              <li>This reverses the order of elements.</li>
            </ul>
          </li>
        </ol>
      `
    },
    
    priority: {
      enqueue: `
        <h3 class="text-lg font-bold mb-2">Enqueue Operation in Priority Queue</h3>
        <p>The <strong>enqueue(value, priority)</strong> operation inserts an element into the priority queue based on its priority value.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(n) for array-based implementation, O(log n) for heap-based implementation</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is full</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is full, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Create a new item with value and priority</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Create a new item object/node containing both the value and its priority.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Find the correct position based on priority</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Iterate through the queue to find the position where the new item should be inserted.</li>
              <li>The position is determined by comparing priorities (lower number typically means higher priority).</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Insert the new item at the correct position</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If a position is found, shift elements to make space and insert the new item.</li>
              <li>If no position is found (new item has lowest priority), add it at the end of the queue.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update queue size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Increment the size counter.</li>
            </ul>
          </li>
        </ol>
      `,
      
      dequeue: `
        <h3 class="text-lg font-bold mb-2">Dequeue Operation in Priority Queue</h3>
        <p>The <strong>dequeue()</strong> operation removes and returns the highest priority element from the queue.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1) for array-based implementation, O(log n) for heap-based implementation</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Retrieve the highest priority element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>In a min-priority queue, this is the element at the front.</li>
              <li>In a max-priority queue, this might be at a different position.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Remove the element from the queue</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Remove the highest priority element.</li>
              <li>Shift remaining elements if necessary.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update queue size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Decrement the size counter.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return the removed element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the value of the removed element.</li>
            </ul>
          </li>
        </ol>
      `,
      
      peek: `
        <h3 class="text-lg font-bold mb-2">Peek Operation in Priority Queue</h3>
        <p>The <strong>peek()</strong> operation returns the highest priority element without removing it.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1"> <strong>Return the highest priority element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the value of the highest priority element without modifying the queue.</li>
              <li>In a min-priority queue, this is the element at the front.</li>
            </ul>
          </li>
        </ol>
      `,
      
      rear: `
        <h3 class="text-lg font-bold mb-2">Rear Operation in Priority Queue</h3>
        <p>The <strong>rear()</strong> operation returns the lowest priority element without removing it.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return the lowest priority element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the value of the lowest priority element without modifying the queue.</li>
              <li>In a min-priority queue, this is typically the element at the rear.</li>
            </ul>
          </li>
        </ol>
      `,
      
      isEmpty: `
        <h3 class="text-lg font-bold mb-2">isEmpty Operation in Priority Queue</h3>
        <p>The <strong>isEmpty()</strong> operation checks if the priority queue contains any elements.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check the queue size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return true if the size is 0.</li>
              <li>Return false otherwise.</li>
            </ul>
          </li>
        </ol>
      `,
      
      isFull: `
        <h3 class="text-lg font-bold mb-2">isFull Operation in Priority Queue</h3>
        <p>The <strong>isFull()</strong> operation checks if the priority queue has reached its maximum capacity.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check the queue size against capacity</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return true if the size equals the maximum capacity.</li>
              <li>Return false otherwise.</li>
            </ul>
          </li>
        </ol>
      `,
      
      size: `
        <h3 class="text-lg font-bold mb-2">Size Operation in Priority Queue</h3>
        <p>The <strong>size()</strong> operation returns the number of elements currently in the priority queue.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Return the size counter</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the current value of the size variable.</li>
            </ul>
          </li>
        </ol>
      `,
      
      clearQueue: `
        <h3 class="text-lg font-bold mb-2">Clear Operation in Priority Queue</h3>
        <p>The <strong>clearQueue()</strong> operation removes all elements from the priority queue.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1) or O(n) depending on implementation</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Reset the queue structure</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>In an array implementation, reset the array or set size to 0.</li>
              <li>In a linked list implementation, set the head pointer to null.</li>
              <li>In a heap implementation, clear the heap structure.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Reset size counter</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Set size to 0.</li>
            </ul>
          </li>
        </ol>
      `,
      
      reverseQueue: `
        <h3 class="text-lg font-bold mb-2">Reverse Operation in Priority Queue</h3>
        <p>The <strong>reverseQueue()</strong> operation reverses the priority order of elements in the queue.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(n)</li>
          <li><strong>Space Complexity:</strong> O(n)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the queue is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the queue is empty, return as there's nothing to reverse.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Create a temporary structure</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Create a temporary array or stack to hold all elements.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Extract all elements with their priorities</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>While the queue is not empty, dequeue each element and store it with its priority.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Reverse the priority logic</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>For each stored element, invert or modify its priority value.</li>
              <li>For example, if using numeric priorities, you might use (max_priority - current_priority).</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Re-enqueue all elements with new priorities</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Enqueue all elements back into the queue with their new priorities.</li>
            </ul>
          </li>
        </ol>
      `
    },
    
    deque: {
      enqueue: `
        <h3 class="text-lg font-bold mb-2">Enqueue Operation in Deque (Double-Ended Queue)</h3>
        <p>The <strong>enqueue()</strong> operation adds an element to the rear of the deque.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the deque is full</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the deque is full, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Handle the empty deque case</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the deque is empty (front = -1), set both front and rear to 0.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update the rear pointer</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>In a circular implementation: rear = (rear + 1) % capacity</li>
              <li>In a non-circular implementation: increment rear</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Insert the new element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Place the new element at the updated rear position.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update deque size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Increment the size counter.</li>
            </ul>
          </li>
        </ol>
      `,
      
      dequeue: `
        <h3 class="text-lg font-bold mb-2">Dequeue Operation in Deque (Double-Ended Queue)</h3>
        <p>The <strong>dequeue()</strong> operation removes and returns the element from the front of the deque.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the deque is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the deque is empty, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Retrieve the front element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Get the element at the front position.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Handle the last element case</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If front equals rear (only one element in deque), reset front and rear to -1.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update the front pointer</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>In a circular implementation: front = (front + 1) % capacity</li>
              <li>In a non-circular implementation: increment front</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update deque size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Decrement the size counter.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return the removed element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the element that was at the front.</li>
            </ul>
          </li>
        </ol>
      `,
      
      enqueueFront: `
        <h3 class="text-lg font-bold mb-2">Enqueue Front Operation in Deque</h3>
        <p>The <strong>enqueueFront()</strong> operation adds an element to the front of the deque.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the deque is full</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the deque is full, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Handle the empty deque case</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the deque is empty (front = -1), set both front and rear to 0.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update the front pointer</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>In a circular implementation: front = (front - 1 + capacity) % capacity</li>
              <li>This formula ensures the pointer wraps around correctly when decremented.</li>
              <li>In a non-circular implementation: decrement front</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Insert the new element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Place the new element at the updated front position.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update deque size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Increment the size counter.</li>
            </ul>
          </li>
        </ol>
      `,
      
      dequeueRear: `
        <h3 class="text-lg font-bold mb-2">Dequeue Rear Operation in Deque</h3>
        <p>The <strong>dequeueRear()</strong> operation removes and returns the element from the rear of the deque.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the deque is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the deque is empty, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Retrieve the rear element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Get the element at the rear position.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Handle the last element case</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If front equals rear (only one element in deque), reset front and rear to -1.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update the rear pointer</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>In a circular implementation: rear = (rear - 1 + capacity) % capacity</li>
              <li>This formula ensures the pointer wraps around correctly when decremented.</li>
              <li>In a non-circular implementation: decrement rear</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Update deque size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Decrement the size counter.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return the removed element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the element that was at the rear.</li>
            </ul>
          </li>
        </ol>
      `,
      
      peek: `
        <h3 class="text-lg font-bold mb-2">Peek Operation in Deque</h3>
        <p>The <strong>peek()</strong> operation returns the element at the front of the deque without removing it.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the deque is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the deque is empty, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return the front element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the element at the front position without modifying the deque.</li>
            </ul>
          </li>
        </ol>
      `,
      
      rear: `
        <h3 class="text-lg font-bold mb-2">Rear Operation in Deque</h3>
        <p>The <strong>rear()</strong> operation returns the element at the rear of the deque without removing it.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the deque is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the deque is empty, return an error or appropriate message.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Return the rear element</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the element at the rear position without modifying the deque.</li>
            </ul>
          </li>
        </ol>
      `,
      
      isEmpty: `
        <h3 class="text-lg font-bold mb-2">isEmpty Operation in Deque</h3>
        <p>The <strong>isEmpty()</strong> operation checks if the deque contains any elements.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check the front pointer or size</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return true if front is -1 (indicating an empty deque) or if size is 0.</li>
              <li>Return false otherwise.</li>
            </ul>
          </li>
        </ol>
      `,
      
      isFull: `
        <h3 class="text-lg font-bold mb-2">isFull Operation in Deque</h3>
        <p>The <strong>isFull()</strong> operation checks if the deque has reached its maximum capacity.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the next position after rear meets front</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>In a circular implementation: (rear + 1) % capacity == front</li>
              <li>Alternatively, check if size equals capacity.</li>
              <li>Return true if the condition is met, false otherwise.</li>
            </ul>
          </li>
        </ol>
      `,
      
      size: `
        <h3 class="text-lg font-bold mb-2">Size Operation in Deque</h3>
        <p>The <strong>size()</strong> operation returns the number of elements currently in the deque.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Return the size counter</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Return the current value of the size variable.</li>
              <li>In implementations without a size variable, calculate based on front and rear positions.</li>
            </ul>
          </li>
        </ol>
      `,
      
      clearQueue: `
        <h3 class="text-lg font-bold mb-2">Clear Operation in Deque</h3>
        <p>The <strong>clearQueue()</strong> operation removes all elements from the deque.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(1)</li>
          <li><strong>Space Complexity:</strong> O(1)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Reset deque pointers</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Set front to -1 (indicating an empty deque).</li>
              <li>Set rear to -1 (indicating an empty deque).</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Reset size counter</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Set size to 0.</li>
            </ul>
          </li>
        </ol>
      `,
      
      reverseQueue: `
        <h3 class="text-lg font-bold mb-2">Reverse Operation in Deque</h3>
        <p>The <strong>reverseQueue()</strong> operation reverses the order of elements in the deque.</p>
        
        <h4 class="font-semibold mt-3 mb-1">Time & Space Complexity:</h4>
        <ul class="list-disc pl-5 mb-3">
          <li><strong>Time Complexity:</strong> O(n)</li>
          <li><strong>Space Complexity:</strong> O(n)</li>
        </ul>
        
        <h4 class="font-semibold mb-1">Step-by-Step Explanation:</h4>
        <ol class="list-decimal pl-5">
          <li class="mb-1">
            <strong>Check if the deque is empty</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>If the deque is empty, return as there's nothing to reverse.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Use a temporary array or stack</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Create a temporary array or stack to hold all elements.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Extract all elements</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>While the deque is not empty, dequeue each element from the front and store it.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Reset deque pointers</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>Reset front and rear to their initial values.</li>
            </ul>
          </li>
          
          <li class="mb-1">
            <strong>Re-insert elements in reverse order</strong>
            <ul class="list-disc pl-5 mb-1">
              <li>For each stored element, enqueue it at the rear of the deque.</li>
              <li>This reverses the order of elements.</li>
            </ul>
          </li>
        </ol>
      `
    }
  };
  
  // Select the appropriate pseudocode based on queue type
  if (queueType === 'linear') {
    return pseudocodes.linear[operation] || 'Pseudocode not available for this operation';
  } else if (queueType === 'circular') {
    return pseudocodes.circular[operation] || 'Pseudocode not available for this operation';
  } else if (queueType === 'priority') {
    return pseudocodes.priority[operation] || 'Pseudocode not available for this operation';
  } else if (queueType === 'deque') {
    return pseudocodes.deque[operation] || 'Pseudocode not available for this operation';
  }
  
  return 'Pseudocode not available for this queue type';
};

// Helper function to get code snippets based on language and queue type
const getCodeSnippets = (language: string, queueType: string): Record<string, string> => {
  const snippets: Record<string, Record<string, string>> = {
    javascript: {
      enqueue: queueType === 'priority' 
        ? `// Priority Queue - Enqueue Operation
function enqueue(queue, value, priority) {
  if (queue.length >= maxSize) {
    return "Queue is full";
  }
  
  const newItem = { value, priority };
  let inserted = false;
  
  // Insert based on priority (lower number = higher priority)
  for (let i = 0; i < queue.length; i++) {
    if (queue[i].priority > priority) {
      queue.splice(i, 0, newItem);
      inserted = true;
      break;
    }
  }
  
  if (!inserted) {
    queue.push(newItem);
  }
  
  return \`Enqueued \${value} with priority \${priority}\`;
}`
        : queueType === 'deque'
        ? `// Deque - Enqueue Operation (at rear)
function enqueue(deque, value) {
  if (deque.length >= maxSize) {
    return "Deque is full";
  }
  
  deque.push({ value });
  return \`Enqueued \${value} at rear\`;
}`
        : `// ${queueType === 'circular' ? 'Circular' : 'Linear'} Queue - Enqueue Operation
function enqueue(queue, value) {
  if (queue.length >= maxSize) {
    return "Queue is full";
  }
  
  queue.push({ value });
  return \`Enqueued \${value}\`;
}`,
      
      dequeue: queueType === 'deque'
        ? `// Deque - Dequeue Operation (from front)
function dequeue(deque) {
  if (deque.length === 0) {
    return "Deque is empty";
  }
  
  const item = deque.shift();
  return \`Dequeued \${item.value} from front\`;
}`
        : `// ${queueType} Queue - Dequeue Operation
function dequeue(queue) {
  if (queue.length === 0) {
    return "Queue is empty";
  }
  
  const item = queue.shift();
  return \`Dequeued \${item.value}\`;
}`,
      
      peek: `// ${queueType} Queue - Peek Operation
function peek(queue) {
  if (queue.length === 0) {
    return "Queue is empty";
  }
  
  return \`Front element: \${queue[0].value}\`;
}`,
      
      rear: `// ${queueType} Queue - Rear Operation
function rear(queue) {
  if (queue.length === 0) {
    return "Queue is empty";
  }
  
  return \`Rear element: \${queue[queue.length - 1].value}\`;
}`,
      
      isEmpty: `// ${queueType} Queue - isEmpty Operation
function isEmpty(queue) {
  return queue.length === 0;
}`,
      
      isFull: queueType === 'circular'
        ? `// Circular Queue - isFull Operation
function isFull(queue) {
  return queue.length >= maxSize;
}`
        : `// ${queueType} Queue - isFull Operation
function isFull(queue) {
  return queue.length >= maxSize;
}`,
      
      size: `// ${queueType} Queue - Size Operation
function size(queue) {
  return queue.length;
}`,
      
      clearQueue: `// ${queueType} Queue - Clear Operation
function clearQueue(queue) {
  queue.length = 0;
  return "Queue cleared";
}`,
      
      reverseQueue: `// ${queueType} Queue - Reverse Operation
function reverseQueue(queue) {
  return queue.reverse();
}`,
      
      enqueueFront: `// Deque - Enqueue at Front Operation
function enqueueFront(deque, value) {
  if (deque.length >= maxSize) {
    return "Deque is full";
  }
  
  deque.unshift({ value });
  return \`Enqueued \${value} at front\`;
}`,
      
      dequeueRear: `// Deque - Dequeue from Rear Operation
function dequeueRear(deque) {
  if (deque.length === 0) {
    return "Deque is empty";
  }
  
  const item = deque.pop();
  return \`Dequeued \${item.value} from rear\`;
}`
    },
    
    java: {
      enqueue: queueType === 'priority'
        ? `// Priority Queue - Enqueue Operation
public void enqueue(int value, int priority) {
    if (isFull()) {
        System.out.println("Queue is full");
        return;
    }
    
    QueueItem newItem = new QueueItem(value, priority);
    
    // Find position based on priority
    int i;
    for (i = 0; i < size; i++) {
        if (items[i].getPriority() > priority) {
            break;
        }
    }
    
    // Shift elements to make space
    for (int j = size; j > i; j--) {
        items[j] = items[j-1];
    }
    
    items[i] = newItem;
    size++;
    System.out.println("Enqueued " + value + 
                      " with priority " + priority);
}`
        : queueType === 'circular'
        ? `// Circular Queue - Enqueue Operation
public void enqueue(int value) {
    if (isFull()) {
        System.out.println("Queue is full");
        return;
    }
    
    rear = (rear + 1) % capacity;
    items[rear] = value;
    size++;
    
    if (front == -1) {
        front = 0;
    }
    
    System.out.println("Enqueued " + value);
}`
        : queueType === 'deque'
        ? `// Deque - Enqueue at Rear Operation
public void enqueue(int value) {
    if (isFull()) {
        System.out.println("Deque is full");
        return;
    }
    
    // If queue is empty
    if (front == -1) {
        front = 0;
        rear = 0;
    } else {
        // Circular implementation
        rear = (rear + 1) % capacity;
    }
    
    items[rear] = value;
    size++;
    System.out.println("Enqueued " + value + " at rear");
}`
        : `// Linear Queue - Enqueue Operation
public void enqueue(int value) {
    if (isFull()) {
        System.out.println("Queue is full");
        return;
    }
    
    items[++rear] = value;
    size++;
    System.out.println("Enqueued " + value);
}`,
      
      dequeue: queueType === 'circular'
        ? `// Circular Queue - Dequeue Operation
public int dequeue() {
    if (isEmpty()) {
        System.out.println("Queue is empty");
        return -1;
    }
    
    int item = items[front];
    
    if (front == rear) {
        // Last element in queue
        front = -1;
        rear = -1;
    } else {
        front = (front + 1) % capacity;
    }
    
    size--;
    System.out.println("Dequeued " + item);
    return item;
}`
        : queueType === 'deque'
        ? `// Deque - Dequeue from Front Operation
public int dequeue() {
    if (isEmpty()) {
        System.out.println("Deque is empty");
        return -1;
    }
    
    int item = items[front];
    
    // If only one element
    if (front == rear) {
        front = -1;
        rear = -1;
    } else {
        // Circular implementation
        front = (front + 1) % capacity;
    }
    
    size--;
    System.out.println("Dequeued " + item + " from front");
    return item;
}`
        : `// Linear Queue - Dequeue Operation
public int dequeue() {
    if (isEmpty()) {
        System.out.println("Queue is empty");
        return -1;
    }
    
    int item = items[front++];
    size--;
    
    // Reset pointers if queue becomes empty
    if (front > rear) {
        front = 0;
        rear = -1;
    }
    
    System.out.println("Dequeued " + item);
    return item;
}`,
      
      peek: `// ${queueType} Queue - Peek Operation
public int peek() {
    if (isEmpty()) {
        System.out.println("Queue is empty");
        return -1;
    }
    
    return items[front];
}`,
      
      rear: `// ${queueType} Queue - Rear Operation
public int rear() {
    if (isEmpty()) {
        System.out.println("Queue is empty");
        return -1;
    }
    
    return items[rear];
}`,
      
      isEmpty: `// ${queueType} Queue - isEmpty Operation
public boolean isEmpty() {
    return size == 0;
}`,
      
      isFull: `// ${queueType} Queue - isFull Operation
public boolean isFull() {
    return size == capacity;
}`,
      
      size: `// ${queueType} Queue - Size Operation
public int size() {
    return size;
}`,
      
      clearQueue: `// ${queueType} Queue - Clear Operation
public void clearQueue() {
    front = 0;
    rear = -1;
    size = 0;
    System.out.println("Queue cleared");
}`,
      
      reverseQueue: `// ${queueType} Queue - Reverse Operation
public void reverseQueue() {
    if (isEmpty()) {
        return;
    }
    
    // Using a temporary stack to reverse
    Stack<Integer> stack = new Stack<>();
    
    // Push all elements to stack
    while (!isEmpty()) {
        stack.push(dequeue());
    }
    
    // Pop from stack and enqueue
    while (!stack.isEmpty()) {
        enqueue(stack.pop());
    }
    
    System.out.println("Queue reversed");
}`,
      
      enqueueFront: `// Deque - Enqueue at Front Operation
public void enqueueFront(int value) {
    if (isFull()) {
        System.out.println("Deque is full");
        return;
    }
    
    // If queue is empty
    if (front == -1) {
        front = 0;
        rear = 0;
    } else {
        // Circular implementation
        front = (front - 1 + capacity) % capacity;
    }
    
    items[front] = value;
    size++;
    System.out.println("Enqueued " + value + " at front");
}`,
      
      dequeueRear: `// Deque - Dequeue from Rear Operation
public int dequeueRear() {
    if (isEmpty()) {
        System.out.println("Deque is empty");
        return -1;
    }
    
    int item = items[rear];
    
    // If only one element
    if (front == rear) {
        front = -1;
        rear = -1;
    } else {
        // Circular implementation
        rear = (rear - 1 + capacity) % capacity;
    }
    
    size--;
    System.out.println("Dequeued " + item + " from rear");
    return item;
}`
    },
    
    python: {
      enqueue: queueType === 'priority'
        ? `# Priority Queue - Enqueue Operation
def enqueue(self, value, priority):
    if self.is_full():
        print("Queue is full")
        return
    
    # Create new item with priority
    new_item = {"value": value, "priority": priority}
    
    # Find position based on priority
    position = 0
    for i, item in enumerate(self.items):
        if item["priority"] > priority:
            position = i
            break
        else:
            position = i + 1
    
    # Insert at the right position
    self.items.insert(position, new_item)
    self.size += 1
    print(f"Enqueued {value} with priority {priority}")`
        : queueType === 'circular'
        ? `# Circular Queue - Enqueue Operation
def enqueue(self, value):
    if self.is_full():
        print("Queue is full")
        return
    
    # If queue is empty, set front to 0
    if self.front == -1:
        self.front = 0
    
    # Circular increment of rear
    self.rear = (self.rear + 1) % self.capacity
    self.items[self.rear] = value
    self.size += 1
    print(f"Enqueued {value}")`
        : queueType === 'deque'
        ? `# Deque - Enqueue at Rear Operation
def enqueue(self, value):
    if self.is_full():
        print("Deque is full")
        return
    
    # If deque is empty
    if self.front == -1:
        self.front = 0
        self.rear = 0
    else:
        # Circular increment of rear
        self.rear = (self.rear + 1) % self.capacity
    
    self.items[self.rear] = value
    self.size += 1
    print(f"Enqueued {value} at rear")`
        : `# Linear Queue - Enqueue Operation
def enqueue(self, value):
    if self.is_full():
        print("Queue is full")
        return
    
    self.rear += 1
    self.items[self.rear] = value
    self.size += 1
    print(f"Enqueued {value}")`,
      
      dequeue: queueType === 'circular'
        ? `# Circular Queue - Dequeue Operation
def dequeue(self):
    if self.is_empty():
        print("Queue is empty")
        return None
    
    item = self.items[self.front]
    
    # If this is the last element
    if self.front == self.rear:
        self.front = -1
        self.rear = -1
    else:
        # Circular increment of front
        self.front = (self.front + 1) % self.capacity
    
    self.size -= 1
    print(f"Dequeued {item}")
    return item`
        : queueType === 'deque'
        ? `# Deque - Dequeue from Front Operation
def dequeue(self):
    if self.is_empty():
        print("Deque is empty")
        return None
    
    item = self.items[self.front]
    
    # If this is the last element
    if self.front == self.rear:
        self.front = -1
        self.rear = -1
    else:
        # Circular increment of front
        self.front = (self.front + 1) % self.capacity
    
    self.size -= 1
    print(f"Dequeued {item} from front")
    return item`
        : `# Linear Queue - Dequeue Operation
def dequeue(self):
    if self.is_empty():
        print("Queue is empty")
        return None
    
    item = self.items[self.front]
    self.front += 1
    self.size -= 1
    
    # Reset pointers if queue becomes empty
    if self.front > self.rear:
        self.front = 0
        self.rear = -1
    
    print(f"Dequeued {item}")
    return item`,
      
      peek: `# ${queueType} Queue - Peek Operation
def peek(self):
    if self.is_empty():
        print("Queue is empty")
        return None
    
    return self.items[self.front]`,
      
      rear: `# ${queueType} Queue - Rear Operation
def rear(self):
    if self.is_empty():
        print("Queue is empty")
        return None
    
    return self.items[self.rear]`,
      
      isEmpty: `# ${queueType} Queue - isEmpty Operation
def is_empty(self):
    return self.size == 0`,
      
      isFull: `# ${queueType} Queue - isFull Operation
def is_full(self):
    return self.size == self.capacity`,
      
      size: `# ${queueType} Queue - Size Operation
def size(self):
    return self.size`,
      
      clearQueue: `# ${queueType} Queue - Clear Operation
def clear_queue(self):
    self.front = 0
    self.rear = -1
    self.size = 0
    print("Queue cleared")`,
      
      reverseQueue: `# ${queueType} Queue - Reverse Operation
def reverse_queue(self):
    if self.is_empty():
        return
    
    # Using a temporary stack to reverse
    stack = []
    
    # Push all elements to stack
    while not self.is_empty():
        stack.append(self.dequeue())
    
    # Pop from stack and enqueue
    while stack:
        self.enqueue(stack.pop())
    
    print("Queue reversed")`,
      
      enqueueFront: `# Deque - Enqueue at Front Operation
def enqueue_front(self, value):
    if self.is_full():
        print("Deque is full")
        return
    
    # If deque is empty
    if self.front == -1:
        self.front = 0
        self.rear = 0
    else:
        # Circular decrement of front
        self.front = (self.front - 1) % self.capacity
    
    self.items self.front] = value
    self.size += 1
    print(f"Enqueued {value} at front")`,
      
      dequeueRear: `# Deque - Dequeue from Rear Operation
def dequeue_rear(self):
    if self.is_empty():
        print("Deque is empty")
        return None
    
    item = self.items[self.rear]
    
    # If this is the last element
    if self.front == self.rear:
        self.front = -1
        self.rear = -1
    else:
        # Circular decrement of rear
        self.rear = (self.rear - 1) % self.capacity
    
    self.size -= 1
    print(f"Dequeued {item} from rear")
    return item`
    },
    
    cpp: {
      enqueue: queueType === 'priority'
        ? `// Priority Queue - Enqueue Operation
void enqueue(int value, int priority) {
    if (isFull()) {
        cout << "Queue is full" << endl;
        return;
    }
    
    // Create new item
    QueueItem newItem;
    newItem.value = value;
    newItem.priority = priority;
    
    // Find position based on priority
    int i;
    for (i = 0; i < size; i++) {
        if (items[i].priority > priority) {
            break;
        }
    }
    
    // Shift elements to make space
    for (int j = size; j > i; j--) {
        items[j] = items[j-1];
    }
    
    items[i] = newItem;
    size++;
    cout << "Enqueued " << value << " with priority " 
         << priority << endl;
}`
        : queueType === 'circular'
        ? `// Circular Queue - Enqueue Operation
void enqueue(int value) {
    if (isFull()) {
        cout << "Queue is full" << endl;
        return;
    }
    
    if (front == -1) {
        front = 0;
    }
    
    rear = (rear + 1) % capacity;
    items[rear] = value;
    size++;
    
    cout << "Enqueued " << value << endl;
}`
        : queueType === 'deque'
        ? `// Deque - Enqueue at Rear Operation
void enqueue(int value) {
    if (isFull()) {
        cout << "Deque is full" << endl;
        return;
    }
    
    // If deque is empty
    if (front == -1) {
        front = 0;
        rear = 0;
    } else {
        // Circular increment of rear
        rear = (rear + 1) % capacity;
    }
    
    items[rear] = value;
    size++;
    cout << "Enqueued " << value << " at rear" << endl;
}`
        : `// Linear Queue - Enqueue Operation
void enqueue(int value) {
    if (isFull()) {
        cout << "Queue is full" << endl;
        return;
    }
    
    items[++rear] = value;
    size++;
    cout << "Enqueued " << value << endl;
}`,
      
      dequeue: queueType === 'circular'
        ? `// Circular Queue - Dequeue Operation
int dequeue() {
    if (isEmpty()) {
        cout << "Queue is empty" << endl;
        return -1;
    }
    
    int item = items[front];
    
    if (front == rear) {
        // Last element in queue
        front = -1;
        rear = -1;
    } else {
        front = (front + 1) % capacity;
    }
    
    size--;
    cout << "Dequeued " << item << endl;
    return item;
}`
        : queueType === 'deque'
        ? `// Deque - Dequeue from Front Operation
int dequeue() {
    if (isEmpty()) {
        cout << "Deque is empty" << endl;
        return -1;
    }
    
    int item = items[front];
    
    // If only one element
    if (front == rear) {
        front = -1;
        rear = -1;
    } else {
        // Circular implementation
        front = (front + 1) % capacity;
    }
    
    size--;
    cout << "Dequeued " << item << " from front" << endl;
    return item;
}`
        : `// Linear Queue - Dequeue Operation
int dequeue() {
    if (isEmpty()) {
        cout << "Queue is empty" << endl;
        return -1;
    }
    
    int item = items[front++];
    size--;
    
    // Reset pointers if queue becomes empty
    if (front > rear) {
        front = 0;
        rear = -1;
    }
    
    cout << "Dequeued " << item << endl;
    return item;
}`,
      
      peek: `// ${queueType} Queue - Peek Operation
int peek() {
    if (isEmpty()) {
        cout << "Queue is empty" << endl;
        return -1;
    }
    
    return items[front];
}`,
      
      rear: `// ${queueType} Queue - Rear Operation
int rear() {
    if (isEmpty()) {
        cout << "Queue is empty" << endl;
        return -1;
    }
    
    return items[rear];
}`,
      
      isEmpty: `// ${queueType} Queue - isEmpty Operation
bool isEmpty() {
    return size == 0;
}`,
      
      isFull: `// ${queueType} Queue - isFull Operation
bool isFull() {
    return size == capacity;
}`,
      
      size: `// ${queueType} Queue - Size Operation
int getSize() {
    return size;
}`,
      
      clearQueue: `// ${queueType} Queue - Clear Operation
void clearQueue() {
    front = 0;
    rear = -1;
    size = 0;
    cout << "Queue cleared" << endl;
}`,
      
      reverseQueue: `// ${queueType} Queue - Reverse Operation
void reverseQueue() {
    if (isEmpty()) {
        return;
    }
    
    // Using a temporary stack to reverse
    stack<int> s;
    
    // Push all elements to stack
    while (!isEmpty()) {
        s.push(dequeue());
    }
    
    // Pop from stack and enqueue
    while (!s.empty()) {
        enqueue(s.top());
        s.pop();
    }
    
    cout << "Queue reversed" << endl;
}`,
      
      enqueueFront: `// Deque - Enqueue at Front Operation
void enqueueFront(int value) {
    if (isFull()) {
        cout << "Deque is full" << endl;
        return;
    }
    
    // If deque is empty
    if (front == -1) {
        front = 0;
        rear = 0;
    } else {
        // Circular decrement of front
        front = (front - 1 + capacity) % capacity;
    }
    
    items[front] = value;
    size++;
    cout << "Enqueued " << value << " at front" << endl;
}`,
      
      dequeueRear: `// Deque - Dequeue from Rear Operation
int dequeueRear() {
    if (isEmpty()) {
        cout << "Deque is empty" << endl;
        return -1;
    }
    
    int item = items[rear];
    
    // If only one element
    if (front == rear) {
        front = -1;
        rear = -1;
    } else {
        // Circular decrement of rear
        rear = (rear - 1 + capacity) % capacity;
    }
    
    size--;
    cout << "Dequeued " << item << " from rear" << endl;
    return item;
}`
    }
  };
  
  return snippets[language] || {};
};

export default CodePanel;