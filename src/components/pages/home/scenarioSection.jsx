import React, { useMemo, useState, useEffect, useRef } from "react";
import BlackButton from "../../common/BlackButton";

const categories = [
  {
    key: "supply",
    label: "Supply Chain",
    images: ["/images/home/usecase/Group - 1.png"],
  },
  {
    key: "it",
    label: "Information Technology",
    images: ["/images/home/usecase/Group - 3.png"],
  },
  {
    key: "health",
    label: "Healthcare",
    images: ["/images/home/usecase/Group - 5.png"],
  },
  {
    key: "hr",
    label: "Human Resource",
    images: ["/images/home/usecase/Group - 7.png"],
  },
  { key: "ins", label: "Insurance", images: ["/images/home/usecase/Group - 10.png"] },
];

const RealScenariosSection = () => {
  const [active, setActive] = useState(categories[0].key);
  const [index, setIndex] = useState(0); // index of category
  const activeImages = useMemo(() => categories[index].images, [index]);

  useEffect(() => {
    const next = categories.findIndex((c) => c.key === active);
    if (next !== -1) setIndex(next);
  }, [active]);

  // slider measurements for peek effect
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const PEEK_PX = 170; // How much of the next slide to show
  const GAP_PX = 16; // Corresponds to gap-4 class

  // drag state
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const THRESHOLD = 80; // pixels to navigate

  useEffect(() => {
    const updateOffset = () => {
      if (!viewportRef.current) return;
      const slideWidth = viewportRef.current.clientWidth - PEEK_PX;
      setOffset(-(slideWidth + GAP_PX) * index);
    };
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, [index]);

  const onPointerDown = (e) => {
    if (!viewportRef.current) return;
    draggingRef.current = true;
    setIsDragging(true);
    startXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startOffsetRef.current = offset;
    viewportRef.current.setPointerCapture?.(e.pointerId ?? 1);
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current || !viewportRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const dx = clientX - startXRef.current;
    // Clamp within [minOffset, maxOffset] so first slide never overflows
    const slideWidth = viewportRef.current.clientWidth - PEEK_PX;
    const maxOffset = 0;
    const minOffset = -((slideWidth + GAP_PX) * (categories.length - 1));
    let next = startOffsetRef.current + dx;
    if (next > maxOffset) next = maxOffset;
    if (next < minOffset) next = minOffset;
    setOffset(next);
  };

  const onPointerUp = (e) => {
    if (!draggingRef.current || !viewportRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const dx = clientX - startXRef.current;
    if (dx <= -THRESHOLD && index < categories.length - 1) {
      // swipe left → next category
      setActive(categories[index + 1].key);
    } else if (dx >= THRESHOLD && index > 0) {
      // swipe right → previous category
      setActive(categories[index - 1].key);
    } else {
      // snap back
      const slideWidth = viewportRef.current.clientWidth - PEEK_PX;
      setOffset(-(slideWidth + GAP_PX) * index);
    }
  };

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
                Beyond Hype: <br/>Agentic AI in Action
              </h3>
            </div>
            {/* Row 2: Paragraph + Button */}
            <div className="mt-6 lg:mt-10">
              <p className="font-inter text-[#606060] mb-4 lg:mb-6">
                Discover practical scenarios where Agentic AI <br/>reshapes industries, accelerates decisions, and <br/>delivers results that once seemed impossible.
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
            <div className="flex flex-wrap gap-4">
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
            <div
              ref={viewportRef}
              className="relative w-full bg-transparent rounded-[4px] h-[410px] md:h-[470px] cursor-grab active:cursor-grabbing"
              style={{ clipPath: "inset(0 -100vw 0 0)" }}
              onMouseDown={onPointerDown}
              onMouseMove={onPointerMove}
              onMouseUp={onPointerUp}
              onMouseLeave={onPointerUp}
              onTouchStart={onPointerDown}
              onTouchMove={onPointerMove}
              onTouchEnd={onPointerUp}
            >
              <div
                ref={trackRef}
                className="absolute inset-0 flex gap-4 will-change-transform"
                style={{ transform: `translateX(${offset}px)`, transition: isDragging ? 'none' : 'transform 500ms ease-out' }}
              >
                {categories.map((cat) => (
                  <div key={cat.key} className="h-full overflow-hidden" style={{ minWidth: `calc(100% - ${PEEK_PX}px)` }}>
                    <img src={cat.images[0]} alt={cat.label} className="w-full h-full object-contain" draggable="false"/>
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