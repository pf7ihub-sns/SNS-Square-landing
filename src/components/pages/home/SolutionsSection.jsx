import React from 'react';

const SolutionsSection = () => {
  return (
    <div className="solutions-container responsive-container max-w-[375px] xs:max-w-[400px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[1024px] xl:max-w-[1200px] mx-auto px-5 xs:px-6 sm:px-6 md:px-8">
        <div className="mb-6 xs:mb-8 sm:mb-12">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-sora font-semibold leading-tight">
            <span className="text-[#064ee3]">Beyond Code. <br /></span>
            <span className="text-[#242424]">Into impact with Agentic Solutions</span>
          </h2>
        </div>
        
        <div className="solutions-grid grid grid-cols-1 lg:grid-cols-5 gap-5 xs:gap-6 sm:gap-8 lg:gap-8">
          {/* Main Solution Card */}
          <div className="lg:col-span-3">
            <div className="solutions-card bg-gradient-to-b from-white via-blue-50/50 to-blue-100 
                border border-gray-200 rounded-xl lg:rounded-2xl 
                pt-5 pl-5 xs:pt-6 xs:pl-6 sm:pt-8 sm:pl-8 lg:pt-10 lg:pl-10 xl:pt-12 xl:pl-12 
                pr-0 pb-0
                h-full flex flex-col justify-between">  
              <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-manrope font-bold text-[#242424] leading-tight max-w-xl">
                  Redefining Solutions in the Agentic Era
                </h3>
                <p className="text-xs xs:text-sm sm:text-base lg:text-lg p-1 font-inter text-[#242424]/70 leading-relaxed max-w-xl">
                We don't rely on outdated methods. We design with AI-driven fundamentals to address the challenges that truly count.
                </p>
              </div>
              <div className="flex justify-end pt-5 xs:pt-6 sm:pt-8">
                <img 
                  src="/images/image_11.png" 
                  alt="Solutions Illustration" 
                  className="w-full max-w-[300px] xs:max-w-[370px] sm:max-w-[360px] md:max-w-[550px] lg:max-w-[600px] h-auto object-cover rounded-lg lg:rounded-xl
                         mobile-image-fill"
                />
              </div>
            </div>
          </div>
          
          {/* Feature Cards Column */}
          <div className="lg:col-span-2 space-y-4 xs:space-y-5 sm:space-y-6 flex flex-col justify-center">
            {/* Innovation at Core */}
            <div className="solutions-card bg-[#EEF8FF] rounded-xl lg:rounded-2xl p-4 xs:p-5 sm:p-6 lg:p-8 xl:p-10 relative overflow-hidden">
                {/* Text Section */}
                <div className="relative z-10 max-w-lg">
                  <h4 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-manrope font-bold text-[#040404] mb-3 xs:mb-4 sm:mb-4">
                    Innovation at Core
                  </h4>
                  <p className="text-xs xs:text-sm sm:text-sm lg:text-base pr-8 font-inter text-[#242424]/70 leading-relaxed">
                  We continuously adapt, explore, and break new ground, delivering forward-thinking solutions that keep you ahead of the curve.
                  </p>
                </div>
                {/* Image Section */}
                <img
                  src="/images/innova_banner.png"
                  alt="Solutions Illustration"
                  className="absolute right-0 bottom-0 top-0 h-full object-contain"
                />
              </div>                  
            {/* AI-Only Engineering */}
            <div className="solutions-card bg-[#FBEAFF] rounded-xl lg:rounded-2xl pt-0 pr-0 pb-4 pl-4 xs:pb-5 xs:pl-5 sm:pb-6 sm:pl-6 lg:pb-8 lg:pl-8 xl:pb-10 xl:pl-10">
              <img 
                src="/images/engine_start.png" 
                alt="Solutions Illustration" 
                className="w-14 xs:w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 h-auto object-cover rounded-lg lg:rounded-xl mx-auto mb-0 mr-0"
              />
              <h4 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-manrope font-bold text-[#040404] mb-3 xs:mb-4 sm:mb-4">
                AI-Only Engineering
              </h4>
              <p className="text-xs xs:text-sm sm:text-sm lg:text-base pr-4 font-inter text-[#242424]/70 leading-relaxed">
              We steer clear of traditional approaches. We craft with AI-first principles to tackle the issues that genuinely matter.
              </p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default SolutionsSection;
