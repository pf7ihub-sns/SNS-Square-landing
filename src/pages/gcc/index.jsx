import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/gcc-page.css';

const GCCPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden gcc-page">
      {/* Dark gradient background with dotted grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-800 to-black">
        {/* Dotted grid pattern overlay */}
        <div className="absolute inset-0 opacity-20 gcc-grid" />
      </div>

      {/* GCC Logo - Top Right */}
      <div className="absolute top-24 right-8 z-10">
        <img
          src="/images/gcc logo.png"
          alt="GCC Logo"
          className="h-16 w-auto"
        />
      </div>

      {/* Central Content Area */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8">
        <div className="text-center">
          {/* Main Building Structure */}
          <div className="relative mb-8">
            {/* 3D Building Background */}
            <div className="relative">
              <img
                src="/images/building.png"
                alt="GCC Building"
                className="mx-auto h-96 w-auto object-contain gcc-building"
              />
              
              {/* Overlay Text on Building */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* GCC Text on Pediment */}
                <h1 className="text-6xl font-bold text-white mb-4 tracking-wider gcc-text-glow gcc-gradient-text">
                  GCC
                </h1>
                
                {/* DATA + AGENTIC AI HUB Text on Entablature */}
                <h2 className="text-2xl font-semibold text-white mb-8 tracking-wide gcc-text-glow">
                  DATA + AGENTIC AI HUB
                </h2>
              </div>
            </div>

            {/* Three Columns with Build, Operate, Transfer */}
            <div className="flex justify-center space-x-8 mt-8">
              {/* Build Column - Gold */}
              <div className="flex flex-col items-center gcc-column-float">
                <div className="w-16 h-32 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg shadow-lg flex items-center justify-center mb-4 gcc-column">
                  <span className="text-white font-bold text-lg transform -rotate-90">
                    Build
                  </span>
                </div>
                <p className="text-white text-sm font-medium">Build</p>
              </div>

              {/* Operate Column - Red */}
              <div className="flex flex-col items-center gcc-column-float">
                <div className="w-16 h-32 bg-gradient-to-b from-red-500 to-red-700 rounded-lg shadow-lg flex items-center justify-center mb-4 gcc-column">
                  <span className="text-white font-bold text-lg transform -rotate-90">
                    Operate
                  </span>
                </div>
                <p className="text-white text-sm font-medium">Operate</p>
              </div>

              {/* Transfer Column - Green */}
              <div className="flex flex-col items-center gcc-column-float">
                <div className="w-16 h-32 bg-gradient-to-b from-green-500 to-green-700 rounded-lg shadow-lg flex items-center justify-center mb-4 gcc-column">
                  <span className="text-white font-bold text-lg transform -rotate-90">
                    Transfer
                  </span>
                </div>
                <p className="text-white text-sm font-medium">Transfer</p>
              </div>
            </div>
          </div>

          {/* Additional Content */}
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Empowering Global Capability Centers with cutting-edge Data Analytics 
              and Agentic AI solutions to transform business operations.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact-us"
                className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 gcc-button"
              >
                Get Started
              </Link>
              <Link
                to="/about-us"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-200 gcc-button"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>
  );
};

export default GCCPage;
