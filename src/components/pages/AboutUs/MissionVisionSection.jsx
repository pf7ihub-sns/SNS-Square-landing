import React from "react";

const MissionVisionSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-manrope font-bold text-global-1 mb-8">
              Our Mission
            </h2>
            <p className="text-lg sm:text-xl font-inter text-gray-700 leading-relaxed mb-8">
              To empower businesses with cutting-edge AI solutions that drive growth and efficiency. 
              We strive to be a leader in the AI industry, delivering exceptional value to our clients 
              and fostering a culture of innovation and collaboration.
            </p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-manrope font-bold text-global-1 mb-6">
              Our Vision
            </h3>
            <p className="text-lg sm:text-xl font-inter text-gray-700 leading-relaxed">
              To redefine the future through world-class agentic AI, creating adaptive solutions 
              that drive growth and innovation across industries.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src="/images/ChatGPT Image Sep 13, 2025, 10_45_51 AM.png"
              alt="Innovation concept"
              className="w-full max-w-md lg:max-w-lg h-auto object-cover rounded-[32px] shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
