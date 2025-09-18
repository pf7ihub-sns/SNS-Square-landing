import React, { useState } from 'react';

const TABS = [
  { key: 'marketplace', label: 'Agentic AI Marketplace', desc: 'Agentic AI Marketplace', icon: '/images/home/OCS-icon.png' },
  { key: 'digital', label: 'Digital Transformation', desc: 'Digital Transformation', icon: '/images/home/OCS-icon.png' },
  { key: 'data', label: 'AI & Data Solutions', desc: 'AI & Data Solutions', icon: '/images/home/OCS-icon.png' },
  { key: 'platform', label: 'Enterprise Platform Services', desc: 'Enterprise Platform Services', icon: '/images/home/OCS-icon.png' },
  { key: 'custom', label: 'Custom Development', desc: 'Custom Development', icon: '/images/home/OCS-icon.png' },
];

const UseCasesSection = () => {
  const [active, setActive] = useState(TABS[0]);

  return (
    <div className="px-4 xs:px-5 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Row 1: heading + paragraph */}
        <div className="mb-8 lg:mb-12">
          <h3 className="font-manrope font-bold text-[28px] md:text-[30px] lg:text-[36px] leading-tight text-black">
            Our Core Service
          </h3>
          <p className="font-inter text-black/70 mt-3">
            Pre-built AI agents designed with advanced capabilities to serve
          </p>
        </div>

        {/* Row 2: two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 lg:gap-10 items-start">
          {/* Left column: 5 rows (H6) */}
          <div className="space-y-4">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t)}
                className={
                  (active.key === t.key
                    ? 'bg-[#1357E5] text-white'
                    : 'bg-[#F8F8F8] text-black') +
                  ' w-full text-left rounded-[4px] px-4 py-6 transition-colors flex items-center gap-4'
                }
              >
                <img src={t.icon} alt={t.label} className="w-7 h-6" />
                <h6 className="font-manrope font-medium text-[16px] md:text-[17px] lg:text-[18px]">
                  {t.label}
                </h6>
              </button>
            ))}
          </div>

          {/* Right column: background image card with title + description */}
          <div className="relative rounded-[4px] overflow-hidden min-h-[320px] lg:min-h-[420px] bg-cover bg-center"
               style={{ backgroundImage: "url('/images/Frame 584.png')" }}>
            {/* bottom banner */}
            <div className="absolute bottom-18 left-0 right-0 text-white p-6">
              <h4 className="font-manrope font-semibold text-[22px] md:text-[24px] lg:text-[28px] leading-snug">
                {active.label}
              </h4>
              <p className="mt-4 opacity-90">{active.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCasesSection;
