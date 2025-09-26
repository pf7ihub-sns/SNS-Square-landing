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
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
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
                    Foundational Agents
                  </h4>
                </div>
                <p className="w-full text-zinc-600 font-inter leading-snug text-base">
                  Foundational Agents are core AI building blocks-flexible, scalable, and ready to power your business with Agentic intelligence, automation and innovation.
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
                    Industry Solutions
                  </h4>
                </div>
                <p className="w-full text-zinc-600 font-inter leading-snug text-base">
                  AI Agents crafted for your industry, delivering precise insights, efficiency and growth tailored to your business needs.
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
                    Customer Solutions
                  </h4>
                </div>
                <p className="w-full text-zinc-600 font-inter leading-snug text-base">
                  Personalised Agentic AI solutions crafted to meet your business needs with unique solutions.
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
