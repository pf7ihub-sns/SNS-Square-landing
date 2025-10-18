import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/gcc-page.css';

gsap.registerPlugin(ScrollTrigger);

const GCCPage = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const buildingRef = useRef(null);
  const gccHeaderRef = useRef(null);
  const pillarTextsRef = useRef(null);
  const backgroundRef = useRef(null);
  const [hoveredPillar, setHoveredPillar] = useState(null);

  useEffect(() => {
    // compute target scale dynamically so the building can fill the viewport
    const computeTargetScale = () => {
      const el = buildingRef.current;
      if (!el) return 1.25; // fallback
      const rect = el.getBoundingClientRect();
      const scaleX = window.innerWidth / rect.width;
      const scaleY = window.innerHeight / rect.height;

      // Measure header height (fixed header) so we don't scale past it
      const headerEl = document.querySelector('header');
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
      const safeMargin = 24; // gap to keep below the header

      // pick the larger scale so the building covers most of the viewport
      const raw = Math.max(scaleX, scaleY) * 0.92;

      // maximum scale allowed so the building's height fits below the header
      const maxScaleByHeader = (window.innerHeight - headerHeight - safeMargin) / rect.height;

      // choose the smallest of raw, header limit and absolute cap
      let final = Math.min(raw, maxScaleByHeader || raw, 3);
      if (!isFinite(final) || final <= 0) final = Math.min(raw, 3);
      return final;
    };

    let targetScale = computeTargetScale();

    const onResize = () => {
      targetScale = computeTargetScale();
    };
    window.addEventListener('resize', onResize);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=1500',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    // Animate content moving up and fading out
    tl.to(contentRef.current, {
      y: -200,
      opacity: 0,
      duration: 1,
    }, 0);

    // Change background from blue gradient to black
    tl.to(backgroundRef.current, {
      opacity: 0,
      duration: 1,
    }, 0);

    // Building grows bigger and becomes more prominent during scroll
    tl.to(buildingRef.current, {
      transformOrigin: '50% 50%',
      opacity: 0.98,
      scale: () => targetScale,
      y: -30,
      duration: 1,
      ease: 'power1.out'
    }, 0);

    // GCC header and badge fade in
    tl.fromTo(gccHeaderRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 },
      0.5
    );

    // Pillar texts fade in
    tl.fromTo(pillarTextsRef.current,
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: 1,
        onStart: () => {
          if (pillarTextsRef.current) {
            pillarTextsRef.current.style.pointerEvents = 'auto';
          }
        },
        onReverseComplete: () => {
          if (pillarTextsRef.current) {
            pillarTextsRef.current.style.pointerEvents = 'none';
          }
        }
      },
      0.7
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const pillarCards = {
    build: {
      title: 'Build',
      description: 'Establish robust GCC infrastructure with cutting-edge data architecture and AI capabilities',
      color: '#FFD700',
      bgColor: '#FFF9E6',
    },
    operate: {
      title: 'Operate',
      description: 'Streamline operations with intelligent automation and real-time monitoring systems',
      color: '#DC143C',
      bgColor: '#FFE6E6',
    },
    transfer: {
      title: 'Transfer',
      description: 'Seamlessly migrate and integrate data across platforms with zero downtime',
      color: '#2E8B57',
      bgColor: '#E6F7EF',
    }
  };

  return (
    <div className="relative gcc-page">
      {/* Fixed Header - Always visible */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4">
        <Link to="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200">
          <img
            src="/images/square_logo.png"
            alt="SNS Square Logo"
            className="w-[140px] h-auto"
          />
        </Link>

        <div className="flex items-center">
          <img
            src="/images/gcc logo.png"
            alt="GCC Logo"
            className="h-12 w-auto"
          />
        </div>
      </header>

      {/* Main Container - Pinned during transition */}
      <div ref={containerRef} className="relative min-h-screen w-full">
        <div className="absolute inset-0 w-full h-screen">
          {/* Background Layers */}
          <div className="absolute inset-0 z-0" style={{ background: '#000222' }} />
          
          {/* Blue gradient background - will fade out */}
          <div ref={backgroundRef} className="absolute inset-0 z-[1]">
            <div className="absolute inset-0 bg-gcc-texture" />
            <div className="absolute inset-0 bg-gcc-gradient" />

            {/* Soft Sunlight Stripes */}
            <div 
              className="absolute"
              style={{
                width: '400px',
                height: '1400px',
                top: '-250px',
                left: '280px',
                transform: 'rotate(0.86deg)',
                background: 'radial-gradient(ellipse 200px 700px at center, rgba(35, 136, 255, 0.15) 0%, rgba(35, 136, 255, 0.08) 40%, rgba(35, 136, 255, 0) 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none'
              }}
            />
            <div 
              className="absolute"
              style={{
                width: '400px',
                height: '1400px',
                top: '-250px',
                right: '280px',
                transform: 'rotate(-0.86deg)',
                background: 'radial-gradient(ellipse 200px 700px at center, rgba(35, 136, 255, 0.15) 0%, rgba(35, 136, 255, 0.08) 40%, rgba(35, 136, 255, 0) 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* Building - Single building throughout */}
          <div 
            ref={buildingRef}
            className="absolute z-[2]"
            style={{
              width: '650px',
              height: '450px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              marginTop: '50px',
              opacity: 0.4,
              pointerEvents: 'none'
            }}
          >
            <img src="/images/gcc.png" alt="GCC Building" className="w-full h-full object-contain" />
          </div>

          {/* Initial Content - Will move up and fade out */}
          <div ref={contentRef} className="absolute inset-0 z-[3] flex flex-col items-center pt-20">
            <div className="text-center flex flex-col items-center" style={{ maxWidth: '1323px' }}>
              {/* Content at top of building */}
              <div className="flex flex-col items-center gap-4 px-8 mb-8">
                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-wider gcc-text-glow whitespace-nowrap">
                  SNS Square
                </h1>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-wide gcc-specialist-gradient whitespace-nowrap">
                  GCC Build and Operation Specialist
                </h2>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed whitespace-nowrap">
                  Harness the combined power of integrated data and Agentic AI to build a intelligent, future-proof operational hub.
                </p>
              </div>

              {/* Spacer to position buttons below GCC text on building */}
              <div style={{ height: '280px' }}></div>

              {/* Buttons positioned below the GCC text */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-8">
                <Link
                  to="/get-started"
                  className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-200 gcc-button"
                >
                  Get Started
                </Link>
                <Link
                  to="/contact-us"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-200 gcc-button"
                >
                  Contact US
                </Link>
              </div>
            </div>
          </div>

          {/* GCC Header and Pillar Texts - Will fade in */}
          <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center">
            <div className="relative w-full max-w-7xl mx-auto px-8">
              {/* DATA + AGENTIC AI HUB text - Positioned below GCC on building (no container) */}
              <div ref={gccHeaderRef} className="text-center mb-12" style={{ opacity: 0, marginTop: '20px' }}>
                <p 
                  className="text-lg font-semibold text-white tracking-widest"
                  style={{ 
                    letterSpacing: '0.25em',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  DATA + AGENTIC AI HUB
                </p>
              </div>

              {/* Pillar Texts - Fade in and become interactive */}
              <div 
                ref={pillarTextsRef}
                className="relative flex items-center justify-center"
                style={{ opacity: 0, pointerEvents: 'none', marginTop: '80px' }}
              >
                {/* Positioning container for texts over building */}
                <div className="flex items-end justify-between" style={{ width: '650px', height: '300px', paddingBottom: '80px' }}>
                  {/* Build Text - Left Pillar */}
                  <div 
                    className="relative cursor-pointer transition-all duration-300 hover:scale-110"
                    onMouseEnter={() => setHoveredPillar('build')}
                    onMouseLeave={() => setHoveredPillar(null)}
                    style={{ height: '250px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
                  >
                    <span 
                      className="text-white font-bold text-2xl"
                      style={{ 
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)',
                        letterSpacing: '0.2em',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.5))'
                      }}
                    >
                      Build
                    </span>

                    {/* Hover Card - Left Side */}
                    {hoveredPillar === 'build' && (
                      <div 
                        className="absolute top-1/2 right-full mr-12 transform -translate-y-1/2 transition-all duration-300 z-50"
                        style={{ minWidth: '350px', maxWidth: '400px' }}
                      >
                        <div 
                          className="p-8 rounded-2xl shadow-2xl"
                          style={{
                            background: pillarCards.build.bgColor,
                            border: `3px solid ${pillarCards.build.color}`,
                            boxShadow: `0 0 40px ${pillarCards.build.color}60`
                          }}
                        >
                          <h3 className="text-3xl font-bold mb-4" style={{ color: pillarCards.build.color }}>
                            {pillarCards.build.title}
                          </h3>
                          <p className="text-lg text-gray-800 leading-relaxed">
                            {pillarCards.build.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Operate Text - Middle Pillar */}
                  <div 
                    className="relative cursor-pointer transition-all duration-300 hover:scale-110"
                    onMouseEnter={() => setHoveredPillar('operate')}
                    onMouseLeave={() => setHoveredPillar(null)}
                    style={{ height: '250px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
                  >
                    <span 
                      className="text-white font-bold text-2xl"
                      style={{ 
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)',
                        letterSpacing: '0.3em',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        filter: 'drop-shadow(0 0 8px rgba(220,20,60,0.5))'
                      }}
                    >
                      Operate
                    </span>

                    {/* Hover Card - Right Side */}
                    {hoveredPillar === 'operate' && (
                      <div 
                        className="absolute top-1/2 left-full ml-12 transform -translate-y-1/2 transition-all duration-300 z-50"
                        style={{ minWidth: '350px', maxWidth: '400px' }}
                      >
                        <div 
                          className="p-8 rounded-2xl shadow-2xl"
                          style={{
                            background: pillarCards.operate.bgColor,
                            border: `3px solid ${pillarCards.operate.color}`,
                            boxShadow: `0 0 40px ${pillarCards.operate.color}60`
                          }}
                        >
                          <h3 className="text-3xl font-bold mb-4" style={{ color: pillarCards.operate.color }}>
                            {pillarCards.operate.title}
                          </h3>
                          <p className="text-lg text-gray-800 leading-relaxed">
                            {pillarCards.operate.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Transfer Text - Right Pillar */}
                  <div 
                    className="relative cursor-pointer transition-all duration-300 hover:scale-110"
                    onMouseEnter={() => setHoveredPillar('transfer')}
                    onMouseLeave={() => setHoveredPillar(null)}
                    style={{ height: '250px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
                  >
                    <span 
                      className="text-white font-bold text-2xl"
                      style={{ 
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)',
                        letterSpacing: '0.2em',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        filter: 'drop-shadow(0 0 8px rgba(46,139,87,0.5))'
                      }}
                    >
                      Transfer
                    </span>

                    {/* Hover Card - Right Side */}
                    {hoveredPillar === 'transfer' && (
                      <div 
                        className="absolute top-1/2 left-full ml-12 transform -translate-y-1/2 transition-all duration-300 z-50"
                        style={{ minWidth: '350px', maxWidth: '400px' }}
                      >
                        <div 
                          className="p-8 rounded-2xl shadow-2xl"
                          style={{
                            background: pillarCards.transfer.bgColor,
                            border: `3px solid ${pillarCards.transfer.color}`,
                            boxShadow: `0 0 40px ${pillarCards.transfer.color}60`
                          }}
                        >
                          <h3 className="text-3xl font-bold mb-4" style={{ color: pillarCards.transfer.color }}>
                            {pillarCards.transfer.title}
                          </h3>
                          <p className="text-lg text-gray-800 leading-relaxed">
                            {pillarCards.transfer.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


  {/* spacer removed to avoid blank white area on scroll */}
         {/* spacer removed to avoid blank white area on scroll */}
      <section className="relative z-10" style={{ background: '#061642' }}>
        {/* Stats and Partners Section - New blue gradient background */}
        <div className="relative pt-20 pb-16" style={{ background: 'linear-gradient(180deg, #061642 0%, #0D2978 100%)' }}>
          <div className="max-w-7xl mx-auto px-8">
            {/* Partner Logos - Two Rows - BIGGER SIZE */}
            <div className="mb-20">
              {/* First Row - 5 logos */}
              <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 mb-12">
                <div className="transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-85">
                  <img src="/images/aws.png" alt="AWS" className="h-14 md:h-16 w-auto object-contain" />
                </div>
                <div className="transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-85">
                  <img src="/images/home/company logos/Snowflake.png" alt="Snowflake" className="h-14 md:h-14 w-auto object-contain" />
                </div>
                <div className="transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-85">
                  <img src="/images/home/company logos/SalesForce.png" alt="Salesforce" className="h-14 md:h-16 w-auto object-contain" />
                </div>
                <div className="transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-85">
                  <img src="/images/home/company logos/Databricks.png" alt="Databricks" className="h-14 md:h-14 w-auto object-contain" />
                </div>
                <div className="transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-85">
                  <img src="/images/home/company logos/AZURE.png" alt="Azure" className="h-14 md:h-16 w-auto object-contain" />
                </div>
              </div>

              {/* Second Row - 4 logos */}
              <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
                <div className="transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-85">
                  <img src="/images/gcloud.png" alt="Google Cloud" className="h-16 md:h-25 w-auto object-contain" />
                </div>
                <div className="transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-85">
                  <img src="/images/nvidia.png" alt="NVIDIA" className="h-14 md:h-25 w-auto object-contain" />
                </div>
                <div className="transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-85">
                  <img src="/images/bigquery.png" alt="BigQuery" className="h-14 md:h-25 w-auto object-contain" />
                </div>
                <div className="transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-85">
                  <img src="/images/servicenow.png" alt="ServiceNow" className="h-14 md:h-20 w-auto object-contain" />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
              {/* Databricks Card */}
              <div className="flex items-center gap-6 bg-blue-900/40 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 md:p-8 hover:bg-blue-900/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                <div className="flex-shrink-0">
                  <img src="/images/home/company logos/Databricks.png" alt="Databricks" className="h-12 w-auto object-contain" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-0">150+</div>
                  <div className="text-xs text-white/90 leading-tight">Certified AI Associates</div>
                </div>
              </div>

              {/* Foundational Agents Card */}
              <div className="flex items-center gap-6 bg-blue-900/40 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 md:p-8 hover:bg-blue-900/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                <div className="flex-shrink-0">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="14" y="14" width="12" height="12" rx="2" fill="#FBBF24"/>
                    <rect x="30" y="14" width="12" height="12" rx="2" fill="#FBBF24"/>
                    <rect x="14" y="30" width="12" height="12" rx="2" fill="#FBBF24"/>
                    <rect x="30" y="30" width="12" height="12" rx="2" fill="#FBBF24"/>
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-0">1500+</div>
                  <div className="text-xs text-white/90 leading-tight">Foundational Agents, Industry<br />Specific Agents & Solutions</div>
                </div>
              </div>
            </div>

            {/* Soft Light Blue Glow - No visible triangle, just merged light */}
            <div 
              className="absolute"
              style={{
                width: '2000px',
                height: '1000px',
                bottom: '-300px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'radial-gradient(ellipse 800px 600px at 50% 0%, rgba(96, 165, 250, 0.25) 0%, rgba(59, 130, 246, 0.15) 20%, rgba(37, 99, 235, 0.08) 40%, rgba(29, 78, 216, 0) 70%)',
                pointerEvents: 'none',
                zIndex: 1,
                filter: 'blur(150px)',
                opacity: 0.6
              }}
            />
          </div>
        </div>

        {/* Single Smooth Curve Divider */}
        <div className="relative" style={{ height: '120px', marginTop: '-1px' }}>
          <svg 
            viewBox="0 0 1440 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full absolute top-0"
            preserveAspectRatio="none"
          >
            {/* Smooth curve transition */}
            <path 
              d="M0,0 L0,40 Q360,100 720,40 T1440,40 L1440,0 Z" 
              fill="url(#blueGradient)"
            />
            <path 
              d="M0,40 Q360,100 720,40 T1440,40 L1440,120 L0,120 Z" 
              fill="#000000"
            />
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D2978" />
                <stop offset="100%" stopColor="rgba(0, 9, 50, 0.5)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Additional bottom center glow for smooth transition */}
          <div 
            className="absolute"
            style={{
              width: '1200px',
              height: '500px',
              bottom: '0px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'radial-gradient(ellipse at center top, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 30%, rgba(29, 78, 216, 0) 60%)',
              opacity: 0.4,
              pointerEvents: 'none',
              zIndex: 2,
              filter: 'blur(140px)'
            }}
          />
        </div>

        {/* Second Part - Pure Black Background */}
        <div 
          className="relative pt-24 pb-20"
          style={{ 
            background: '#000000'
          }}
        >
          <div className="max-w-7xl mx-auto px-8 relative">
            {/* Main CTA Section */}
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Let's Build Your Future-Ready GCC
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Partner with us to create your Data + Agentic AI-powered operational hub
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/get-started"
                  className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-200"
                >
                  Get Started
                </Link>
                <Link
                  to="/contact-us"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#000222] transition-colors duration-200"
                >
                  Contact US
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 bg-[#020526] pt-16 pb-12">
        <div className="max-w-[1216px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-35 pb-12">
            <div className="col-span-1 flex flex-col gap-4">
              <img src="/images/square_logo.png" alt="SNS Square Logo" className="w-[140px] h-auto" />
            </div>

            <div>
              <h3 className="text-[#8098F9] font-medium text-[15.63px] leading-6 tracking-[-0.06px] mb-4">Solutions</h3>
              <ul className="space-y-2 text-white/70 text-[13px]">
                <li className="hover:text-white transition-colors cursor-pointer">Smart City & Manufacturing</li>
                <li className="hover:text-white transition-colors cursor-pointer">Healthcare</li>
                <li className="hover:text-white transition-colors cursor-pointer">Agriculture & Food</li>
                <li className="hover:text-white transition-colors cursor-pointer">Retail/FMCG</li>
                <li className="hover:text-white transition-colors cursor-pointer">Automotive & Aerospace</li>
                <li className="hover:text-white transition-colors cursor-pointer">Defence, Government, Legal</li>
                <li className="hover:text-white transition-colors cursor-pointer">Real Estate</li>
                <li className="hover:text-white transition-colors cursor-pointer">Sports, Media & Entertainment</li>
                <li className="hover:text-white transition-colors cursor-pointer">BFSI - Fintech/Banking</li>
                <li className="hover:text-white transition-colors cursor-pointer">Power, Oil, Energy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Personal Services</li>
              </ul>
            </div>

            <div>
              <h3 className="text-[#8098F9] font-medium text-[15.63px] leading-6 tracking-[-0.06px] mb-4">Use Cases</h3>
              <ul className="space-y-2 text-white/70 text-[13px]">
                <li className="hover:text-white transition-colors cursor-pointer">Supply Chain</li>
                <li className="hover:text-white transition-colors cursor-pointer">Human Resource</li>
                <li className="hover:text-white transition-colors cursor-pointer">IT Solution</li>
                <li className="hover:text-white transition-colors cursor-pointer">Insurance</li>
                <li className="hover:text-white transition-colors cursor-pointer">Health Care</li>
              </ul>
            </div>

            <div>
              <h3 className="text-[#8098F9] font-medium text-[15.63px] leading-6 tracking-[-0.06px] mb-4">Company</h3>
              <ul className="space-y-2 text-white/70 text-[13px] mb-6">
                <li className="hover:text-white transition-colors cursor-pointer">Solutions</li>
                <li className="hover:text-white transition-colors cursor-pointer">Use Case</li>
                <li className="hover:text-white transition-colors cursor-pointer">Life at SNS Square</li>
                <li className="hover:text-white transition-colors cursor-pointer">Resources</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact us</li>
              </ul>
              
              <div className="mt-6">
                <h3 className="text-[#8098F9] font-medium text-[15.63px] leading-6 tracking-[-0.06px] mb-4">Address</h3>
                <p className="text-white/70 text-[13px] leading-relaxed mb-3">
                  BLOCK-N, Embassy Tech Village, Outer Ring Rd, Devarabisanahalli, Bellandur, Bengaluru, Karnataka 560103
                </p>
                <p className="text-[#8098F9] font-medium text-[13px] mb-1">Email</p>
                <p className="text-[#8098F9] font-medium text-[13px] hover:text-[#9fbff5] transition-colors cursor-pointer">
                  info@snssquare.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="relative z-20 w-full bg-white border-t border-gray-200">
        <div className="max-w-[1216px] mx-auto px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <span className="text-[12px] text-[#020526]">© {new Date().getFullYear()} SNS Square. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/company/snssquare" target="_blank" rel="noopener noreferrer" className="text-[#020526] hover:text-[#0077b5] transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@snssquare" target="_blank" rel="noopener noreferrer" className="text-[#020526] hover:text-[#FF0000] transition-colors" aria-label="YouTube">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCCPage;