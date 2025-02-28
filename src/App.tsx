import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import QueueVisualizer from './components/QueueVisualizer';
import OperationsPanel from './components/OperationsPanel';
import CodePanel from './components/CodePanel';
import Header from './components/Header';
import { QueueProvider } from './context/QueueContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // return (
  //   <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
  //     <QueueProvider>
  //       <div className="container mx-auto px-4 py-8">
  //         <div className="flex justify-between items-center mb-8">
  //           <Header />
  //           <button
  //             onClick={toggleDarkMode}
  //             className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-200`}
  //             aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
  //           >
  //             {darkMode ? <Sun size={20} /> : <Moon size={20} />}
  //           </button>
  //         </div>
          
  //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  //           <div className="lg:col-span-2">
  //             <QueueVisualizer />
  //           </div>
  //           <div>
  //             <OperationsPanel />
  //           </div>
  //         </div>
          
  //         <div className="mt-8">
  //           <CodePanel />
  //         </div>
  //       </div>
  //     </QueueProvider>
  //   </div>
  // );


  return (
  <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
    <QueueProvider>
      <div className="container mx-auto px-4 py-8">
        {/* Header without text-white */}
        <div className="flex justify-between items-center mb-8">
<Header className={darkMode ? 'text-white' : 'text-black'} />
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-200`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Apply text-white globally except in Header */}
        <div className="text-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <QueueVisualizer />
            </div>
            <div>
              <OperationsPanel />
            </div>
          </div>

          <div className="mt-8">
            <CodePanel />
          </div>
        </div>
      </div>
    </QueueProvider>
  </div>
);

}

export default App;