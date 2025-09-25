import React from "react";

const MissionVisionSection = () => {
  return (
    <section className="py-16 lg:py-10">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1225px] mx-auto">
          {/* Main Container with Background */}
          <div className="w-full min-h-80 lg:h-80 relative bg-white rounded-md overflow-hidden">
            
            {/* Background SVG/Image - Replace with your actual SVG path */}
            <img className="opacity-30 absolute inset-0 w-full h-full object-cover"
              src="/images/backgroundgrids/bgformission.svg" 
              alt="bg image"
            />
            
            {/* Gradient Blur Effects */}
            <div className="w-[803px] h-[1127px] left-[706px] top-[-133px] absolute opacity-25 bg-sky-400 rounded-full blur-[250px]" />
            <div className="w-[803px] h-[1127px] left-[-117px] top-[-323px] absolute opacity-25 bg-blue-700 rounded-full blur-[250px]" />
            
            {/* Content Cards */}
            <div className="absolute top-[36px] left-[36.5px] right-[36.5px] lg:left-[36.5px] lg:right-auto">
              <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-6">
                
                {/* Mission Card */}
                <div className="w-full lg:w-[564px] px-5 py-9 bg-white/75 rounded inline-flex flex-col justify-center items-center gap-2.5">
                  <div className="w-full lg:w-[511px] flex flex-col justify-start items-start gap-6">
                    <div className="inline-flex justify-start items-center gap-5">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-zinc-300 rounded flex-shrink-0" />
                      <div className="text-black text-2xl lg:text-4xl font-bold font-manrope">
                        Mission
                      </div>
                    </div>
                    <div className="w-full text-zinc-700 text-sm lg:text-base font-normal font-inter leading-snug">
                      SNS Square democratizes enterprise AI, empowering organizations to transform operations through intelligent automation. We make AI accessible, intuitive, and impactful, redefining performance across the value chain.
                    </div>
                  </div>
                </div>

                {/* Vision Card */}
                <div className="w-full lg:w-[564px] px-5 py-9 bg-white/75 rounded inline-flex flex-col justify-center items-center gap-2.5">
                  <div className="w-full lg:w-[511px] flex flex-col justify-start items-start gap-6">
                    <div className="inline-flex justify-start items-center gap-5">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-zinc-300 rounded flex-shrink-0" />
                      <div className="text-black text-2xl lg:text-4xl font-bold font-manrope">
                        Vision
                      </div>
                    </div>
                    <div className="w-full text-zinc-700 text-sm lg:text-base font-normal font-inter leading-snug">
                      We envision AI as an integral part of every organization, driving smarter decisions, operational efficiency, and continuous growth. Our goal is to make AI adoption fast, secure, and business-aligned, empowering enterprises to achieve real-world impact.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
