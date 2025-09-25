import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { useSocket } from './hooks/useSocket.js';
import Login from './components/Login.jsx';
import Voting from './components/Voting.jsx';
import Results from './components/Results.jsx';

const AppContent = () => {
  const { user, loading } = useAuth();
  const { socket, isConnected } = useSocket();
  const [currentView, setCurrentView] = useState('voting');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleVoteCast = () => {
    setCurrentView('results');
  };

  const toggleView = () => {
    setCurrentView(currentView === 'voting' ? 'results' : 'voting');
  };

  return (
    <div>
      {currentView === 'voting' && !user.hasVoted ? (
        <Voting onVoteCast={handleVoteCast} socket={socket} />
      ) : (
        <Results socket={socket} />
      )}
      
      {/* Navigation Button */}
      {/* <div className="fixed bottom-4 right-4">
        <button
          onClick={toggleView}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
        >
          {currentView === 'voting' ? 'View Results' : 'Back to Voting'}
        </button>
      </div> */}

      {/* Connection Status */}
      <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
        isConnected 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;