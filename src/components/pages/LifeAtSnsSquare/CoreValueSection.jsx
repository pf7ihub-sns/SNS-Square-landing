import React from 'react';
import BlackButton from '../../common/BlackButton';

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
    <div className="bg-white py-16">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto  mb-8">
        <div className="mb-16">
          <h3 className="text-gray-900 mb-2">Our core values define who we are</h3>
          <p className="text-gray-600 mt-6">Our core values define who we are</p>
        </div>

        {/* Values Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-80">
          {coreValues.map((value, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded-md p-6 border border-blue-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <p className="text-gray-900 highlight text-lg font-semibold">{value.title}</p>
                  <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center text-white">
                    {value.icon}
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mt-auto">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section (GlassCube background) */}

      <div className="relative overflow-hidden max-w-7xl mx-auto rounded-md bg-gradient-to-r from-[#d3e0fa] to-[#e1f4ff] ">
        {/* Background Image positioned on the left side */}
        <div
          className="absolute left-0 top-0 w-1/2 h-full bg-cover bg-center bg-no-repeat "
          style={{ backgroundImage: "url('/images/GlassCube.png')" }}
        ></div>

        {/* Blue gradient overlay */}
        <div></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center rounded-md border border-white/40 bg-white/20 backdrop-blur-sm shadow-xl p-8 md:p-12">
            <h3 className="  text-gray-900 leading-tight mb-4">
              Discover what truly defines SNS Square in a detailed letter from
            </h3>
            <button className="mt-8 px-8 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300">
              Read our Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreValuesSection;