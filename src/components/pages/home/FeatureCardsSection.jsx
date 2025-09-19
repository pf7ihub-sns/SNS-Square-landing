import React from 'react';

const FeatureCardsSection = () => {
  return (
    <div className="relative z-30  xs:px-5 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="max-w-[1480px] mx-auto">
        {/* Section Title - Desktop H3 */}
        <h3 className="font-bold leading-tight">
        A Next-Generation Agentic AI Suite, <br /> Built Around You
        </h3>
        <p className="mt-3 text-[#606060]">Not just another AI platform. A complete Agentic AI suite engineered to adapt to your <br /> challenges, empower your teams, and unlock new possibilities.</p>
        {/* Three image-backed cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 mt-6 md:mt-8 lg:mt-10">
          {/* Card 1 */}
          <article
            className="relative rounded-[4px] overflow-hidden shadow-sm bg-white"
            style={{
              backgroundImage: "url('/images/home/Link.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-white/10" />
            <div className="relative p-6 sm:p-8 h-[480px] md:h-[560px] flex flex-col justify-between">
              <div>
                <h4 style={{
                  background: "linear-gradient(90deg, #FA0800 0%, #FF8A0E 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}>
                  Foundational Agents
                </h4>
                <p className="mt-3 text-[#606060]">
                Foundational Agents are core AI building <br /> blocks, flexible, scalable, and ready to <br /> power your business with Agentic <br /> intelligence, automation and innovation.
                </p>
              </div>
            </div>
          </article>

          {/* Card 2 */}
          <article
            className="relative rounded-[4px] overflow-hidden shadow-sm bg-white"
            style={{
              backgroundImage: "url('/images/home/Link (1).png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-white/10" />
            <div className="relative p-6 sm:p-8 h-[480px] md:h-[560px] flex flex-col justify-between">
              <div>
                <h4 style={{
                  background: "linear-gradient(90deg, #805DFC 0%, #4C3796 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}>
                  Industry Solutions
                </h4>
                <p className="mt-3 text-[#606060]">
                AI Agents crafted for your industry, <br/>delivering precise insights, efficiency and <br/>growth tailored to your business needs.
                </p>
              </div>
            </div>
          </article>

          {/* Card 3 */}
          <article
            className="relative rounded-[4px] overflow-hidden shadow-sm bg-white"
            style={{
              backgroundImage: "url('/images/home/Link (2).png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-white/10" />
            <div className="relative p-6 sm:p-8 h-[480px] md:h-[560px] flex flex-col justify-between">
              <div>
                <h4 style={{
                  background: "linear-gradient(90deg, #1357E5 0%, #002E8E 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}>
                  Customer Solutions
                </h4>
                <p className="mt-3 text-[#606060]">
                Personalised Agentic AI solutions crafted <br/>to meet your business needs with unique <br/>solutions.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default FeatureCardsSection;
