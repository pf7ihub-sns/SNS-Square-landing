import React from 'react';

const FeatureCardsSection = () => {
  return (
    <div className="relative z-30  xs:px-5 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="max-w-[1480px] mx-auto">
        {/* Section Title - Desktop H3 */}
        <h3 className="font-manrope font-bold text-[22px] md:text-[24px] lg:text-[28px] xl:text-[32px] 2xl:text-[36px] leading-tight text-[#040404] mb-6 md:mb-8 lg:mb-10">
          The complete Agentic AI suite designed for your needs
        </h3>
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
            <div className="relative p-6 sm:p-8 h-[460px] md:h-[520px] flex flex-col justify-between">
              <div>
                <h4 className="font-manrope font-semibold text-[22px] md:text-[24px] lg:text-[28px] leading-snug text-[#e65300]">
                  Foundational Agents
                </h4>
                <p className="mt-3 text-[#3a3a3a]">
                  Unlock Agentic intelligence with a comprehensive suite of AI agents ready to
                  power your applications.
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
            <div className="relative p-6 sm:p-8 h-[460px] md:h-[520px] flex flex-col justify-between">
              <div>
                <h4 className="font-manrope font-semibold text-[22px] md:text-[24px] lg:text-[28px] leading-snug text-[#2d2b87]">
                  Industry Solutions
                </h4>
                <p className="mt-3 text-[#3a3a3a]">
                  Transform your sector with a wide array of AI agents built for efficiency and
                  innovation.
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
            <div className="relative p-6 sm:p-8 h-[460px] md:h-[520px] flex flex-col justify-between">
              <div>
                <h4 className="font-manrope font-semibold text-[22px] md:text-[24px] lg:text-[28px] leading-snug text-[#0b5dd9]">
                  Customer Solutions
                </h4>
                <p className="mt-3 text-[#3a3a3a]">
                  Achieve personalized success with a full range of AI agents tailored to your
                  needs.
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
