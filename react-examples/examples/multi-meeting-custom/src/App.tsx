import React, { useState, useCallback, useRef } from 'react';
import { Meeting } from './Meeting';

function App() {
  const url = new URL(window.location.href);
  const urlAuthToken1 = url.searchParams.get('authToken');
  const urlAuthToken2 = url.searchParams.get('authToken2');
  const autoInitializeMeeting1 = url.searchParams.get('autoInitializeMeeting1');
  const autoInitializeMeeting2 = url.searchParams.get('autoInitializeMeeting2');
  const showSetupScreen1 = url.searchParams.get('showSetupScreen1') !== 'false';
  const showSetupScreen2 = url.searchParams.get('showSetupScreen2') !== 'false';
  const baseURI = url.searchParams.get('baseURI') || 'dyte.io';

  const [authToken1, setAuthToken1] = useState(urlAuthToken1 || '');
  const [authToken2, setAuthToken2] = useState(urlAuthToken2 || '');
  const [initializeMeeting1, setInitializeMeeting1] = useState(autoInitializeMeeting1 === 'true');
  const [initializeMeeting2, setInitializeMeeting2] = useState(autoInitializeMeeting2 === 'true');
  
  // State for resizable containers
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on divider
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Handle mouse move for resizing
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    // Calculate new left width percentage (with bounds)
    const newLeftWidth = Math.max(10, Math.min(90, (mouseX / containerWidth) * 100));
    setLeftWidth(newLeftWidth);
  }, [isDragging]);

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const rightWidth = 100 - leftWidth;

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <div ref={containerRef} className="flex w-full h-full">
      <div 
        id="meeting1" 
        className="border-2 border-black flex-shrink-0"
        style={{ width: `${leftWidth}%` }}
      >
      {!initializeMeeting1 ? (
        <div className="flex">
          <input
            type="text"
            id="auth_token"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 m-2"
            placeholder="Auth Token"
            required
            value={authToken1}
            onChange={(e) => setAuthToken1(e.target.value)}
          />
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 m-2"
            onClick={() => setInitializeMeeting1(true)}
          >
            Initialize
          </button>
        </div>
      ) : (
        <Meeting baseURI={baseURI} authToken={authToken1} meetingIdentifier="meeting1" />
      )}
      </div>
      
      {/* Resizable divider */}
      <div 
        className={`w-1 bg-gray-400 hover:bg-gray-600 cursor-col-resize flex-shrink-0 relative group ${
          isDragging ? 'bg-gray-600' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator */}
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-8 bg-gray-600 rounded-full"></div>
        </div>
      </div>
      
      <div 
        id="meeting2" 
        className="border-2 border-black flex-shrink-0"
        style={{ width: `${rightWidth}%` }}
      >
      {!initializeMeeting2 ? (
        <div className="flex">
          <input
            type="text"
            id="auth_token"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 m-2"
            placeholder="Auth Token"
            required
            value={authToken2}
            onChange={(e) => setAuthToken2(e.target.value)}
          />
          <button
            type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 m-2"
            onClick={() => setInitializeMeeting2(true)}
          >
            Initialize
          </button>
        </div>
      ) : (
        <Meeting baseURI={baseURI} authToken={authToken2} meetingIdentifier='meeting2' />
      )}
      </div>
    </div>
  );
}

export default App;
