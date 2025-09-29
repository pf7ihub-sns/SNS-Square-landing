import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowOutward } from "react-icons/md";

const FeatureCardsSection = () => {
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    setCursor((c) => ({ ...c, x: e.clientX, y: e.clientY }));
  };

  const showCursor = () => setCursor((c) => ({ ...c, visible: true }));
  const hideCursor = () => setCursor((c) => ({ ...c, visible: false }));

  return (
    <div
      className="relative z-30 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24 bg-white flex flex-col items-center"
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-4 lg:px-4">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10 lg:mb-12 xl:mb-16">
          <h2 className="leading-tight text-black text-left">
            End-to-end<br />
            AI Enablement Approach
          </h2>
        </div>

        {/* Mobile Cards - Show on small screens */}
        <div className="flex flex-col gap-4 lg:hidden">
          {/* Foundational Agents Card - Mobile */}
          <article
            className="w-full h-[280px] relative bg-rose-100 rounded-lg border border-neutral-200 overflow-hidden"
            onClick={() => navigate('/agent-workbench')}
          >
            <div className="absolute inset-4 flex flex-col justify-start items-start gap-3">
              <h4 className="text-red-600">
           Strategy to Execution
              </h4>
              <p className="text-zinc-600 font-inter leading-snug text-sm">
               We don’t just advise; we architect. From identifying the right AI opportunities to designing a tailored roadmap, we align your business vision with transformative AI strategies that are practical, scalable, and future-ready.
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
                Seamless Integration
              </h4>
              <p className="text-zinc-600 font-inter leading-snug text-sm">
                AI delivers value only when it’s embedded into your core operations. We integrate intelligent systems into your existing workflows, ensuring interoperability, automation, and measurable efficiency without disrupting business continuity.
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
                Continuous Optimisation
              </h4>
              <p className="text-zinc-600 font-inter leading-snug text-sm">
                AI isn’t a one-time solution it evolves. Our approach includes ongoing monitoring, model retraining, and performance tuning, enabling your business to adapt quickly, stay competitive, and unlock sustained growth.
              </p>
            </div>
          </article>
        </div>

        {/* Desktop Cards - Show on large screens */}
        <div className="hidden lg:flex justify-start items-center">
          <div className="flex flex-row justify-start items-center gap-6 max-w-[1224px]">
            
            {/* Foundational Agents Card */}
            <article
              className="w-96 h-[527px] relative bg-rose-100 rounded border border-neutral-200 overflow-hidden cursor-none"
              onMouseEnter={showCursor}
              onMouseLeave={hideCursor}
              onClick={() => navigate('/agent-workbench')}
            >
              <div className="w-80 left-[25px] top-[33.11px] absolute flex flex-col justify-start items-start gap-3.5">
                <div className="w-full flex justify-between items-center">
                  <h4
                    className="inline-block leading-tight text-3xl font-bold font-manrope"
                    style={{
                      background: "linear-gradient(90deg, #FA0800 0%, #FF8A0E 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                Strategy to Execution
                  </h4>
                </div>
                <p className="w-full text-zinc-600 font-inter leading-snug text-base">
                 We don’t just advise; we architect. From identifying the right AI opportunities to designing a tailored roadmap, we align your business vision with transformative AI strategies that are practical, scalable, and future-ready.
                </p>
              </div>
            </article>

            {/* Industry Solutions Card */}
            <article
              className="w-96 h-[527px] relative bg-gradient-to-l from-indigo-300 to-fuchsia-200 rounded border border-neutral-200 overflow-hidden cursor-none"
              onMouseEnter={showCursor}
              onMouseLeave={hideCursor}
              onClick={() => navigate('/agent-workbench')}
            >
              <div className="w-80 left-[25px] top-[33.11px] absolute flex flex-col justify-start items-start gap-4">
                <div className="w-full flex justify-between items-center">
                  <h4
                    className="inline-block leading-tight text-3xl font-bold font-manrope"
                    style={{
                      background: "linear-gradient(90deg, #805DFC 0%, #4C3796 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                  Seamless Integration
                  </h4>
                </div>
                <p className="w-full text-zinc-600 font-inter leading-snug text-base">
                  AI delivers value only when it’s embedded into your core operations. We integrate intelligent systems into your existing workflows, ensuring interoperability, automation, and measurable efficiency without disrupting business continuity.
                </p>
              </div>
            </article>

            {/* Customer Solutions Card */}
            <article
              className="w-96 h-[527px] relative bg-violet-100 rounded border border-neutral-200 overflow-hidden cursor-none"
              onMouseEnter={showCursor}
              onMouseLeave={hideCursor}
              onClick={() => navigate('/agent-workbench')}
            >
              <div className="w-80 left-[25px] top-[33.11px] absolute flex flex-col justify-start items-start gap-4">
                <div className="w-full flex justify-start items-center gap-7">
                  <h4
                    className="inline-block leading-tight text-3xl font-bold font-manrope"
                    style={{
                      background: "linear-gradient(90deg, #1357E5 0%, #002E8E 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                      Continuous Optimisation
                  </h4>
                </div>
                <p className="w-full text-zinc-600 font-inter leading-snug text-base">
                  AI isn’t a one-time solution it evolves. Our approach includes ongoing monitoring, model retraining, and performance tuning, enabling your business to adapt quickly, stay competitive, and unlock sustained growth.
                </p>
              </div>
            </article>

          </div>
        </div>
      </div>

      {/* Custom Cursor - Only visible on desktop */}
      {cursor.visible && (
        <div
          className="fixed z-[100] pointer-events-none hidden lg:block"
          style={{ left: cursor.x, top: cursor.y, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg transition-transform duration-150">
            <MdArrowOutward size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureCardsSection;
