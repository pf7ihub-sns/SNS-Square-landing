import React from 'react';

const EndToEndCards = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1224px] mx-auto">
          
          {/* Header */}
          <div className="mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-4xl font-bold font-manrope text-black text-center lg:text-left">
              End-to-end AI <br /> Enablement Approach
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Foundational Agents Card */}
            <div className="h-auto lg:h-[527px] bg-rose-100 rounded border border-neutral-200 overflow-hidden p-6 lg:p-0 relative">
              <div className="lg:absolute lg:left-[25px] lg:top-[33.11px] lg:w-80 h-full flex flex-col justify-start">
                <div className="flex flex-col gap-3.5">
                  <h3 className="text-red-600 text-xl lg:text-3xl font-semibold font-manrope">
                    Foundational Agents
                  </h3>
                  <p className="text-zinc-600 text-sm lg:text-base font-normal font-inter leading-snug">
                    Foundational Agents are core AI building blocks-flexible, scalable, and ready to power your business with Agentic intelligence, automation and innovation.
                  </p>
                </div>
              </div>
            </div>

            {/* Industry Solutions Card */}
            <div className="h-auto lg:h-[527px] bg-gradient-to-l from-indigo-300 to-fuchsia-200 rounded border border-neutral-200 overflow-hidden p-6 lg:p-0 relative">
              <div className="lg:absolute lg:left-[25px] lg:top-[33.11px] lg:w-80 h-full flex flex-col justify-start">
                <div className="flex flex-col gap-4">
                  <h3 className="text-violet-500 text-xl lg:text-3xl font-semibold font-manrope">
                    Industry Solutions
                  </h3>
                  <p className="text-zinc-600 text-sm lg:text-base font-normal font-inter leading-snug">
                    AI Agents crafted for your industry, delivering precise insights, efficiency and growth tailored to your business needs.
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Solutions Card */}
            <div className="h-auto lg:h-[527px] bg-violet-100 rounded border border-neutral-200 overflow-hidden p-6 lg:p-0 relative">
              <div className="lg:absolute lg:left-[25px] lg:top-[33.11px] lg:w-80 h-full flex flex-col justify-start">
                <div className="flex flex-col gap-4">
                  <h3 className="text-blue-700 text-xl lg:text-3xl font-semibold font-manrope">
                    Customer Solutions
                  </h3>
                  <p className="text-zinc-600 text-sm lg:text-base font-normal font-inter leading-snug">
                    Personalised Agentic AI solutions crafted to meet your business needs with unique solutions.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default EndToEndCards;
