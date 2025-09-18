"use client"

import React, { useState } from 'react';
import Button from '../../common/Button2';
// import { SimpleRetroGrid } from '@/components/ui/simple-retro-grid';
import { HeroCarousel } from '../../common/HeroCarousel';
import { useNavigate as Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import Spline from '@splinetool/react-spline';

const phrases = [
  "To The Vibrant Life At SNS",
  "To 1500+ Foundation Agents",
  "To Use Cases That Matters"
];

// Navigation mapping for each phrase
const phraseNavigation = [
  {
    phrase: "To The Vibrant Life At SNS",
    route: "/life-at-sns",
    buttonText: "Explore Our Culture"
  },
  {
    phrase: "To 1500+ Foundation Agents",
    route: "/agent-workbench",
    buttonText: "Explore Agent Workbench"
  },
  {
    phrase: "To Use Cases That Matters",
    route: "/usecase",
    buttonText: "Explore Use Cases"
  }
];

const images = [
  "/images/Img one 2.webp",
  "/images/Foundational Agents.webp",
  "/images/Supplychain (1).webp",
  "/images/Img three.webp",
  "/images/Foundational Agents.webp",
  "/images/IT solution (1).webp",
  "/images/Img two_2 2.webp",
  "/images/Foundational Agents.webp",
  "/images/Supplychain (1).webp",
  "/images/Img three.webp",
  "/images/Foundational Agents.webp",
  "/images/IT solution (1).webp",
  "/images/Img one 2.webp",
  "/images/Foundational Agents.webp"
];

const HeroSection = () => {
  const navigate = Navigate();
  const [index, setIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Get current navigation info based on the phrase
  const getCurrentNavigation = () => {
    const currentPhraseIndex = phraseIndex % phrases.length;
    return phraseNavigation[currentPhraseIndex];
  };

  // Handle navigation based on current phrase
  const handleNavigation = () => {
    const currentNav = getCurrentNavigation();
    navigate(currentNav.route);
  };

  // Handle phrase click navigation
  const handlePhraseClick = () => {
    handleNavigation();
  };

  return (
    <div className="relative w-full h-auto min-h-[750px] xs:min-h-[800px] sm:min-h-[850px] md:min-h-[650px] lg:min-h-[700px] xl:min-h-[750px] 2xl:min-h-[800px] overflow-hidden pt-20 xs:pt-22 sm:pt-24 md:pt-8 lg:pt-2 xl:pt-3 2xl:pt-4">
      {/* Retro Grid Background */}
      {/* <SimpleRetroGrid 
        angle={65}
        cellSize={180}
        opacity={1}
        lineColor="#064EE3"
      /> */}

      {/* Hero Content */}
      <section className="w-full bg-[linear-gradient(359deg,rgba(255,255,255,0.7)_0%,_rgba(227,235,255,0.7)_100%)] relative z-10">
        <div
          className="w-full h-[750px] xs:h-[800px] sm:h-[850px] md:h-[650px] lg:h-[700px] xl:h-[750px] 2xl:h-[802px] bg-cover bg-center bg-no-repeat relative overflow-hidden"
          style={{
            backgroundImage: 'url(/images/Frame-home-hero.webp)'
          }}
        >
           {/* <SimpleRetroGrid
             angle={70}
             cellSize={100}
             opacity={0.8}
             lineColor="#064EE3"
           /> */}
          
          
          {/* Gradient Overlay - matches the image gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#a8c5ff]/20 via-[#c8d9ff]/10 to-transparent pointer-events-none z-[2]" />
          <div className="w-full max-w-[500px] xs:max-w-[350px] sm:max-w-[500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1200px] 2xl:max-w-[1300px] mx-auto  h-full relative z-10">

            {/* Mobile Layout (< 768px) - Stacked Vertically with Spline Background */}
            <div className="md:hidden flex flex-col justify-center h-full gap-8 xs:gap-10 sm:gap-10 text-center py-6 relative z-10">
              {/* Text Content - Better Mobile Spacing */}
              <div className="flex flex-col gap-3 xs:gap-8 sm:gap-8 w-full px-4 xs:px-6 sm:px-8 relative z-10">
                {/* Small Header */}
                <div className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-manrope font-[800] text-global-1 text-center leading-tight px-2">
                  Agentic AI Breakthroughs
                </div>

                {/* Main Heading with Slide Animation */}
                <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-manrope font-[600] leading-tight text-global-1 min-h-[32px] sm:min-h-[32px] md:min-h-[36px] lg:min-h-[40px] text-center px-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={phrases[phraseIndex % phrases.length]}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-25%", opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="block text-[#064EE3] cursor-pointer hover:opacity-80 transition-opacity leading-tight"
                      onClick={handlePhraseClick}
                    >
                      {phrases[phraseIndex % phrases.length]}
                    </motion.span>
                  </AnimatePresence>
                </h1>

                {/* Subtitle */}
                <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-manrope font-[800] leading-tight text-global-1 text-center px-2">
                  Everything Unfolds Here
                </h2>

                {/* Description */}
                <p className="text-lg sm:text-lg md:text-xl lg:text-2xl font-manrope font-light leading-relaxed text-global-1 text-center px-2 max-w-[320px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[600px] mx-auto">
                  Access 1500+ Foundation Models, Ready for you
                </p>

                {/* CTA Button */}
                <div className="mt-6 sm:mt-6 md:mt-8">
                  <Button
                    variant="primary"
                    size="medium"
                    className="rounded-2xl sm:rounded-2xl md:rounded-3xl px-8 sm:px-8 md:px-10 py-4 sm:py-4 md:py-5 text-base sm:text-base md:text-lg lg:text-xl font-semibold text-white w-fit mx-auto leading-relaxed"
                    onClick={() => {
                      const ctaSection = document.getElementById('cta-section');
                      if (ctaSection) {
                        ctaSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Start Your Agentic Journey
                  </Button>
                </div>
              </div>

              {/* Spline Container - Mobile */}
              <div className="flex justify-center w-full mt-4 relative z-10">
                <div className="relative w-full h-full z-10">
                
                   <div className="relative w-full max-w-[320px] xs:max-w-[380px] sm:max-w-[450px] bg-transparent overflow-hidden rounded-[32px] mx-auto">
                     <div className="w-full" style={{ aspectRatio: '631/374' }}>
                       <Spline 
                         scene="https://prod.spline.design/Ha8IoMVEpIiSJCbV/scene.splinecode"
                         className="w-full h-full"
                       />
                     </div>
                   </div>
                  
                  <div className="flex gap-1.5 xs:gap-2 mt-3 justify-center">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 xs:h-2 rounded-full transition-all duration-500 ${
                          i === (phraseIndex % 3) ? "bg-[#064EE3] w-6 xs:w-7 sm:w-8" : "bg-[#d3ddf5] w-6 xs:w-7 sm:w-8 opacity-60"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Desktop and Large Tablet Layout (>= 768px) - Side by Side */}
            <div className="hidden md:grid md:grid-cols-10 items-center h-full gap-8 relative z-10">

              {/* Left Content Container - 60% */}
              <div className="md:col-span-5 flex flex-col gap-[8px] lg:gap-[12px] justify-center text-center lg:text-left relative z-10">
                {/* Small Header */}
                <h2 className="text-[24px] md:text-[28px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px] font-manrope font-[800] text-global-1 whitespace-nowrap">
                  Agentic AI Breakthroughs
                </h2>

                {/* Main Heading with Slide Animation */}
                <h1 className="text-[20px] md:text-[24px] lg:text-[28px] xl:text-[36px] 2xl:text-[42px] font-manrope font-[600] leading-[24px] md:leading-[28px] lg:leading-[32px] xl:leading-[40px] 2xl:leading-[48px] text-global-1 h-[24px] md:h-[28px] lg:h-[32px] xl:h-[40px] 2xl:h-[48px] overflow-hidden whitespace-nowrap">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={phrases[phraseIndex % phrases.length]}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="block text-[#064EE3] cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={handlePhraseClick}
                    >
                      {phrases[phraseIndex % phrases.length]}
                    </motion.span>
                  </AnimatePresence>
                </h1>

                {/* Subtitle */}
                <h2 className="text-[24px] md:text-[28px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px] font-manrope font-[800] leading-[24px] md:leading-[28px] lg:leading-[32px] xl:leading-[36px] 2xl:leading-[48px] text-global-1 whitespace-nowrap">
                  Everything Unfolds Here
                </h2>

                {/* Description */}
                <p className="text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] font-manrope font-light leading-[16px] md:leading-[17px] lg:leading-[18px] xl:leading-[20px] text-global-1 mt-[12px] lg:mt-[16px] whitespace-nowrap">
                  Access 1500+ Foundation Models, Ready for you
                </p>

                {/* CTA Button */}
                <Button
                  variant="primary"
                  size="medium"
                  className="rounded-[20px] lg:rounded-[22px] xl:rounded-[24px] px-6 py-[12px] lg:py-[14px] xl:py-[16px] text-sm lg:text-base font-semibold text-white w-fit mx-auto lg:mx-0 mt-[16px] lg:mt-[20px]"
                  onClick={() => {
                    const ctaSection = document.getElementById('cta-section');
                    if (ctaSection) {
                      ctaSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Start Your Agentic Journey
                </Button>
              </div>

              {/* Right Spline Container - 40% Desktop */}
              <div className="md:col-span-5 flex justify-center lg:justify-end relative z-10">
                <div className="relative w-full h-full z-10">
                  
                   <div className="relative w-full max-w-[450px] md:max-w-[500px] lg:max-w-[550px] xl:max-w-[600px] 2xl:max-w-[650px] bg-transparent rounded-[32px] mx-auto">
                     <div className="w-full" style={{ aspectRatio: '631/374' }}>
                       <Spline 
                         scene="https://prod.spline.design/Ha8IoMVEpIiSJCbV/scene.splinecode"
                         className="w-full h-full"
                       />
                     </div>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
