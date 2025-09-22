import React from "react";
import BlackButton from "../common/BlackButton";

const HeroSection = ({ showButton = true }) => {
  return (
    <div className="relative w-full py-20 mt-20 px-4 " style={{background: 'linear-gradient(to bottom, #d3e0fa, white)'}}>
      {/* Full background gradient - light blue to white */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#d3e0fa] to-white" />

      <div className="relative max-w-6xl mx-auto text-center z-10">
        {/* Main Heading - matching the image text with exact styling */}
        <h1 className="font-bold text-gray-800 mb-8 leading-tight text-6xl md:text-7xl">
          A <span className="text-blue-600">Culture</span> that Erupts into <span className="text-blue-600">Brilliance</span>
        </h1>

        {/* Subtitle - matching the image text with exact styling */}
        <p className="mt-6 text-gray-600  max-w-4xl mx-auto leading-relaxed text-xl">
          We are a culture of bold thinkers and fearless doers. Here, boundaries fade, routines transform into freedom, and creativity flows without limits.
        </p>

        {/* CTA Button */}
        {showButton && (
          <BlackButton>
            Work With Us
          </BlackButton>
        )}
      </div>
      
      {/* Team Image with gradient overlay above it */}
      <div className="relative z-10 flex justify-center ">
        <div className="relative w-full max-w-7xl">
          {/* Gradient overlay above the image - same as useCase */}
          <div className="absolute top-0 left-0 right-0 h-0 bg-gradient-to-b from-[#DFE9FB] to-transparent z-20" />
          <img 
            src="/images/Team.png" 
            alt="SNS Square Team" 
            className="w-full rounded-b-lg  relative z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
