import React, { useState } from 'react';

const TABS = [
  { 
    key: 'marketplace', 
    label: 'Agentic AI Marketplace', 
    desc: 'We offer 1,500+ pre-built foundation agents forming 250+ industry and 12+ customer solutions designed to solve real-world problems with speed and scale.', 
    icon: '/images/home/iconsCore/6.png',
    image: '/images/home/coreservice/agentic_marketplace.png', // Add your specific image for marketplace
  },
  { 
    key: 'digital', 
    label: 'Digital Transformation', 
    desc: 'We help businesses leverage digital technologies to innovate, streamline workflows, and unlock new opportunities for growth.', 
    icon: '/images/home/iconsCore/7.png',
    image: '/images/home/coreservice/transformation.png', // Add your specific image for digital transformation
  },
  { 
    key: 'data', 
    label: 'AI & Data Solutions', 
    desc: 'Our team provides advanced AI and data-driven strategies along with practical implementations that accelerate decision-making and create measurable impact.', 
    icon: '/images/home/iconsCore/5.png',
    image: '/images/home/coreservice/AI & Data Solutions.png', // Add your specific image for AI & data

  },
  { 
    key: 'platform', 
    label: 'Enterprise Platform Services', 
    desc: 'We deliver scalable platform solutions customized for enterprise needs, ensuring flexibility, reliability, and long-term sustainability.', 
    icon: '/images/home/iconsCore/8.png',
    image: '/images/home/coreservice/platformsrvc.png', // Add your specific image for platform services
  },
  { 
    key: 'custom', 
    label: 'Custom Development', 
    desc: 'Our experts design and build tailored software and solutions that meet specific client requirements, ensuring business goals are achieved with precision.', 
    icon: '/images/home/iconsCore/9.png',
    image: '/images/home/coreservice/custom_dev.png', // Add your specific image for custom development
  },
];

const CoreServiceSection = () => {
  const [active, setActive] = useState(TABS[0]);

  return (
    <div className="px-4 xs:px-5 sm:px-6 lg:px-8 py-6 md:py-10 lg:py-14">
      <div className="max-w-[1480px] mx-auto">
        {/* Row 1: heading + paragraph */}
        <div className="mb-4 md:mb-6 lg:mb-8">
          <h3 className="font-manrope font-bold text-[24px] md:text-[30px] lg:text-[36px] leading-tight text-black">
            Our Core Service
          </h3>
          <p className="font-inter text-black/70 mt-2 md:mt-3 text-[15px] md:text-base">
            Pre-built AI agents designed with advanced capabilities to serve
          </p>
        </div>

        {/* Row 2: two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-4 md:gap-6 lg:gap-10 items-start">
          {/* Left column: 5 rows (H6) */}
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible -mx-4 px-4 lg:mx-0 lg:px-0 gap-3 lg:gap-4 pb-4 lg:pb-0">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t)}
                className={
                  (active.key === t.key
                    ? 'bg-[#1357E5] text-white'
                    : 'bg-[#F8F8F8] text-black hover:bg-[#F0F0F0]') +
                  ' flex-shrink-0 lg:flex-shrink text-left rounded-[4px] px-4 py-3 md:py-4 lg:py-6 transition-colors flex items-center gap-3 lg:gap-4 w-auto lg:w-full'
                }
              >
                <img src={t.icon} alt={t.label} className="w-5 h-5 md:w-6 md:h-6" />
                <h6 className="font-manrope font-medium text-[13px] sm:text-[14px] md:text-[16px] lg:text-[18px] whitespace-nowrap lg:whitespace-normal">
                  {t.label}
                </h6>
              </button>
            ))}
          </div>

          {/* Right column: background image card with title + description */}
          <div className="relative rounded-[6px] overflow-hidden min-h-[180px] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[300px] group">
            <div className="relative h-full w-full transition-transform duration-300 ease-out group-hover:-translate-y-2">
              <img
                src={active.image}
                alt={active.label}
                className="w-full h-full object-cover"
              />
              {/* bottom banner */}
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h4 className="font-manrope font-semibold text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] leading-tight sm:leading-snug text-white group-hover:text-white transform transition-all duration-500 ease-out group-hover:-translate-y-1 md:group-hover:-translate-y-2">
                  {active.label}
                </h4>
                <div className="translate-y-2 md:translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-75">
                  <p className="font-inter text-[12px] sm:text-sm md:text-base text-white/90 mt-1.5 sm:mt-2 md:mt-3 line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
                    {active.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreServiceSection;
