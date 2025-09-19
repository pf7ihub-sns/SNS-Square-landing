import React, { useState } from "react";

const TABS = [
  { key: "challenge", label: "Challenge" },
  { key: "solutions", label: "Solutions" },
  { key: "differentiators", label: "What Sets Us Apart" },
];

const WhatWeExcelSection = () => {
  const [active, setActive] = useState("challenge");

  return (
    <section className="px-4 xs:px-5 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20" style={{ backgroundImage: "url('/images/home/what-we-excel.png')" }}>
      <div className="max-w-[1480px] mx-auto">
        <div className="mb-6 md:mb-8">
          <h3 className="font-manrope font-bold text-[28px] md:text-[30px] lg:text-[36px] leading-tight text-black">
            What We Excel At
          </h3>
          <p className="font-inter text-black/70 mt-3 max-w-4xl">
            We don’t just build AI, our engineers built Agentic intelligence that’s powerful, scalable, and ready to enhance
            your business from day one. Our AI agents aren’t just tools; they’re your business’s competitive edge.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-5 mb-6 md:mb-8">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={
                (active === t.key
                  ? "bg-black text-white"
                  : "bg-white text-black") +
                " border border-black/10 rounded-[4px] px-48 py-3 text-sm md:text-base transition-colors"
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Banner */}
        <div
          className="relative w-full rounded-[10px] overflow-hidden border border-black/10 bg-cover bg-center min-h-[280px] md:min-h-[360px] lg:min-h-[420px]"
        >
          <div className="absolute inset-0 bg-white/10" />
          <div className="relative z-10 p-6 md:p-10 lg:p-12 max-w-[720px]">
            <h6 className="text-black/70 mb-3">Database Backups_</h6>
            <h2 className="font-manrope font-extrabold text-black text-[32px] md:text-[44px] lg:text-[56px] leading-tight">
              Should I encrypt
              <br />
              my backups?
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeExcelSection;


