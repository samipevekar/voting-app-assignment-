import React, { useState, useEffect } from 'react';
import { voteAPI } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { VOTE_OPTIONS } from '../utils/constants.js';
import Chart from './Chart.jsx';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Trophy, 
  Activity, 
  RefreshCw, 
  LogOut, 
  Eye,
  Award,
  Zap,
  Clock,
  ArrowRight,
  Wifi,
  WifiOff
} from 'lucide-react';

const Results = ({ socket }) => {
  const [results, setResults] = useState({
    optionA: 0, optionB: 0, optionC: 0, total: 0
  });
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(!!socket);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [animatingOptions, setAnimatingOptions] = useState({});
  const { user, logout } = useAuth();

  const fetchResults = async () => {
    try {
      const response = await voteAPI.getResults();
      const newResults = response.data;
      
      // Check which options have changed for animation
      const changed = {};
      Object.keys(newResults).forEach(key => {
        if (key !== 'total' && newResults[key] !== results[key]) {
          changed[key] = true;
        }
      });
      
      setAnimatingOptions(changed);
      setResults(newResults);
      setLastUpdated(new Date());
      
      // Clear animations after 1 second
      setTimeout(() => setAnimatingOptions({}), 1000);
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
        const changed = {};
        Object.keys(newResults).forEach(key => {
          if (key !== 'total' && newResults[key] !== results[key]) {
            changed[key] = true;
          }
        });
        
        setAnimatingOptions(changed);
        setResults(newResults);
        setLastUpdated(new Date());
        
        setTimeout(() => setAnimatingOptions({}), 1000);
      });

      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));

      return () => {
        socket.off('resultsUpdate');
        socket.off('connect');
        socket.off('disconnect');
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

  const getWinningOption = () => {
    const options = Object.entries(results).filter(([key]) => key !== 'total');
    return options.reduce((max, current) => current[1] > max[1] ? current : max, ['', 0]);
  };

  const [winningOptionId] = getWinningOption();
  const winningOption = VOTE_OPTIONS[winningOptionId];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <RefreshCw className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Loading Results...
          </h2>
          <p className="text-gray-500 mt-2">Fetching the latest voting data</p>
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

      <div className="relative py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white backdrop-blur-sm bg-opacity-95 rounded-3xl shadow-2xl border border-white border-opacity-20 p-8 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Live Results
                  </h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <p className="text-gray-600">Real-time voting dashboard</p>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                      isConnected 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                      <span>{isConnected ? 'Live' : 'Offline'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-4 py-3 border border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">{user?.username}</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r cursor-pointer from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-medium hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-500/30"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Total Votes */}
            <div className="bg-white backdrop-blur-sm bg-opacity-95 rounded-2xl shadow-xl border border-white border-opacity-20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Votes</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{results.total}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Leading Option */}
            {/* <div className="bg-white backdrop-blur-sm bg-opacity-95 rounded-2xl shadow-xl border border-white border-opacity-20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Leading Option</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">
                    {winningOption?.label || 'Tied'}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            </div> */}

            {/* Last Updated */}
            <div className="bg-white backdrop-blur-sm bg-opacity-95 rounded-2xl shadow-xl border border-white border-opacity-20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Last Updated</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid xl:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="xl:col-span-2">
              <div className="bg-white backdrop-blur-sm bg-opacity-95 rounded-3xl shadow-2xl border border-white border-opacity-20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    <span>Vote Distribution</span>
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-500">Live Data</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <Chart results={results} />
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="space-y-6">
              {/* Voting Statistics */}
              <div className="bg-white backdrop-blur-sm bg-opacity-95 rounded-3xl shadow-2xl border border-white border-opacity-20 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span>Live Statistics</span>
                </h2>
                
                <div className="space-y-5">
                  {Object.values(VOTE_OPTIONS).map((option) => {
                    const votes = results[option.id];
                    const percentage = results.total > 0 ? ((votes / results.total) * 100).toFixed(1) : 0;
                    const isWinning = option.id === winningOptionId && results.total > 0;
                    const isAnimating = animatingOptions[option.id];
                    
                    return (
                      <div 
                        key={option.id} 
                        className={`border-b border-gray-100 pb-4 last:border-b-0 transition-all duration-500 ${
                          isAnimating ? 'scale-105 bg-blue-50 rounded-lg p-3 -m-1' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-3">
                            {isWinning && (
                              <Trophy className="w-5 h-5 text-yellow-500 animate-bounce" />
                            )}
                            <span className="font-bold text-gray-800">{option.label}</span>
                            {isAnimating && (
                              <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
                            )}
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-800">{votes}</span>
                            <span className="text-gray-600 ml-1">votes</span>
                            <div className="text-sm text-gray-500">({percentage}%)</div>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                            <div 
                              className={`h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                                isWinning ? 'shadow-lg' : ''
                              }`}
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: option.color
                              }}
                            >
                              {isWinning && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-700">Total Votes:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {results.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Status */}
              <div className="bg-white backdrop-blur-sm bg-opacity-95 rounded-2xl shadow-xl border border-white border-opacity-20 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-green-600" />
                  <span>Connection Status</span>
                </h3>
                
                <div className="space-y-3">
                  <div className={`flex items-center space-x-3 p-3 rounded-xl ${
                    isConnected ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      isConnected ? 'bg-green-500 animate-pulse' : 'bg-orange-500'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      isConnected ? 'text-green-700' : 'text-orange-700'
                    }`}>
                      {isConnected ? 'Live updates enabled' : 'Auto-refresh active'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Results update automatically when new votes are cast
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vote Again Section */}
          {user?.hasVoted && (
            <div className="mt-8 text-center">
              <div className="bg-white backdrop-blur-sm bg-opacity-95 rounded-2xl shadow-xl border border-white border-opacity-20 p-6 inline-block">
                {/* <p className="text-gray-600 mb-4">Want to participate in more voting?</p> */}
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                >
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;