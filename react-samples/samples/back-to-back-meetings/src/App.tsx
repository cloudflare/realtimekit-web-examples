import { useState, useEffect } from 'react';
import { Meeting } from './Meeting';

function App() {
  const url = new URL(window.location.href);
  const urlAuthToken1 = url.searchParams.get('authToken1');
  const urlAuthToken2 = url.searchParams.get('authToken2');
  const baseURI = url.searchParams.get('baseURI') || 'dyte.io';

  const [authToken1] = useState(urlAuthToken1 || '');
  const [authToken2] = useState(urlAuthToken2 || '');
  const [currentMeeting, setCurrentMeeting] = useState<1 | 2 | null>(null);
  const [demoComplete, setDemoComplete] = useState(false);

  // Auto-initialize first meeting if token is available
  useEffect(() => {
    if (authToken1 && !currentMeeting) {
      setCurrentMeeting(1);
    }
  }, [authToken1, currentMeeting]);

  const handleMeetingLeft = () => {
    console.log('Meeting left, automatically switching to next meeting');
    
    if (currentMeeting === 1 && authToken2) {
      // Switch from Meeting 1 to Meeting 2
      setCurrentMeeting(2);
    } else {
      // Demo complete - either leaving Meeting 2 or no next meeting token
      setCurrentMeeting(null);
      setDemoComplete(true);
    }
  };

  const getCurrentAuthToken = () => {
    if (currentMeeting === 1) return authToken1;
    if (currentMeeting === 2) return authToken2;
    return '';
  };
  return (
    <div className="w-full h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Back to Back Meetings</h1>
          <div className="flex items-center space-x-4">
            {currentMeeting && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Meeting {currentMeeting} Active
              </span>
            )}

          </div>
        </div>
      </div>

      {/* Meeting Container */}
      <div className="flex-1" style={{ height: 'calc(100vh - 80px)' }}>
        {!authToken1 && !authToken2 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl mx-auto px-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                Welcome to Back-to-Back Meetings
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-red-900 mb-3">No Auth Tokens Provided</h3>
                <p className="text-red-800 mb-3">
                  Please provide authToken1 and/or authToken2 in the URL parameters.
                </p>
                <p className="text-sm text-red-600">
                  <strong>Example:</strong> ?authToken1=token1&authToken2=token2
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-blue-900 mb-3">How it works:</h3>
                <div className="text-left space-y-3 text-blue-800">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                    <p>Meeting 1 will start automatically when you provide authToken1</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                    <p><strong>To switch to Meeting 2:</strong> Use the "Leave" button in the bottom control bar</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                    <p>Meeting 2 will automatically start when you leave Meeting 1 (if authToken2 is provided)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : demoComplete ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl mx-auto px-6">
              <h2 className="text-2xl font-semibold text-green-700 mb-6">
                🎉 Demo Complete!
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-green-900 mb-3">Back-to-Back Meetings Demo Finished</h3>
                <p className="text-green-800 mb-4">
                  You have successfully experienced the back-to-back meetings functionality by switching between Meeting 1 and Meeting 2.
                </p>
                <p className="text-green-700">
                  To try the demo again, please reload the page.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Reload Page to Try Again
              </button>
            </div>
          </div>
        ) : (
          <div style={{ height: '90vh', width: '100%' }}>
            <Meeting
              authToken={getCurrentAuthToken()}
              baseURI={baseURI}
              meetingIdentifier={`meeting-${currentMeeting}`}
              onMeetingLeft={handleMeetingLeft}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
