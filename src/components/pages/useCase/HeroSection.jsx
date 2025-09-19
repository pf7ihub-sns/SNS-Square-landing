import React from "react";

const HeroSection = () => {
  return (
    <div className="relative w-full h-auto min-h-[300px] md:min-h-[440px] overflow-hidden pt-20">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ 
          backgroundImage: "url('/images/HomeHero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat"
        }}
      />
      
      {/* Background blur effect */}
      <div className="absolute w-[300px] h-[300px] md:w-[470px] md:h-[470px] top-0 left-1/2 transform -translate-x-1/2 md:left-[485px] md:transform-none bg-[#1357e591] rounded-full blur-[400px]" />
      
      {/* Hero Content */}
      <section className="w-full bg-[linear-gradient(359deg,#ffffff_0%,_#e3ebff_100%)] relative">
        <div 
          className="w-full h-[300px] md:h-[440px] bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/images/HomeHero.png')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="w-full max-w-[300px] xs:max-w-[350px] sm:max-w-[400px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1200px] 2xl:max-w-[1300px] mx-auto px-3 xs:px-4 sm:px-5 lg:px-8 h-full">

            {/* Content Container */}
            <div className="flex flex-col justify-center items-center h-full text-center">
              <div className="max-w-6xl">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-manrope font-[800] leading-[40px]  sm:leading-[56px] md:leading-[72px] lg:leading-[80px] text-center text-global-1 w-full h-full">
                  <span className="text-global-1 text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-manrope font-[800]">Partnered Progress</span>
                  <span className="text-global-1 text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-manrope font-[800]"> : </span>
                  <span className="text-global-5 text-[#064EE3] text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-manrope font-[800]">
                    Agentic AI
                  </span>
                  <br />
                  <span className="text-global-1 text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-manrope font-[800]">
                    Solution for Every Sector
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
