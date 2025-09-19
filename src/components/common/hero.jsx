import React from "react";

const HeroSection = () => {
  return (
    <>
    <div className="relative w-full pt-28 md:pt-32 mt-20 px-4">
      {/* Soft horizontal background gradient */}
      <div className="absolute inset-0  bg-gradient-to-r from-[#d3e0fa] to-[#e1f4ff]" />

      {/* Bottom fade to white to blend with content below */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-white" />

      <div className="relative max-w-[1180px] mx-auto text-center">
        <h1 className="font-manrope font-extrabold text-[28px] sm:text-[34px] md:text-[42px] lg:text-[52px] leading-[1.15] text-black">
          A <span className="bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa] bg-clip-text text-transparent">Culture</span> that Erupts into <span className="bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa] bg-clip-text text-transparent">Brilliance.</span>
        </h1>
        <p className="font-inter text-black/70 mt-4 md:mt-5 max-w-3xl mx-auto">
          We are a culture of bold thinkers and fearless doers. Here, boundaries fade, routines transform into freedom,
          and creativity flows without limits.
        </p>
      </div>
    </div>
      <div className="relative ">
      <div className="relative max-w-[1180px] mx-auto rounded-[8px] overflow-hidden">
        <img src="/images/Team.png" alt="SNS Square Team" className="w-full h-auto block" />
      </div>
    </div>
    </>
  );
};

export default HeroSection;