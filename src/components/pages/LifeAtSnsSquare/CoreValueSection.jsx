import React from 'react';

const CoreValuesSection = () => {
  return (
    <div className="max-w-7xl mx-auto my-8 bg-white">
      {/* Header Section */}
      <div className="px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our core values define who we are
        </h1>
        <p className="text-lg text-gray-600 mb-16">
          Our core values define who we are
        </p>
        
        {/* Values Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
          {[1, 2, 3, 4].map((index) => (
            <div 
              key={index}
              className="bg-blue-50 rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold text-gray-900">Speed</h3>
                <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2.5"
                    className="w-5 h-5"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                Faster time-to-value with our enterprise AI solutions and AI agent marketplace.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        {/* Background with abstract geometric shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-blue-200">
          {/* Abstract geometric shapes */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <svg viewBox="0 0 1200 600" className="w-full h-full">
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Geometric shapes */}
              <polygon 
                points="0,150 300,50 600,200 300,300" 
                fill="url(#gradient1)"
                className="animate-pulse"
              />
              <polygon 
                points="400,100 800,0 1200,150 800,250" 
                fill="url(#gradient1)"
                className="animate-pulse"
                style={{animationDelay: '1s'}}
              />
              <polygon 
                points="200,350 600,250 1000,400 600,500" 
                fill="url(#gradient1)"
                className="animate-pulse"
                style={{animationDelay: '2s'}}
              />
              <polygon 
                points="600,400 1000,300 1200,450 900,550" 
                fill="url(#gradient1)"
                className="animate-pulse"
                style={{animationDelay: '0.5s'}}
              />
            </svg>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 px-8 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 max-w-4xl mx-auto leading-tight">
            Discover what truly defines SNS Square in a detailed letter from
          </h2>
          
          <button className="mt-12 bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300 shadow-lg">
            Read our Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoreValuesSection;