import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function TripPlanningSystem() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId] = useState('user-' + Math.random().toString(36).substr(2, 9));
  const [userName, setUserName] = useState('');
  const [currentMode, setCurrentMode] = useState('planning');
  const chatContainerRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Trip Planning Form Data
  const [planningData, setPlanningData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 1,
    preferences: [],
    accommodation: '',
    transportation: ''
  });

  // Trip Recommendation Form Data
  const [recommendationData, setRecommendationData] = useState({
    interests: [],
    budget: '',
    duration: '',
    season: '',
    travelStyle: '',
    groupSize: 1
  });

  const travelPreferences = [
    'Adventure', 'Culture', 'Relaxation', 'Food & Dining', 'Nature', 'History',
    'Photography', 'Shopping', 'Nightlife', 'Beaches', 'Mountains', 'Cities'
  ];

  const budgetRanges = [
    { value: 'budget', label: '$500 - $1,500 (Budget)' },
    { value: 'mid-range', label: '$1,500 - $3,000 (Mid-range)' },
    { value: 'luxury', label: '$3,000+ (Luxury)' }
  ];

  const accommodationTypes = [
    'Hotel', 'Hostel', 'Airbnb', 'Resort', 'Boutique Hotel', 'Camping'
  ];

  const transportationTypes = [
    'Flight', 'Train', 'Car Rental', 'Bus', 'Cruise', 'Mixed'
  ];

  const travelStyles = [
    'Solo Traveler', 'Couple', 'Family', 'Friends Group', 'Business', 'Backpacker'
  ];

  const seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'Any Season'];
  const durations = ['Weekend (2-3 days)', '1 Week', '2 Weeks', '1 Month', 'Flexible'];

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (message = input, formData = null) => {
    if (!message.trim() && !formData) return;
    setError(null);
    setIsLoading(true);

    let payload = {
      user_id: userId,
      message,
      name: userName || undefined,
      mode: currentMode
    };

    if (formData) {
      payload = { ...payload, ...formData };
    } else if (currentMode === 'planning') {
      payload = { ...payload, ...planningData };
    } else {
      payload = { ...payload, ...recommendationData };
    }

    const userMessage = {
      role: 'user',
      content: formData ? `${currentMode === 'planning' ? 'Trip Planning Request' : 'Trip Recommendation Request'}: ${message}` : message,
      timestamp: new Date().toISOString(),
      mode: currentMode
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const endpoint = currentMode === 'planning' ? '/trip-planning-system/plan' : '/trip-planning-system/recommend';
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
        mode: currentMode
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setError(`Failed to get ${currentMode} response from the server. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPlan = () => {
    const quickMessage = currentMode === 'planning'
      ? `Plan a trip to ${planningData.destination || 'my chosen destination'} for ${planningData.travelers} traveler(s)`
      : 'Give me travel recommendations based on my preferences';
    const formData = currentMode === 'planning' ? planningData : recommendationData;
    handleSend(quickMessage, formData);
  };

  const handlePreferenceToggle = (preference) => {
    if (currentMode === 'planning') {
      setPlanningData((prev) => ({
        ...prev,
        preferences: prev.preferences.includes(preference)
          ? prev.preferences.filter((p) => p !== preference)
          : [...prev.preferences, preference],
      }));
    } else {
      setRecommendationData((prev) => ({
        ...prev,
        interests: prev.interests.includes(preference)
          ? prev.interests.filter((p) => p !== preference)
          : [...prev.interests, preference],
      }));
    }
  };

  const handleModeSwitch = (mode) => {
    setCurrentMode(mode);
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getModeIcon = (mode) => {
    return mode === 'planning' ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4 mt-12">
      <div className="w-full max-w-[90%] h-[80vh] bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl border border-gray-200 flex overflow-hidden">
        {/* Sidebar Toggle Button for Mobile */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Sidebar */}
        <div
          className={`w-80 bg-gradient-to-b from-[#1E3A8A] to-blue-700 text-white flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } lg:static fixed top-0 left-0 h-full z-40 lg:z-auto`}
        >
          {/* Header */}
          <div className="p-6 border-b border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold">TravelAI</h1>
                <p className="text-blue-100 text-sm">Your Travel Companion</p>
              </div>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="p-6 border-b border-blue-500/20">
            <h3 className="text-sm font-medium mb-4 text-blue-100">Choose Mode</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleModeSwitch('planning')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${currentMode === 'planning'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'bg-white/10 text-blue-100 hover:bg-white/15'
                  }`}
              >
                {getModeIcon('planning')}
                <span className="font-medium">Trip Planning</span>
              </button>
              <button
                onClick={() => handleModeSwitch('recommendation')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${currentMode === 'recommendation'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'bg-white/10 text-blue-100 hover:bg-white/15'
                  }`}
              >
                {getModeIcon('recommendation')}
                <span className="font-medium">Get Recommendations</span>
              </button>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {currentMode === 'planning' ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-100 mb-4">Trip Details</h3>
                <div>
                  <label className="block text-sm text-blue-100 mb-2">Destination</label>
                  <input
                    type="text"
                    value={planningData.destination}
                    onChange={(e) => setPlanningData((prev) => ({ ...prev, destination: e.target.value }))}
                    placeholder="Where do you want to go?"
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-blue-100 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={planningData.startDate}
                      onChange={(e) => setPlanningData((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-blue-100 mb-2">End Date</label>
                    <input
                      type="date"
                      value={planningData.endDate}
                      onChange={(e) => setPlanningData((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-blue-100 mb-2">Budget Range</label>
                  <select
                    value={planningData.budget}
                    onChange={(e) => setPlanningData((prev) => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Select Budget</option>
                    {budgetRanges.map((budget) => (
                      <option key={budget.value} value={budget.value} className="text-gray-800">
                        {budget.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-blue-100 mb-2">Number of Travelers</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={planningData.travelers}
                    onChange={(e) => setPlanningData((prev) => ({ ...prev, travelers: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-blue-100 mb-2">Accommodation Type</label>
                  <select
                    value={planningData.accommodation}
                    onChange={(e) => setPlanningData((prev) => ({ ...prev, accommodation: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Select Accommodation</option>
                    {accommodationTypes.map((type) => (
                      <option key={type} value={type} className="text-gray-800">{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-blue-100 mb-2">Transportation</label>
                  <select
                    value={planningData.transportation}
                    onChange={(e) => setPlanningData((prev) => ({ ...prev, transportation: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Select Transportation</option>
                    {transportationTypes.map((type) => (
                      <option key={type} value={type} className="text-gray-800">{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-100 mb-4">Your Preferences</h3>
                <div>
                  <label className="block text-sm text-blue-100 mb-2">Budget Range</label>
                  <select
                    value={recommendationData.budget}
                    onChange={(e) => setRecommendationData((prev) => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Select Budget</option>
                    {budgetRanges.map((budget) => (
                      <option key={budget.value} value={budget.value} className="text-gray-800">
                        {budget.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-blue-100 mb-2">Trip Duration</label>
                  <select
                    value={recommendationData.duration}
                    onChange={(e) => setRecommendationData((prev) => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Select Duration</option>
                    {durations.map((duration) => (
                      <option key={duration} value={duration} className="text-gray-800">{duration}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-blue-100 mb-2">Preferred Season</label>
                  <select
                    value={recommendationData.season}
                    onChange={(e) => setRecommendationData((prev) => ({ ...prev, season: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Select Season</option>
                    {seasons.map((season) => (
                      <option key={season} value={season} className="text-gray-800">{season}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-blue-100 mb-2">Travel Style</label>
                  <select
                    value={recommendationData.travelStyle}
                    onChange={(e) => setRecommendationData((prev) => ({ ...prev, travelStyle: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Select Style</option>
                    {travelStyles.map((style) => (
                      <option key={style} value={style} className="text-gray-800">{style}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-blue-100 mb-2">Group Size</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={recommendationData.groupSize}
                    onChange={(e) => setRecommendationData((prev) => ({ ...prev, groupSize: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
            )}

            {/* Preferences/Interests */}
            <div>
              <label className="block text-sm text-blue-100 mb-3">
                {currentMode === 'planning' ? 'Travel Preferences' : 'Interests'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {travelPreferences.map((pref) => {
                  const isSelected = currentMode === 'planning'
                    ? planningData.preferences.includes(pref)
                    : recommendationData.interests.includes(pref);
                  return (
                    <button
                      key={pref}
                      onClick={() => handlePreferenceToggle(pref)}
                      className={`px-3 py-2 text-xs rounded-lg border transition-all ${isSelected
                        ? 'bg-white/30 border-white text-white'
                        : 'bg-white/10 border-white/30 text-blue-100 hover:bg-white/20'
                        }`}
                    >
                      {pref}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={handleQuickPlan}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#064EE3] to-[#3D76EC] hover:from-[#0540D4] hover:to-[#356AE5] text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/30"
            >
              {currentMode === 'planning' ? '🗺️ Plan My Trip' : '✨ Get Recommendations'}
            </button>
          </div>

          {/* Settings */}
          <div className="p-6 border-t border-blue-500/20">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-4 sm:px-6 py-2 sm:py-4 text-white border-b border-blue-400/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">
                  {currentMode === 'planning' ? '🗺️ Trip Planning Assistant' : '✨ Travel Recommendations'}
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm">
                  {currentMode === 'planning'
                    ? 'Let me help you plan your perfect trip'
                    : 'Discover amazing destinations tailored for you'}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <button
                  onClick={() => window.location.href = '/media-entertainment'}
                  className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-4 lg:right-4 flex items-center gap-1 sm:gap-2 text-white font-medium hover:text-blue-200 transition-colors text-sm sm:text-base p-2 hover:bg-white hover:bg-opacity-10 rounded-md"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  <span>Back</span>
                </button>
              </div>

            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 bg-gradient-to-b from-gray-50/50 to-white/50 space-y-2 sm:space-y-4"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center mb-2 sm:mb-6">
                  <div className="text-2xl sm:text-4xl">
                    {currentMode === 'planning' ? '🗺️' : '✨'}
                  </div>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
                  {currentMode === 'planning' ? 'Ready to Plan Your Trip?' : 'Looking for Travel Ideas?'}
                </h3>
                <p className="text-center text-xs sm:text-sm text-gray-600 max-w-xs sm:max-w-md">
                  {currentMode === 'planning'
                    ? 'Fill out your trip details in the sidebar and I\'ll help you create the perfect itinerary!'
                    : 'Tell me about your interests and preferences, and I\'ll recommend amazing destinations just for you!'}
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}
                >
                  <div className={`flex items-end space-x-2 sm:space-x-3 max-w-xs sm:max-w-2xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div
                      className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0 shadow-lg ${message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                        : 'bg-gradient-to-br from-gray-600 to-gray-700'
                        }`}
                    >
                      {message.role === 'user' ? (userName ? userName[0].toUpperCase() : 'U') : '🤖'}
                    </div>
                    <div
                      className={`px-3 sm:px-5 py-2 sm:py-4 rounded-xl sm:rounded-3xl shadow-lg ${message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-br-lg'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-lg'
                        }`}
                    >
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <div
                        className={`flex items-center space-x-1 sm:space-x-2 text-xxs sm:text-xs mt-1 sm:mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                          }`}
                      >
                        <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <span>{message.mode === 'planning' ? '🗺️' : '✨'}</span>
                          <span className="capitalize">{message.mode}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                    🤖
                  </div>
                  <div className="bg-white rounded-xl sm:rounded-3xl px-3 sm:px-5 py-2 sm:py-4 shadow-lg">
                    <div className="flex space-x-1 sm:space-x-2">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-2 sm:px-4 py-1 sm:py-3 rounded-xl sm:rounded-2xl flex items-center space-x-1 sm:space-x-2">
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-2 sm:p-4">
            <div className="flex items-end space-x-2 sm:space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask me anything about ${currentMode === 'planning' ? 'trip planning' : 'travel recommendations'}...`}
                  className="w-full resize-none rounded-xl sm:rounded-2xl border-2 border-gray-200 px-2 sm:px-4 py-1 sm:py-2 pr-10 sm:pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 max-h-24 sm:max-h-32 min-h-[40px] sm:min-h-[56px] bg-gray-50 text-sm sm:text-base"
                  rows={1}
                  disabled={isLoading}
                />
                <div className="absolute right-2 sm:right-4 bottom-1 sm:bottom-3 text-lg sm:text-xl text-gray-400">
                  {currentMode === 'planning' ? '🗺️' : '✨'}
                </div>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg disabled:transform-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-1 sm:mt-2 flex items-center justify-between text-xxs sm:text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <kbd className="px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded border">Enter</kbd>
                <span>to send • </span>
                <kbd className="px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded border">Shift + Enter</kbd>
                <span>for new line</span>
              </span>
              <span className="flex items-center space-x-1 sm:space-x-2">
                <span>{input.length} characters</span>
                <span>•</span>
                <span className="capitalize">{currentMode} mode</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}