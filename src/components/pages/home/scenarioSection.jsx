import React, { useMemo, useState, useEffect } from "react";
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

  return (
    <section
      className="w-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/images/home/Background-home-RS.png')" }}
    >
      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
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

            {/* Row 2: carousel container */}
            <div className="relative w-full bg-white rounded-[8px] border border-black/10 p-2 h-[360px] md:h-[420px]">
              {/* image area split like reference: left wide white area, right card */}
              <div className="absolute inset-0 grid grid-cols-[1fr_520px] md:grid-cols-[1fr_560px] gap-2">
                <div className="bg-white rounded-[6px] border border-black/5" />
                <div className="relative rounded-[6px] overflow-hidden border border-black/10">
                  {activeImages.map((src, i) => (
                    <img
                      key={src + i}
                      src={src}
                      alt={active}
                      className={
                        "absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out " +
                        (i === index ? "translate-x-0" : i < index ? "-translate-x-full" : "translate-x-full")
                      }
                    />
                  ))}
                  {/* Slider controls */}
                  {activeImages.length > 1 && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-2">
                      <button
                        type="button"
                        onClick={() => setIndex((i) => (i - 1 + activeImages.length) % activeImages.length)}
                        className="pointer-events-auto bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black"
                        aria-label="Previous"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => setIndex((i) => (i + 1) % activeImages.length)}
                        className="pointer-events-auto bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black"
                        aria-label="Next"
                      >
                        ›
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealScenariosSection;