import React from "react";
import { CometCard } from "../../ui/comet-card";

const Certificate = () => {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url('/images/certificate-BG.png')` }}
      />
      
      <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-y-10 lg:gap-x-16 bg-white p-6 sm:p-8 lg:p-12 rounded-3xl">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-manrope font-bold text-global-1 mb-4 sm:mb-6">
              <span className="text-[#1E63FF]">Celebrating a Milestone of </span> Excellence.
            </h2>
            <p className="text-base sm:text-lg font-inter text-gray-600 leading-relaxed">
              Honoured among the Top 10 Agentic AI Startups of 2025 for redefining the future with innovation.
            </p>
          </div>

          {/* Right Side - Certificate Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <CometCard rotateDepth={15} translateDepth={15}>
                <div className="bg-[#D5E1FA] rounded-2xl p-4 shadow-2xl overflow-hidden cursor-pointer">
                  <img
                    src="/images/certificate.webp"
                    alt="SNS Square Certificate of Achievement - Top 10 Agentic AI Startups 2025"
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
              </CometCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificate;
