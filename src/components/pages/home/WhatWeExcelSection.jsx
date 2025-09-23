import React, { useState, useRef, useEffect } from "react";
import Button from "../../common/BlackButton";

const TABS = [
  {
    key: "challenge",
    label: "Challenge",
    image: "/images/home/Challange.png",
    title: "The New Reality: Complexity Defines Business Survival",
    description: "Innovation demands speed. Customers demand perfection. Markets demand agility. Meeting all three at once has become the greatest struggle of modern business."
  },
  {
    key: "solutions",
    label: "Solutions",
    image: "/images/home/Solution.png",
    title: "The Agentic Business Blueprint: Redefining Your Enterprise Success",
    description: "Our ABB framework bridges business goals with adaptive strategies and agentic intelligence, empowering organisations to innovate at speed, deliver at scale, and sustain long-term growth."
  },
  {
    key: "differentiators",
    label: "What Sets Us Apart",
    image: "/images/home/Differentiators.png",
    title: "We’re Built to Win Where Others Struggle",
    points: [
      { subtitle: "Domain Versatility", description: "Whether healthcare, finance, retail, or tech, we design agentic solutions that speak your language and solve your unique challenges." },
      { subtitle: "AI Engineering First", description: "Our foundation is rooted in real Agentic AI, data, and automation built to scale reliably and perform when it matters most." },
      { subtitle: "Born Agentic", description: "We’re built in the age of autonomous Agentic AI solutions designed for tomorrow, not retrofitted from yesterday’s playbook." },
      { subtitle: "Outcome Obsession", description: "Every solution is engineered to drive real business results, boosting efficiency, cutting complexity, and accelerating growth." }
    ]
  }
];


