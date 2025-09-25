import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { voteAPI } from '../services/api.js';
import { VOTE_OPTIONS } from '../utils/constants.js';
import { CheckCircle, Vote, Users, Award, Sparkles, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';

const Voting = ({ onVoteCast, socket }) => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoveredOption, setHoveredOption] = useState(null);

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

  // Thank You Screen for users who have already voted
  if (user?.hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400 to-cyan-400 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="relative max-w-md w-full">
          <div className="bg-white backdrop-blur-sm bg-opacity-95 rounded-3xl shadow-2xl border border-white border-opacity-20 p-8 text-center relative overflow-hidden">
            {/* Success Header */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            
            {/* Success Animation */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Thank You for Voting!
            </h2>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-200">
              <p className="text-gray-700 text-lg">
                You voted for{' '}
                <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                  {VOTE_OPTIONS[user.votedFor]?.label}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Your voice has been recorded</span>
              <Sparkles className="w-4 h-4" />
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/30"
            >
              <div className="flex items-center justify-center space-x-2">
                <Award className="w-5 h-5" />
                <span>View Results</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400 to-pink-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl">
              <Vote className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Cast Your Vote
            </h1>
            
            <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl p-4 inline-block border border-white border-opacity-30 shadow-lg">
              <p className="text-gray-700 text-lg">
                Welcome, <span className="font-bold text-blue-600">{user?.username}</span>! 
                Choose your option below.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center space-x-3 shadow-lg">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Voting Options */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-12">
            {Object.values(VOTE_OPTIONS).map((option, index) => (
              <div
                key={option.id}
                className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedOption === option.id ? 'scale-105' : ''
                }`}
                onClick={() => setSelectedOption(option.id)}
                onMouseEnter={() => setHoveredOption(option.id)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                <div
                  className={`bg-white backdrop-blur-sm bg-opacity-95 rounded-3xl p-8 border-3 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden ${
                    selectedOption === option.id
                      ? 'border-blue-500 shadow-2xl shadow-blue-500/25'
                      : 'border-white border-opacity-30 hover:border-gray-200'
                  }`}
                >
                  {/* Selection Indicator */}
                  {selectedOption === option.id && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-8 h-8 text-blue-500 animate-pulse" />
                    </div>
                  )}

                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Option Icon */}
                  <div className="relative mb-6">
                    <div
                      className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-2xl transform group-hover:rotate-6 transition-transform duration-300"
                      style={{ backgroundColor: option.color }}
                    >
                      {option.label.charAt(option.label.length - 1)}
                    </div>
                    
                    {hoveredOption === option.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                    )}
                  </div>

                  {/* Option Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-3">
                      {option.label}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Vote for this option if you support{' '}
                      <span className="font-semibold text-gray-800">{option.label}</span>
                    </p>

                    {/* Option Stats (placeholder) */}
                    <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{Math.floor(Math.random() * 50) + 10} votes</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                    selectedOption === option.id ? 'opacity-30' : ''
                  }`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Vote Button */}
          <div className="text-center">
            <div className="inline-block">
              <button
                onClick={handleVote}
                disabled={!selectedOption || loading}
                className={`relative px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-500/30 overflow-hidden ${
                  !selectedOption || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95'
                }`}
              >
                {/* Button Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span>Casting Vote...</span>
                    </>
                  ) : (
                    <>
                      <Vote className="w-6 h-6" />
                      <span>Cast Vote</span>
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </div>
              </button>

              {/* Selection Indicator */}
              {selectedOption && !loading && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Selected: {VOTE_OPTIONS[selectedOption]?.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voting;