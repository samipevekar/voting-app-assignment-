import React, { useState, useEffect } from 'react';
import { voteAPI } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { VOTE_OPTIONS } from '../utils/constants.js';
import Chart from './Chart.jsx';

const Results = ({ socket }) => {
  const [results, setResults] = useState({
    optionA: 0, optionB: 0, optionC: 0, total: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  const fetchResults = async () => {
    try {
      const response = await voteAPI.getResults();
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();

    // Set up socket listener for real-time updates
    if (socket) {
      socket.emit('joinResults');
      socket.on('resultsUpdate', (newResults) => {
        setResults(newResults);
      });

      return () => {
        socket.off('resultsUpdate');
      };
    }
  }, [socket]);

  // Auto-refresh every 5 seconds as fallback
  useEffect(() => {
    if (!socket) {
      const interval = setInterval(fetchResults, 5000);
      return () => clearInterval(interval);
    }
  }, [socket]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-white text-xl">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Live Results</h1>
            <p className="text-blue-100">Real-time voting results</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, {user?.username}</span>
            <button
              onClick={logout}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Vote Distribution</h2>
            <Chart results={results} />
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Voting Statistics</h2>
            
            <div className="space-y-4">
              {Object.values(VOTE_OPTIONS).map((option) => {
                const votes = results[option.id];
                const percentage = results.total > 0 ? ((votes / results.total) * 100).toFixed(1) : 0;
                
                return (
                  <div key={option.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">{option.label}</span>
                      <span className="text-gray-600">{votes} votes ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: option.color
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Votes:</span>
                <span className="text-blue-600">{results.total}</span>
              </div>
            </div>

            {socket && (
              <div className="mt-4 flex items-center text-green-600">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live updates enabled
              </div>
            )}
          </div>
        </div>

        {/* Vote Again Section */}
        {user?.hasVoted && (
          <div className="mt-8 text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              Back to Voting
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;