const WhatWeExcelSection = () => {
  const [active, setActive] = useState("challenge");
  const activeTab = TABS.find((t) => t.key === active);
  const wheelCooldownRef = useRef(0);
  const sectionRef = useRef(null);
  const hasCenteredRef = useRef(false);
  const interceptEnabledRef = useRef(true);
  const stepCountRef = useRef(0);
  const MAX_STEPS = 3; // allow exactly 3 tab steps before releasing
  const wasInCentralZoneRef = useRef(false);

  const resetInterception = () => {
    hasCenteredRef.current = false;
    interceptEnabledRef.current = true;
    wheelCooldownRef.current = 0;
    stepCountRef.current = 0;
  };

  // Reset interception when the section leaves the viewport, so re-entering starts fresh
  useEffect(() => {
    const onScroll = () => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const offscreen = rect.bottom < 0 || rect.top > window.innerHeight;
      if (offscreen) {
        resetInterception();
        wasInCentralZoneRef.current = false;
        return;
      }

      // If the section re-enters a central viewport zone, re-arm interception
      const viewportHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distanceToCenter = Math.abs(elementCenter - viewportCenter);
      const inCentralZone = distanceToCenter <= viewportHeight * 0.25; // within middle 50% of viewport

      if (inCentralZone && !wasInCentralZoneRef.current) {
        resetInterception();
        wasInCentralZoneRef.current = true;
      } else if (!inCentralZone && wasInCentralZoneRef.current) {
        wasInCentralZoneRef.current = false;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleWheel = (e) => {
    if (!interceptEnabledRef.current) return; // allow normal page scroll

    const now = Date.now();
    // throttle to avoid skipping multiple tabs on trackpads
    if (now - wheelCooldownRef.current < 420) return;

    const currentIndex = TABS.findIndex((t) => t.key === active);

    // Ensure section is centered in viewport before stepping tabs
    const sectionEl = sectionRef.current;
    if (sectionEl) {
      const rect = sectionEl.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distanceToCenter = elementCenter - viewportCenter;

      if (!hasCenteredRef.current && Math.abs(distanceToCenter) > 12) {
        e.preventDefault();
        window.scrollBy({ top: distanceToCenter, left: 0, behavior: "smooth" });
        hasCenteredRef.current = true;
        wheelCooldownRef.current = now;
        return; // wait for next wheel to move tabs
      }
    }

    const absX = Math.abs(e.deltaX || 0);
    const absY = Math.abs(e.deltaY || 0);
    const useHorizontal = absX > absY;
    const isNext = useHorizontal ? e.deltaX > 0 : e.deltaY > 0;

    if (isNext) {
      if (currentIndex < TABS.length - 1 && stepCountRef.current < MAX_STEPS) {
        e.preventDefault();
        setActive(TABS[currentIndex + 1].key);
        wheelCooldownRef.current = now;
        stepCountRef.current += 1;
        if (stepCountRef.current >= MAX_STEPS || currentIndex + 1 === TABS.length - 1) {
          // after 3 steps or reaching the last tab, release
          interceptEnabledRef.current = false;
        }
      } else {
        interceptEnabledRef.current = false;
      }
    } else {
      if (currentIndex > 0 && stepCountRef.current < MAX_STEPS) {
        e.preventDefault();
        setActive(TABS[currentIndex - 1].key);
        wheelCooldownRef.current = now;
        stepCountRef.current += 1;
        if (stepCountRef.current >= MAX_STEPS || currentIndex - 1 === 0) {
          // after 3 steps or reaching the first tab, release
          interceptEnabledRef.current = false;
        }
      } else {
        interceptEnabledRef.current = false;
      }
    }
  };

  return (
    <section ref={sectionRef} className="px-4 xs:px-5 sm:px-10 lg:px-12 py-12 md:py-16 lg:py-20" /* onWheel={handleWheel} */>
      <div className="max-w-[1480px] mx-auto">
        <div className="mb-6 md:mb-8">
          <h3 className="font-manrope font-bold text-[24px] md:text-[30px] lg:text-[36px] leading-tight text-black">
            What We Excel At
          </h3>
          <p className="font-inter text-black/70 mt-3 max-w-4xl">
            We don’t just build AI, our engineers built Agentic intelligence that’s powerful, scalable, and ready to enhance
            your business from day one. Our AI agents aren’t just tools; they’re your business’s competitive edge.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 md:gap-5 w-full mb-6 md:mb-8">
          {TABS.map((t) => (
            <Button
              key={t.key}
              onClick={() => setActive(t.key)}
              variant={active === t.key ? "black" : "black-outline"}
              size="medium"
              fullWidth
              className="flex-1 text-center text-sm"
            >
              {t.label}
            </Button>
          ))}
        </div>

        {/* Banner */}
        <div
          className="relative w-full rounded-[10px] overflow-hidden border border-black/10 bg-cover bg-center h-auto md:h-[420px] lg:h-[515px]"
          style={{ backgroundImage: `url(${activeTab?.image})` }}
        >
          <div className="absolute inset-0 bg-white/20" />
          <div className="relative z-10 p-6 md:p-10 lg:p-12 max-w-[760px]">
            {active === "differentiators" ? (
              <div>
                <h2 className=" leading-tight mb-6 text-xl sm:text-2xl">
                  {activeTab?.title}
                </h2>
                <div className="rounded-md p-2 md:p-4">
                  {activeTab?.points?.map((p, idx) => (
                    <div
                      key={p.subtitle}
                      className="group cursor-pointer select-none border-b border-black/10 last:border-none py-4"
                    >
                      <div className="flex items-center justify-between gap-6">
                        <p className="font-manrope text-black text-base md:text-xl lg:text-2xl">
                          {p.subtitle}
                        </p>
                        <span className="font-inter text-black/60 text-sm md:text-lg">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out max-h-0 opacity-0 translate-y-1 group-hover:max-h-40 group-hover:opacity-100 group-hover:translate-y-0 will-change-[max-height,opacity,transform]">
                        <p className=" mt-3 pr-10 text-sm">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="my-auto">
                <h2 className=" leading-tight text-xl sm:text-2xl">
                  {activeTab?.title}
                </h2>
                <p className="rounded-md mt-4 backdrop-blur text-sm sm:text-base">
                  {activeTab?.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeExcelSection;


