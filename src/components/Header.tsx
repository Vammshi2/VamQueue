// import React from 'react';
// import { Square as QueueSquare } from 'lucide-react';
// import { useQueue } from '../context/QueueContext';

// const Header: React.FC = () => {
//   const { queueType, setQueueType } = useQueue();

//   return (
//     <div className="flex flex-col md:flex-row md:items-center gap-4">
//       <div className="flex items-center">
//         <QueueSquare className="mr-2 text-blue-500" size={32} />
//         <h1 className="text-2xl md:text-3xl font-bold">Queue Visualizer</h1>
//       </div>
      
//       <div className="flex gap-2">
//         <button 
//           onClick={() => setQueueType('linear')}
//           className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
//             queueType === 'linear' 
//               ? 'bg-blue-500 text-white' 
//               : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
//           }`}
//         >
//           Linear
//         </button>
//         <button 
//           onClick={() => setQueueType('circular')}
//           className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
//             queueType === 'circular' 
//               ? 'bg-blue-500 text-white' 
//               : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
//           }`}
//         >
//           Circular
//         </button>
//         <button 
//           onClick={() => setQueueType('priority')}
//           className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
//             queueType === 'priority' 
//               ? 'bg-blue-500 text-white' 
//               : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
//           }`}
//         >
//           Priority
//         </button>
//         <button 
//           onClick={() => setQueueType('deque')}
//           className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
//             queueType === 'deque' 
//               ? 'bg-blue-500 text-white' 
//               : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
//           }`}
//         >
//           Deque
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Header;



import React from 'react';
import { Square as QueueSquare } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { queueType, setQueueType } = useQueue();

  return (
    <div className={`flex flex-col md:flex-row md:items-center gap-4 ${className}`}>
      <div className="flex items-center">
        <QueueSquare className="mr-2 text-blue-500" size={32} />
        <h1 className="text-2xl md:text-3xl font-bold">Queue Visualizer</h1>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => setQueueType('linear')}
          className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
            queueType === 'linear' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Linear
        </button>
        <button 
          onClick={() => setQueueType('circular')}
          className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
            queueType === 'circular' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Circular
        </button>
        <button 
          onClick={() => setQueueType('priority')}
          className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
            queueType === 'priority' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Priority
        </button>
        <button 
          onClick={() => setQueueType('deque')}
          className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
            queueType === 'deque' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Deque
        </button>
      </div>
    </div>
  );
};

export default Header;
