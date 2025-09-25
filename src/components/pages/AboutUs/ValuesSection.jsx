import React from "react";

const WhyWeAreHereSection = () => {
  return (
    <section 
      className="min-h-screen py-8 lg:py-22 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/backgroundgrids/gridBG.png')"
      }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4">
        {/* Header Section - Left Aligned */}
        <div className="flex flex-col justify-start items-start gap-4 mb-8 lg:mb-14 max-w-[1224px] mx-auto">
          <h1 className="text-neutral-900 text-2xl lg:text-4xl font-bold font-manrope">
            Why We're Here
          </h1>
          <p className="text-zinc-600 text-sm lg:text-base font-normal font-inter leading-snug">
            The Story Of how SNS square Began
          </p>
        </div>

        {/* Main Content Card */}
        <div className="relative max-w-[1224px] mx-auto">
          {/* White Card Background */}
          <div className="w-full min-h-[500px] lg:h-[675px] bg-white rounded border border-stone-300 relative p-6 lg:p-0">
            
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 h-full">
              {/* Left Content Area */}
              <div className="lg:absolute lg:left-[35px] lg:top-[44px] lg:w-[505px] flex flex-col justify-center lg:justify-start">
                {/* Main Heading */}
                <h2 className="text-black text-xl lg:text-4xl font-bold font-manrope mb-6 lg:mb-[110px]">
                  Accelerate growth at the new speed of business
                </h2>
                
                {/* First Paragraph */}
                <p className="text-neutral-500 text-base lg:text-xl font-medium font-manrope mb-6 lg:mb-[113px] leading-relaxed">
                  We work with enterprises to reimagine business with our AI Agent Platform, AI Solutions for Work, Service and Process, and Agent Marketplace.
                </p>
                
                {/* Second Paragraph */}
                <p className="text-neutral-600 text-sm lg:text-lg font-medium font-manrope leading-relaxed mb-8 lg:mb-0">
                  With SNS Square customers get a standardized approach to developing, deploying, and orchestrating AI agents across the enterprise with speed, control, and flexibility. We help you keep up with the rapid pace of the AI industry.
                </p>
              </div>

              {/* Right Image Placeholder */}
              <div className="lg:absolute lg:right-[35px] lg:top-[38px] w-full lg:w-[600px] h-[300px] lg:h-[600px] bg-gray-200 rounded flex items-center justify-center">
                <div className="text-gray-500 text-lg font-medium">
                  Image Placeholder
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <div className="lg:absolute lg:left-[35px] lg:bottom-[48px] mt-6 lg:mt-0">
              <button className="h-12 lg:h-16 px-6 lg:px-8 py-4 lg:py-7 bg-neutral-800 rounded inline-flex justify-center items-center gap-3.5 hover:bg-neutral-700 transition-colors duration-300 w-full lg:w-auto">
                <span className="text-orange-50 text-base lg:text-lg font-medium font-manrope">
                  Contact Us
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeAreHereSection;
