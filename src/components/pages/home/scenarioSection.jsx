import React, { useMemo, useState, useEffect, useRef } from "react";
import BlackButton from "../../common/BlackButton";

const categories = [
  {
    key: "supply",
    label: "Supply Chain",
    images: [
      "/images/home/Link.png",
      "/images/home/Link (1).png",
      "/images/home/Link (2).png",
    ],
  },
  {
    key: "it",
    label: "Information Technology",
    images: [
      "/images/it.png",
      "/images/ai_jira.png",
      "/images/ai_only_engine.png",
    ],
  },
  {
    key: "health",
    label: "Healthcare",
    images: ["/images/healthcare.svg", "/images/ai_testing.jpg"],
  },
  {
    key: "hr",
    label: "Human Resource",
    images: ["/images/humanresource.svg", "/images/communication.jpg"],
  },
  { key: "ins", label: "Insurance", images: ["/images/insurance.png"] },
];

const RealScenariosSection = () => {
  const [active, setActive] = useState(categories[0].key);
  const [index, setIndex] = useState(0);
  const activeImages = useMemo(
    () => categories.find((c) => c.key === active)?.images ?? [],
    [active]
  );

  useEffect(() => {
    setIndex(0);
  }, [active]);

  // slider measurements for peek effect
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const PEEK_PX = 0; // part of the next slide visible at the right edge
  const GAP_PX = 16; // gap between slides

  useEffect(() => {
    const updateOffset = () => {
      if (!viewportRef.current) return;
      const slideWidth = viewportRef.current.clientWidth - PEEK_PX; // width of each slide to keep peek
      setOffset(-(slideWidth + GAP_PX) * index);
    };
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, [index]);

  return (
    <section
      className="w-full bg-no-repeat bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/images/home/Background-home-RS.png')" }}
    >
      <div className="max-w-[1480px] mx-auto py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-10 lg:gap-14 items-stretch">
          {/* Left column - two rows stretched to top and bottom */}
          <div className="flex flex-col justify-between min-h-[420px] lg:min-h-[520px]">
            {/* Row 1: Heading (Desktop H3) */}
            <div>
              <h3 className="font-manrope font-bold text-[28px] md:text-[30px] lg:text-[36px] leading-tight text-black">
                Real scenarios where agentic AI changes the game.
              </h3>
            </div>
            {/* Row 2: Paragraph + Button */}
            <div className="mt-6 lg:mt-10">
              <p className="font-inter text-black/70 mb-4 lg:mb-6">
                Experience the shift to true autonomy.
              </p>
              <BlackButton
                size="medium"
                variant="black"
                className="text-lg font-medium font-manrope px-6 py-3 w-fit"
              >
                View More
              </BlackButton>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4 lg:gap-6">
            {/* Row 1: tabs */}
            <div className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActive(c.key)}
                  className={
                    (active === c.key
                      ? "bg-black text-white"
                      : "bg-white text-black border border-black/10") +
                    " rounded-[6px] px-4 py-2 text-small font-inter"
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Row 2: slider container (peek next slide) */}
            <div ref={viewportRef} className="relative w-full bg-transparent rounded-[4px] h-[410px] md:h-[470px]">
              <div
                ref={trackRef}
                className="absolute inset-0 flex gap-4 will-change-transform"
                style={{ transform: `translateX(${offset}px)`, transition: 'transform 500ms ease-out', paddingRight: `${PEEK_PX}px` }}
              >
                {activeImages.map((src, i) => (
                  <div key={src + i} className="h-full rounded-[6px] overflow-hidden border border-black/10" style={{ minWidth: `calc(100% - ${PEEK_PX}px)` }}>
                    <img src={src} alt={active} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              {/* no navigation arrows as requested */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealScenariosSection;