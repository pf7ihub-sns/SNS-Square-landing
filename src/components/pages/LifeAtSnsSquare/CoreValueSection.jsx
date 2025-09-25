import React from 'react';

const coreValues = [
  {
    title: "Speed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    description: "Faster time-to-value with our enterprise AI solutions and AI agent marketplace."
  },
  {
    title: "Innovation",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 12l2 2 4-4"></path>
      </svg>
    ),
    description: "Cutting-edge solutions that push the boundaries of what's possible with AI technology."
  },
  {
    title: "Excellence",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M6 9l6 6 6-6"></path>
      </svg>
    ),
    description: "Uncompromising quality in every solution we deliver and every relationship we build."
  },
  {
    title: "Collaboration",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    description: "Working together with clients as partners to achieve transformative business outcomes."
  }
];

const CoreValuesSection = () => {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Our core values define who we are</h2>
          <p className="text-gray-600 text-lg">Our core values define who we are</p>
        </div>
        
        {/* Values Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value, index) => (
            <div 
              key={index}
              className="bg-blue-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white">
                  {value.icon}
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section (GlassCube background) */}
      <div
        className="relative overflow-hidden bg-center bg-cover"
        style={{ backgroundImage: "url('/images/GlassCube.png')" }}
      >
        {/* Overlay to match the provided design */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-cyan-500/30"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center rounded-2xl border border-white/40 bg-white/60 backdrop-blur-sm shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              Discover what truly defines SNS Square in a detailed letter from
            </h2>
            <button className="mt-8 inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300 shadow-lg">
              Read our Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreValuesSection;