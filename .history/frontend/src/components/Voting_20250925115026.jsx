import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { voteAPI } from '../services/api.js';
import { VOTE_OPTIONS } from '../utils/constants.js';

const Voting = ({ onVoteCast, socket }) => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVote = async () => {
    if (!selectedOption) return;

    setLoading(true);
    setError('');

    try {
      await voteAPI.castVote(selectedOption);
      
      // Notify parent component
      onVoteCast();
      
      // Emit vote event for real-time updates
      if (socket) {
        socket.emit('newVote');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to cast vote');
    } finally {
      setLoading(false);
    }
  };

  if (user?.hasVoted) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Thank You for Voting!
          </h2>
          <p className="text-gray-600 mb-6">
            You voted for <strong>{VOTE_OPTIONS[user.votedFor]?.label}</strong>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Cast Your Vote</h1>
          <p className="text-blue-100">Welcome, {user?.username}! Choose your option below.</p>
        </div>

        {error && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {Object.values(VOTE_OPTIONS).map((option) => (
            <div
              key={option.id}
              className={`vote-option bg-white rounded-xl p-6 cursor-pointer transition-all duration-200 border-2 ${
                selectedOption === option.id
                  ? 'border-blue-500 shadow-xl'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: option.color }}
              >
                {option.label.charAt(option.label.length - 1)}
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
                {option.label}
              </h3>
              <p className="text-gray-600 text-center">
                Vote for this option if you support {option.label}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleVote}
            disabled={!selectedOption || loading}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? 'Casting Vote...' : 'Cast Vote'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Voting;