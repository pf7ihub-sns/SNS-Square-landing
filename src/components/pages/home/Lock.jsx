import React from "react";

const StickyScrollSection = () => {

  return (
    <div>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 1400px) and (max-width: 1700px) and (max-height: 950px) {
          .resolution-1600x900 .heading-text {
            font-size: 2.25rem !important;
            line-height: 1.1 !important;
            max-width: 480px !important;
          }
          .resolution-1600x900 .paragraph-text {
            font-size: 1.125rem !important;
            line-height: 1.4 !important;
            max-width: 500px !important;
          }
          .resolution-1600x900 .section-spacing {
            gap: 2.5rem !important;
          }
          .resolution-1600x900 .block-spacing {
            gap: 1rem !important;
          }
          .resolution-1600x900.container-spacing {
            min-height: 75vh !important
          }
          .resolution-1600x900 .main-container {
            min-height: 75vh !important;
          }
        }
        
        /* Fix image alignment for tablet breakpoints */
        @media (min-width: 640px) and (max-width: 767px) {
          .tablet-image-container {
            max-width: 550px !important;
            margin: 0 auto !important;
          }
          .tablet-second-image {
            margin-left: -2px !important;
            margin-top: -4px !important;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .tablet-image-container {
            max-width: 600px !important;
            margin: 0 auto !important;
          }
          .tablet-second-image {
            margin-left: -2px !important;
            margin-top: -4px !important;
          }
        }
        
        /* Fix desktop layout for large screens - centered alignment */
        @media (min-width: 1024px) and (max-width: 1279px) {
          .desktop-layout {
            padding-left: 60px !important;
            padding-right: 60px !important;
          }
          .desktop-content {
            gap: 2.5rem !important;
          }
          .desktop-images {
            max-width: 500px !important;
            margin-top: -1rem !important;
          }
          .desktop-second-image {
            margin-left: -2px !important;
            margin-top: -4px !important;
          }
        }
        
        @media (min-width: 1280px) and (max-width: 1535px) {
          .desktop-layout {
            padding-left: 80px !important;
            padding-right: 80px !important;
          }
          .desktop-content {
            gap: 3rem !important;
          }
          .desktop-images {
            max-width: 600px !important;
            margin-top: -1.2rem !important;
          }
          .desktop-second-image {
            margin-left: -2px !important;
            margin-top: -4px !important;
          }
        }
        
        @media (min-width: 1536px) and (max-width: 1919px) {
          .desktop-layout {
            padding-left: 100px !important;
            padding-right: 100px !important;
          }
          .desktop-content {
            gap: 3.5rem !important;
          }
          .desktop-images {
            max-width: 650px !important;
            margin-top: -1.5rem !important;
          }
          .desktop-second-image {
            margin-left: -2px !important;
            margin-top: -4px !important;
          }
        }
        
        @media (min-width: 1920px) and (max-width: 2559px) {
          .desktop-layout {
            padding-left: 150px !important;
            padding-right: 150px !important;
          }
          .desktop-content {
            gap: 4rem !important;
          }
          .desktop-images {
            max-width: 700px !important;
            margin-top: -2rem !important;
          }
          .desktop-second-image {
            margin-left: -2px !important;
            margin-top: -4px !important;
          }
        }
        
        @media (min-width: 2560px) {
          .desktop-layout {
            padding-left: 200px !important;
            padding-right: 200px !important;
          }
          .desktop-content {
            gap: 4.5rem !important;
          }
          .desktop-images {
            max-width: 800px !important;
            margin-top: -2.5rem !important;
          }
          .desktop-second-image {
            margin-left: -2px !important;
            margin-top: -4px !important;
          }
        }
      `}} />
{/* ---------------- DESKTOP VERSION ---------------- */}
      {/* Combined Section with both contents and images side by side */}
      <div className="desktop-layout resolution-1600x900 container-spacing max-lg:hidden w-full min-h-screen px-6 xl:px-[100px] 2xl:px-[400px] flex items-center justify-center">
        <div className="desktop-content main-container w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <div className="resolution-1600x900 section-spacing space-y-16 lg:space-y-20 xl:space-y-24 flex flex-col justify-center">
            {/* First content block */}
            <div className="block-spacing space-y-4 lg:space-y-5 xl:space-y-6">
              <h2 className="heading-text text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-manrope font-bold text-black leading-[1.1] lg:leading-tight xl:leading-tight max-w-[90%] lg:max-w-[85%] xl:max-w-full">
                The Biggest Challenge for Modern Enterprises is Mastering Complexity
              </h2>
              <p className="paragraph-text text-sm sm:text-base lg:text-lg xl:text-2xl font-inter font-normal text-black/70 leading-[1.4] lg:leading-relaxed max-w-[95%] lg:max-w-[90%] xl:max-w-full">
                Businesses today must innovate faster, deliver seamless customer experiences, and scale efficiently while navigating dynamic markets and evolving technologies.
              </p>
            </div>
            
            {/* Second content block */}
            <div className="block-spacing space-y-4 lg:space-y-5 xl:space-y-6">
              <h2 className="heading-text text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-manrope font-bold text-black leading-[1.1] lg:leading-tight xl:leading-tight max-w-[90%] lg:max-w-[85%] xl:max-w-full">
                Our Key to Unlock the Future: The Agentic Business Blueprint (ABB)
              </h2>
              <p className="paragraph-text text-sm sm:text-base lg:text-lg xl:text-2xl font-inter font-normal text-black/70 leading-[1.4] lg:leading-relaxed max-w-[95%] lg:max-w-[90%] xl:max-w-full">
                The Agentic Business Blueprint (ABB) is our framework to align business goals with adaptive strategies, agentic intelligence, and automation.
              </p>
            </div>
          </div>
          
          {/* Right side - Images stacked vertically */}
          <div className="desktop-images flex flex-col justify-center -mt-6">
            <img
              src="/images/Container.png"
              alt="Visual 1"
              className="w-full max-w-[800px] h-auto rounded-[22px]"
            />
            <img
              src="/images/Container_2.png"
              alt="Visual 2"
              className="desktop-second-image w-full max-w-[800px] h-auto rounded-[22px] -ml-0.5 -mt-1"
            />
          </div>
        </div>
      </div>

{/* ---------------- TABLET VERSION ---------------- */}
      {/* Tablet Layout - Content then images */}
      <div className="hidden sm:flex lg:hidden flex-col w-full min-h-screen px-6 justify-center items-center max-w-4xl mx-auto">
        {/* First content block */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-manrope font-bold text-black leading-tight mb-6">
            The Biggest Challenge for Modern Enterprises is Mastering Complexity
          </h2>
          <p className="text-lg md:text-xl font-inter font-normal text-black/70 leading-relaxed">
            Businesses today must innovate faster, deliver seamless customer experiences, and scale efficiently while navigating dynamic markets and evolving technologies.
          </p>
        </div>
        
        {/* Images container for better alignment */}
        <div className="tablet-image-container flex flex-col items-center w-full">
          {/* First image */}
          <img
            src="/images/Container.png"
            alt="Visual 1"
            className="w-full h-auto rounded-[22px]"
          />
          
          {/* Second image - continuous with first */}
          <img
            src="/images/Container_2.png"
            alt="Visual 2"
            className="tablet-second-image w-full h-auto rounded-[22px] -mt-1 -ml-0.5 mb-8"
          />
        </div>
        
        {/* Second content block */}
        <div>
          <h2 className="text-2xl md:text-3xl font-manrope font-bold text-black leading-tight mb-6">
            Our Key to Unlock the Future: The Agentic Business Blueprint (ABB)
          </h2>
          <p className="text-lg md:text-xl font-inter font-normal text-black/70 leading-relaxed">
            The Agentic Business Blueprint (ABB) is our framework to align business goals with adaptive strategies, agentic intelligence, and automation.
          </p>
        </div>
      </div>


{/*  ---------------- MOBILE VERSION ---------------- */}
      {/* Combined Mobile Section */}
      <div className="flex flex-col sm:hidden px-6 min-h-screen justify-center max-w-2xl mx-auto">
        {/* First content block */}
        <div className="mb-8">
          <h2 className="text-2xl font-manrope font-bold mb-6">
            The Biggest Challenge for Modern Enterprises is Mastering Complexity
          </h2>
          <p className="text-base font-inter text-black/70 mb-6">
            Businesses today must innovate faster, deliver seamless customer experiences, and scale efficiently while navigating dynamic markets and evolving technologies.
          </p>
        </div>
        
        {/* Images container for mobile */}
        <div className="flex flex-col w-full">
          {/* First image */}
          <img
            src="/images/Container.png"
            alt="Visual 1"
            className="w-full h-auto rounded-[22px]"
          />
          
          {/* Second image - immediately following first */}
          <img
            src="/images/Container_2.png"
            alt="Visual 2"
            className="w-full h-auto rounded-[22px] mb-8 -mt-1 -ml-0.5"
          />
        </div>
        
        {/* Second content block */}
        <div>
          <h2 className="text-2xl font-manrope font-bold mb-6">
            Our Key to Unlock the Future: The Agentic Business Blueprint (ABB)
          </h2>
          <p className="text-base font-inter text-black/70">
            The Agentic Business Blueprint (ABB) is our framework to align business goals with adaptive strategies, agentic intelligence, and automation.
          </p>
        </div>
      </div>


    </div>
   
  );
};

export default StickyScrollSection;