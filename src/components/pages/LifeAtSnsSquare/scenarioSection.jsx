import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BlackButton from "../../common/BlackButton";

const categories = [
  {
    key: "supply",
    label: "Supply Chain",
    images: ["/images/home/usecase/SupplyChain.png"],
    gradient:
      "linear-gradient(359.77deg, rgba(216, 230, 255, 0.75) 52.68%, rgba(255, 255, 255, 0) 119.66%)",
    description:
      "Agentic AI transforms supply chains into proactive, intelligent networks, predicting disruptions, optimizing flows, and ensuring products reach the right place at the right time with unmatched efficiency.",
  },
  {
    key: "it",
    label: "Information Technology",
    images: ["/images/home/usecase/InformationTechnology.png"],
    gradient:
    "linear-gradient(359.77deg, rgba(216, 230, 255, 0.86) 52.68%, rgba(255, 255, 255, 0) 119.66%)",
    description:
      "Agentic AI turns IT into a strategic engine, self-monitoring, self-healing, and continuously optimizing systems to accelerate digital transformation and reduce risk.",
  },  
  {
    key: "health",
    label: "Health Care",
    images: ["/images/home/usecase/Health-care.png"],
    gradient:
      // "linear-gradient(359.77deg, rgba(216, 230, 255, 0.75) 52.68%, rgba(255, 255, 255, 0) 119.66%)",
       "linear-gradient(359.77deg, rgba(202, 236, 188, 0.51) 52.68%, rgba(255, 255, 255, 0) 119.66%)",
    description:
      "Agentic AI powers healthcare that is precise, predictive, and compassionate, enabling personalized patient care, smarter operations, and lighter burdens for caregivers.",
  },
  {
    key: "hr",
    label: "Human Resource",
    images: ["/images/home/usecase/HumanResource.png"],
    gradient:
    "linear-gradient(359.77deg, rgba(249, 238, 241, 0.94) 52.68%, rgba(255, 255, 255, 0) 119.66%)",
    description:
      "Agentic AI empowers HR to unlock human potential, from intelligent recruitment and predictive retention to adaptive learning, turning people-first strategies into scalable impact.",
  },
  {
    key: "ins",
    label: "Insurance",
    images: ["/images/home/usecase/Insurance.png"],
    gradient:
    "linear-gradient(359.77deg, rgba(254, 241, 230, 0.8) 52.68%, rgba(255, 255, 255, 0) 119.66%)",
    description:
      "Agentic AI strengthens trust and agility in insurance, detecting fraud in real time, automating claims, and delivering hyper-personalized policies with speed and confidence.",
  },
];


