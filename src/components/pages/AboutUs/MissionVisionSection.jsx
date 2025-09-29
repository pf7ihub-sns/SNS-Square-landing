import React from "react";

const MissionVisionSection = () => {
  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1225px] mx-auto">
          {/* Main Container with Background - Reduced Heights */}
          <div className="w-full min-h-[450px] sm:min-h-[380px] md:min-h-[340px] lg:h-[320px] relative bg-white rounded-md overflow-hidden">
            
            {/* Background SVG/Image */}
            <img 
              className="opacity-45 absolute inset-0 w-full h-full object-cover"
              src="/images/backgroundgrids/bgformission.svg" 
              alt="Background pattern"
            />
            
            {/* Gradient Blur Effects */}
            <div className="hidden lg:block w-[803px] h-[1127px] left-[706px] top-[-133px] absolute opacity-25 bg-sky-400 rounded-full blur-[250px]" />
            <div className="hidden lg:block w-[803px] h-[1127px] left-[-117px] top-[-323px] absolute opacity-25 bg-blue-700 rounded-full blur-[250px]" />
            
            {/* Mobile Gradient Effects */}
            <div className="block lg:hidden w-[300px] h-[400px] sm:w-[500px] sm:h-[600px] right-[-100px] top-[-80px] absolute opacity-15 bg-sky-400 rounded-full blur-[120px]" />
            <div className="block lg:hidden w-[300px] h-[400px] sm:w-[500px] sm:h-[600px] left-[-150px] top-[-150px] absolute opacity-15 bg-blue-700 rounded-full blur-[120px]" />
            
            {/* Content Cards Container - Reduced Padding */}
            <div className="absolute inset-3 sm:inset-4 lg:inset-[28px]">
              <div className="flex flex-col lg:flex-row justify-center items-stretch gap-3 sm:gap-4 lg:gap-5 h-full">
                
                {/* Vision Card - Reduced Padding */}
                <div className="flex-1 lg:max-w-[564px] px-3 sm:px-4 py-4 sm:py-5 lg:py-6 bg-white/90 backdrop-blur-sm rounded-lg flex flex-col justify-center">
                  <div className="w-full flex flex-col justify-start items-start gap-3 sm:gap-4 lg:gap-5">
                    <div className="flex justify-start items-center gap-3 sm:gap-4 lg:gap-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-zinc-300 rounded flex-shrink-0" />
                      <h3 className="text-black leading-tight">
                        Vision
                      </h3>
                    </div>
                    <p className="w-full text-zinc-700 font-inter leading-snug">
                     To redefine the future of business by empowering people and organisations with intelligent, agentic technologies that accelerate growth, innovation, and impact
                    </p>
                  </div>
                </div>

                {/* Mission Card - Reduced Padding */}
                <div className="flex-1 lg:max-w-[564px] px-3 sm:px-4 py-4 sm:py-5 lg:py-6 bg-white/90 backdrop-blur-sm rounded-lg flex flex-col justify-center">
                  <div className="w-full flex flex-col justify-start items-start gap-3 sm:gap-4 lg:gap-5">
                    <div className="flex justify-start items-center gap-3 sm:gap-4 lg:gap-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-zinc-300 rounded flex-shrink-0" />
                      <h3 className="text-black leading-tight">
                        Mission
                      </h3>
                    </div>
                    <p className="w-full text-zinc-700 font-inter leading-snug">
                     Our mission is to build transformative solutions that blend AI, automation, and human ingenuity, helping businesses adapt faster, scale smarter, and unlock opportunities for a better tomorrow
                    </p>
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
