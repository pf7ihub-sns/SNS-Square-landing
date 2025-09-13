import React from "react";

const HeroSection = () => {
  return (
    <section 
      aria-labelledby="hero-heading" 
      className="relative bg-gradient-to-b from-[#EEF4FF] to-white w-full"
      style={{
        backgroundImage: `url('/images/HomeHero.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32 xl:py-40">
        <header className="text-center">
          <h1
            id="hero-heading"
            className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] xl:text-7xl font-sora font-semibold leading-tight sm:leading-snug md:leading-tight lg:leading-snug text-center text-global-1 w-full mt-12 sm:mt-16 md:mt-20"
          >
            About <span className="text-[#1E63FF]">SNS Square</span>
          </h1>
        </header>

        <p className="mx-auto mt-6 sm:mt-8 lg:mt-10 max-w-5xl text-pretty text-center font-sans text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-black/90 font-medium">
          We are a team of passionate individuals dedicated to creating innovative AI solutions that drive growth and efficiency across industries.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
