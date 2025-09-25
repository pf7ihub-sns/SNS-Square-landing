import React from "react";
import BlackButton from "../../common/BlackButton";

const HeroSection = ({ showButton = true }) => {
  return (
    <div className="bg-white p-10 rounded-sm mt-20 min-h-screen ">
      <div className="relative w-full bg-[#d6f0fe] px-4 shadow-sm">
        {/* Header section with logo and content */}
        <div className="container mx-auto px-4 pt-8 ">
          {/* SNS Square Logo */}
          <div className="mb-8">
            <img
              src="/images/square_logo_black.png"
              alt="SNS Square Logo"
              className="h-36 mx-auto"
            />
          </div>

          <div className="relative max-w-5xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className="font-bold text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] leading-tight  ">
              A <span className="text-[#0066FF]">Culture</span> that Erupts into <span className="text-[#0066FF]">Brilliance</span><span className="text-[#0066FF]">.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12 mt-6">
              We are a culture of bold thinkers and fearless doers. Here, boundaries fade, routines transform into freedom, and creativity flows without limits.
            </p>

            {/* CTA Button */}
            {showButton && (
              <BlackButton className="px-8 py-3 text-lg font-medium">
                Work With Us
              </BlackButton>
            )}
          </div>

          {/* Team Image section */}
          <div className="relative mt-16 mx-auto max-w-7xl">
            <div className="relative">
              {/* Top gradient overlay */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#EBF3FF] to-transparent z-20" />

              {/* Team image */}
              <img
                src="/images/Team.png"
                alt="SNS Square Team"
                className="w-full rounded-3xl shadow-xl relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

