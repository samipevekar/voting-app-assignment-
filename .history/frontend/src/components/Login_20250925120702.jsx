import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { User, Vote, Shield, Clock, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters long');
      setLoading(false);
      return;
    }

    const result = await login(username.trim());
        
    if (!result.success) {
      setError(result.error);
    }
        
    setLoading(false);
  };

  const isValidUsername = username.trim().length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400 to-pink-400 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Main Card */}
      <div className="relative max-w-md w-full">
        <div className="bg-white backdrop-blur-sm bg-opacity-95 rounded-3xl shadow-2xl border border-white border-opacity-20 p-8 relative overflow-hidden">
          {/* Card Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Welcome to VoteSpace
            </h1>
            <p className="text-gray-500 text-sm">
              Join the conversation and make your voice heard
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-3">
                Enter your name to start voting
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 transition-colors duration-200 ${
                    focused ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white ${
                    focused || username 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${error ? 'border-red-500 bg-red-50' : ''}`}
                  placeholder="Your name..."
                  required
                  minLength={2}
                  maxLength={50}
                />
                {username && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {isValidUsername ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                )}
              </div>

              {/* Character Counter */}
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span>Minimum 2 characters</span>
                <span className={`${username.length > 40 ? 'text-orange-500' : ''}`}>
                  {username.length}/50
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2 animate-pulse">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !isValidUsername}
              className={`w-full relative overflow-hidden rounded-xl py-4 px-6 font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:transform-none disabled:hover:scale-100 ${
                loading || !isValidUsername
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Entering...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Voting</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="flex flex-col items-center space-y-1">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-xs text-gray-600 font-medium">Secure</span>
                <span className="text-xs text-gray-400">No password needed</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-gray-600 font-medium">24h Session</span>
                <span className="text-xs text-gray-400">Auto expires</span>
              </div>
            </div>
            
            <p className="mt-4 text-center text-xs text-gray-500 leading-relaxed">
              Your session will automatically expire after 24 hours for security.
              <br />
              <span className="text-blue-600 font-medium">No personal data is stored permanently.</span>
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-60"></div>
        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-pink-400 rounded-full opacity-40"></div>
      </div>
    </div>
  );
};

export default Login;