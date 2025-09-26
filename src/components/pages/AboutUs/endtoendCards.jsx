import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowOutward } from "react-icons/md";

const FeatureCardsSection = () => {
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Hide cursor on mobile
      if (window.innerWidth < 1024) {
        setCursor(prev => ({ ...prev, visible: false }));
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoized event handlers to prevent re-renders
  const handleMouseMove = useCallback((e) => {
    if (!isMobile) {
      setCursor(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    }
  }, [isMobile]);

  const showCursor = useCallback(() => {
    if (!isMobile) {
      setCursor(prev => ({ ...prev, visible: true }));
    }
  }, [isMobile]);

  const hideCursor = useCallback(() => {
    setCursor(prev => ({ ...prev, visible: false }));
  }, []);

  // Reset cursor on component unmount or route change
  useEffect(() => {
    return () => {
      setCursor({ x: 0, y: 0, visible: false });
    };
  }, []);

  // Global mouse leave handler to hide cursor when leaving the component area
  const handleGlobalMouseLeave = useCallback(() => {
    hideCursor();
  }, [hideCursor]);

  // Mobile Layout
  const MobileLayout = () => (
    <div className="w-full px-4">
      {/* Mobile Header */}
      <div className="mb-8">
        <h2 className="text-black text-center">
          End-to-end<br />
          AI Enablement Approach
        </h2>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-4">
        {/* Foundational Agents Card - Mobile */}
        <article
          className="w-full h-[280px] relative bg-rose-100 rounded-lg border border-neutral-200 overflow-hidden"
          onClick={() => navigate('/agent-workbench')}
        >
          <div className="absolute inset-4 flex flex-col justify-start items-start gap-3">
            <h4 className="text-red-600">
              Foundational Agents
            </h4>
            <p className="text-zinc-600 font-inter leading-snug text-sm">
              Foundational Agents are core AI building blocks-flexible, scalable, and ready to power your business with Agentic intelligence, automation and innovation.
            </p>
          </div>
        </article>

        {/* Industry Solutions Card - Mobile */}
        <article
          className="w-full h-[280px] relative bg-gradient-to-l from-indigo-300 to-fuchsia-200 rounded-lg border border-neutral-200 overflow-hidden"
          onClick={() => navigate('/agent-workbench')}
        >
          <div className="absolute inset-4 flex flex-col justify-start items-start gap-3">
            <h4 className="text-violet-500">
              Industry Solutions
            </h4>
            <p className="text-zinc-600 font-inter leading-snug text-sm">
              AI Agents crafted for your industry, delivering precise insights, efficiency and growth tailored to your business needs.
            </p>
          </div>
        </article>

        {/* Customer Solutions Card - Mobile */}
        <article
          className="w-full h-[280px] relative bg-violet-100 rounded-lg border border-neutral-200 overflow-hidden"
          onClick={() => navigate('/agent-workbench')}
        >
          <div className="absolute inset-4 flex flex-col justify-start items-start gap-3">
            <h4 className="text-blue-700">
              Customer Solutions
            </h4>
            <p className="text-zinc-600 font-inter leading-snug text-sm">
              Personalised Agentic AI solutions crafted to meet your business needs with unique solutions.
            </p>
          </div>
        </article>
      </div>
    </div>
  );

  // Desktop Layout
  const DesktopLayout = () => (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8 sm:mb-10 lg:mb-12 xl:mb-16">
        <h2 className="leading-tight text-black text-left text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold font-manrope">
          End-to-end<br />
          AI Enablement Approach
        </h2>
      </div>

      {/* Three Cards - Left Aligned Container */}
      <div className="flex justify-start items-center">
        <div className="flex flex-col lg:flex-row justify-start items-center gap-4 sm:gap-5 md:gap-6 max-w-[1224px]">
          
          {/* Foundational Agents Card */}
          <article
            className="w-full lg:w-96 h-[320px] sm:h-[350px] md:h-[380px] lg:h-[527px] relative bg-rose-100 rounded border border-neutral-200 overflow-hidden cursor-none"
            onMouseEnter={showCursor}
            onMouseLeave={hideCursor}
            onClick={() => navigate('/agent-workbench')}
          >
            <div className="w-full lg:w-80 left-0 lg:left-[25px] top-4 sm:top-5 md:top-6 lg:top-[33.11px] absolute flex flex-col justify-start items-start gap-3 sm:gap-3.5 px-4 sm:px-5 md:px-6 lg:px-0">
              <div className="w-full flex justify-between items-center">
                <h4
                  className="inline-block leading-tight text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-manrope"
                  style={{
                    background: "linear-gradient(90deg, #FA0800 0%, #FF8A0E 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Foundational Agents
                </h4>
              </div>
              <p className="w-full text-zinc-600 font-inter leading-snug text-xs sm:text-sm md:text-sm lg:text-base">
                Foundational Agents are core AI building blocks-flexible, scalable, and ready to power your business with Agentic intelligence, automation and innovation.
              </p>
            </div>
          </article>

          {/* Industry Solutions Card */}
          <article
            className="w-full lg:w-96 h-[320px] sm:h-[350px] md:h-[380px] lg:h-[527px] relative bg-gradient-to-l from-indigo-300 to-fuchsia-200 rounded border border-neutral-200 overflow-hidden cursor-none"
            onMouseEnter={showCursor}
            onMouseLeave={hideCursor}
            onClick={() => navigate('/agent-workbench')}
          >
            <div className="w-full lg:w-80 left-0 lg:left-[25px] top-4 sm:top-5 md:top-6 lg:top-[33.11px] absolute flex flex-col justify-start items-start gap-3 sm:gap-3.5 md:gap-4 px-4 sm:px-5 md:px-6 lg:px-0">
              <div className="w-full flex justify-between items-center">
                <h4
                  className="inline-block leading-tight text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-manrope"
                  style={{
                    background: "linear-gradient(90deg, #805DFC 0%, #4C3796 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Industry Solutions
                </h4>
              </div>
              <p className="w-full text-zinc-600 font-inter leading-snug text-xs sm:text-sm md:text-sm lg:text-base">
                AI Agents crafted for your industry, delivering precise insights, efficiency and growth tailored to your business needs.
              </p>
            </div>
          </article>

          {/* Customer Solutions Card */}
          <article
            className="w-full lg:w-96 h-[320px] sm:h-[350px] md:h-[380px] lg:h-[527px] relative bg-violet-100 rounded border border-neutral-200 overflow-hidden cursor-none"
            onMouseEnter={showCursor}
            onMouseLeave={hideCursor}
            onClick={() => navigate('/agent-workbench')}
          >
            <div className="w-full lg:w-80 left-0 lg:left-[25px] top-4 sm:top-5 md:top-6 lg:top-[33.11px] absolute flex flex-col justify-start items-start gap-3 sm:gap-3.5 md:gap-4 px-4 sm:px-5 md:px-6 lg:px-0">
              <div className="w-full flex justify-start items-center gap-7">
                <h4
                  className="inline-block leading-tight text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-manrope"
                  style={{
                    background: "linear-gradient(90deg, #1357E5 0%, #002E8E 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Customer Solutions
                </h4>
              </div>
              <p className="w-full text-zinc-600 font-inter leading-snug text-xs sm:text-sm md:text-sm lg:text-base">
                Personalised Agentic AI solutions crafted to meet your business needs with unique solutions.
              </p>
            </div>
          </article>

        </div>
      </div>
    </div>
  );

  return (
    <div
      className="relative z-30 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24 bg-white flex flex-col items-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleGlobalMouseLeave}
    >
      {/* Conditional Rendering */}
      {isMobile ? <MobileLayout /> : <DesktopLayout />}

      {/* Custom Cursor - Desktop Only with Better State Management */}
      {cursor.visible && !isMobile && (
        <div
          className="fixed z-[100] pointer-events-none transition-opacity duration-150 ease-out"
          style={{ 
            left: cursor.x, 
            top: cursor.y, 
            transform: 'translate(-50%, -50%)',
            opacity: cursor.visible ? 1 : 0
          }}
        >
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg transition-transform duration-150 hover:scale-110">
            <MdArrowOutward size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureCardsSection;