const RealScenariosSection = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(categories[0].key);
  const [index, setIndex] = useState(0); // index of category
  const activeImages = useMemo(() => categories[index].images, [index]);

  // Fixed mapping to match the useCase.jsx categories
  const keyToUsecaseCategory = {
    health: 'healthcare',
    supply: 'supply-chain',
    hr: 'human-resource',
    it: 'information-technology',
    ins: 'insurance',
  };

  useEffect(() => {
    const next = categories.findIndex((c) => c.key === active);
    if (next !== -1) setIndex(next);
  }, [active]);

  // slider measurements for peek effect
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [PEEK_PX, setPEEK_PX] = useState(180);
  const GAP_PX = 16; // Corresponds to gap-4 class

  useEffect(() => {
    const updatePeek = () => {
      if (window.innerWidth < 450) {
        setPEEK_PX(100);
      } else {
        setPEEK_PX(180);
      }
    };
    updatePeek();
    window.addEventListener("resize", updatePeek);
    return () => window.removeEventListener("resize", updatePeek);
  }, []);

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
  }, [index, PEEK_PX]);

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

  const handleKnowMoreClick = (e, categoryKey) => {
    e.preventDefault();
    e.stopPropagation();
    
    const mappedCategory = keyToUsecaseCategory[categoryKey];
    if (mappedCategory) {
      navigate(`/usecase?category=${mappedCategory}`);
    } else {
      // Fallback to just /usecase if mapping not found
      navigate('/usecase');
    }
  };

  return (
    <section
      className="w-full bg-no-repeat bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/images/home/Background-home-RS.png')" }}
    >
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 lg:gap-10 items-start">
          {/* Left column - two rows stretched to top and bottom */}
          <div className="flex flex-col justify-start sticky top-24 lg:min-h-[400px]">
            {/* Row 1: Heading (Desktop H3) */}
            <div>
              <h3 className="font-manrope font-bold text-[28px] md:text-[32px] lg:text-[40px] leading-tight text-black scenario-section mb-4">
                Beyond Hype: <br/>Agentic AI in Action
              </h3>
            </div>
            {/* Row 2: Paragraph + Button */}
            <div className="mt-4 lg:mt-6">
              <p className="font-inter text-[#606060] mb-6 lg:mb-8 text-[16px] md:text-[18px] leading-relaxed">
                Discover practical scenarios where Agentic AI reshapes industries, accelerates decisions, and delivers results that once seemed impossible.
              </p>
              <div className="flex flex-col lg:flex-row items-start gap-4 mb-14 lg:mb-0">
                <BlackButton
                  size="medium"
                  variant="black"
                  className="text-lg font-medium font-manrope px-6 py-3 w-fit hover:scale-105 transition-transform duration-300 order-2 lg:order-1"
                  onClick={() => navigate("/usecase")}
                >
                  View More
                </BlackButton>
                {/* Mobile Tabs Slider */}
                <div className="w-full lg:hidden order-1 overflow-x-auto scrollbar-hide">
                  <div className="flex gap-2 scenario-tabs pb-2" style={{ minWidth: 'min-content' }}>
                    {categories.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setActive(c.key)}
                        className={
                          (active === c.key
                            ? "bg-black text-white"
                            : "bg-white text-black border border-black/10 hover:bg-black/5") +
                          " rounded-md px-4 py-2.5 whitespace-nowrap text-sm font-inter scenario-tab-button transition-all duration-300"
                        }
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4 lg:gap-6">
            {/* Desktop Tabs */}
            <div className="hidden lg:flex flex-wrap gap-4 scenario-tabs mb-4 lg:mb-6">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActive(c.key)}
                  className={
                    (active === c.key
                      ? "bg-black text-white"
                      : "bg-white text-black border border-black/10 hover:bg-black/5") +
                    " rounded-md px-4 py-2.5 lg:px-5 text-sm lg:text-base font-inter scenario-tab-button transition-all duration-300"
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Row 2: slider container (peek next slide) */}
            <div
              ref={viewportRef}
              className="relative w-full bg-transparent rounded-md h-[380px] md:h-[440px] lg:h-[480px] cursor-grab active:cursor-grabbing"
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
                  <div
                    key={cat.key}
                    className="h-full overflow-hidden group"
                    style={{ minWidth: `calc(100% - ${PEEK_PX}px)` }}
                  >
                    <div className="relative h-full w-full transition-transform duration-300 ease-out group-hover:-translate-y-2 rounded-md overflow-hidden">
                      <img
                        src={cat.images[0]}
                        alt={cat.label}
                        className="w-full h-full object-cover"
                        draggable="false"
                      />
                        <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: cat.gradient }}
                      />
                      <div className="absolute left-0 right-0 bottom-0 p-5 md:p-7">
                        <h4 className="font-manrope font-semibold text-[24px] md:text-[28px] text-white group-hover:text-black text-left transform transition-all duration-500 ease-out group-hover:-translate-y-2">
                          {cat.label}
                        </h4>
                        <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-75">
                          <p className="font-inter text-black/90 text-sm md:text-base mb-4">
                            {cat.description}
                          </p>
                   
                          <BlackButton
                            size="small"
                            variant="black"
                            className="px-4 py-2"
                            onClick={(e) => handleKnowMoreClick(e, cat.key)}
                            
                          
                          >
                            Know more
                          </BlackButton>
                        </div>
                      </div>
                    </div>
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