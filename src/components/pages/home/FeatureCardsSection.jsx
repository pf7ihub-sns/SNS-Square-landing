import React from 'react';

const FeatureCardsSection = () => {
  return (
    <div className="relative z-30 px-4 xs:px-5 sm:px-6 lg:px-8 py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 pb-4 xs:pb-5 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="relative p-4 xs:p-5 sm:p-6 lg:p-12 xl:p-16 overflow-hidden rounded-xl lg:rounded-2xl" style={{ backgroundImage: "url('/images/Bgframe.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {/* Feature Cards Grid */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
            {/* Domain Versatility Card */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 hover:shadow-xl transition-shadow h-auto sm:h-[240px] lg:h-[260px] flex flex-col">
              <div className="bg-[#e6edfc] rounded-lg lg:rounded-xl p-3 xs:p-4 sm:p-4 w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <img src="/images/Frame_3.svg" alt="Domain Versatility" className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-inter font-medium text-[#040404] mt-3">
                Domain Versatility
              </h3>
              <p className="text-xs xs:text-sm sm:text-sm font-manrope font-medium text-gray-600 mt-3 sm:mt-auto mb-3 xs:mb-4 sm:mb-[20px]">
                Solutions that adapt across industries.
              </p>
            </div>
            
            {/* AI Engineering First Card */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 hover:shadow-xl transition-shadow h-auto sm:h-[240px] lg:h-[260px] flex flex-col">
              <div className="bg-[#e6edfc] rounded-lg lg:rounded-xl p-3 xs:p-4 sm:p-4 w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <img src="/images/Frame_2.svg" alt="AI Engineering First" className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-inter font-medium text-[#040404] mt-3">
                AI Engineering <br /> First
              </h3>
              <p className="text-xs xs:text-sm sm:text-sm font-manrope font-medium text-gray-600 mt-3 sm:mt-auto mb-3 xs:mb-4 sm:mb-[20px]">
                Strong foundation in AI, data, and automation.
              </p>
            </div>
            
            {/* Born Agentic Card */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 hover:shadow-xl transition-shadow h-auto sm:h-[240px] lg:h-[260px] flex flex-col">
              <div className="bg-[#e6edfc] rounded-lg lg:rounded-xl p-3 xs:p-4 sm:p-4 w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <img src="/images/Frame.svg" alt="Born Agentic" className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-inter font-medium text-[#040404] mt-3">
                Born Agentic
              </h3>
              <p className="text-xs xs:text-sm sm:text-sm font-manrope font-medium text-gray-600 mt-3 sm:mt-auto mb-3 xs:mb-4 sm:mb-[20px]">
                Native to the era of autonomous AI.
              </p>
            </div>
            
            {/* Outcome Obsession Card */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 hover:shadow-xl transition-shadow h-auto sm:h-[240px] lg:h-[260px] flex flex-col">
              <div className="bg-[#e6edfc] rounded-lg lg:rounded-xl p-3 xs:p-4 sm:p-4 w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <img src="/images/Frame_4.svg" alt="Outcome Obsession" className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-inter font-medium text-[#040404] mt-3">
                Outcome obsession
              </h3>
              <p className="text-xs xs:text-sm sm:text-sm font-manrope font-medium text-gray-600 mt-3 sm:mt-auto mb-3 xs:mb-4 sm:mb-[20px]">
                Designed to deliver real impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCardsSection;
