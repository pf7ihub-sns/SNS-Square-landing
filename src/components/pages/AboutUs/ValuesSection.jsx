import React, { useState, useEffect } from "react";
import { WobbleCard } from "../../ui/wobble-card";
import Lottie from "lottie-react";
import purposefulGrowthUrl from "/images/icons/animated_json/Purposeful Growth.json?url";
import trustAtCoreUrl from "/images/icons/animated_json/Trust at the Core.json?url";
import futureFirstImpactUrl from "/images/icons/animated_json/Future-First Impact.json?url";

// Values data
const values = [
  {
    id: 1,
    title: "Purposeful Growth",
    description: "Driving meaningful progress with responsibility, impact, and care.",
    icon: "/images/icons/triangle.png",
    animationUrl: purposefulGrowthUrl
  },
  {
    id: 2,
    title: "Trust at the Core",
    description: "Ethical, transparent, and reliable AI you can believe in.",
    icon: "/images/icons/triangles_1.png",
    animationUrl: trustAtCoreUrl
  },
  {
    id: 3,
    title: "Future-First Impact",
    description: "Every solution is designed to shape tomorrow, today.",
    icon: "/images/icons/squares.png",
    animationUrl: futureFirstImpactUrl
  }
];

const ValuesSection = () => {
  const [animationData, setAnimationData] = useState({});

  useEffect(() => {
    // Load all animation data
    const loadAnimations = async () => {
      try {
        const [purposefulGrowth, trustAtCore, futureFirstImpact] = await Promise.all([
          fetch(purposefulGrowthUrl).then(res => res.json()),
          fetch(trustAtCoreUrl).then(res => res.json()),
          fetch(futureFirstImpactUrl).then(res => res.json())
        ]);

        setAnimationData({
          'Purposeful Growth': purposefulGrowth,
          'Trust at the Core': trustAtCore,
          'Future-First Impact': futureFirstImpact
        });
      } catch (error) {
        console.error('Error loading animations:', error);
      }
    };

    loadAnimations();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-16 items-start">
          {/* Left Column - Text Content (30%) */}
          <div className="lg:col-span-3 flex flex-col justify-center text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-manrope font-bold text-global-1 mb-4">
              <span className="text-[#1E63FF]">Our</span> Values
            </h2>
            <p className="text-base sm:text-lg font-inter text-gray-700 leading-relaxed">
              The core of everything we do is guided by values that drive impact.
            </p>
          </div>

          {/* Right Column - Wobble Cards (70%) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Row - Two Cards */}
            <WobbleCard containerClassName="col-span-1 min-h-[250px] sm:min-h-[200px] bg-[#DCE7FD]">
              <div className="flex flex-col h-full p-4">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  {animationData[values[0].title] && (
                    <Lottie
                      animationData={animationData[values[0].title]}
                      loop={true}
                      autoplay={true}
                      style={{ width: 100, height: 100 }}
                    />
                  )}
                </div>
                <h3 className="text-lg font-manrope font-semibold text-global-1 mb-3">
                  {values[0].title}
                </h3>
                <div className="w-full h-px bg-gray-300 mb-3"></div>
                <p className="text-sm font-inter text-gray-700 leading-relaxed">
                  {values[0].description}
                </p>
              </div>
            </WobbleCard>

            <WobbleCard containerClassName="col-span-1 min-h-[250px] sm:min-h-[200px] bg-[#DCE7FD]">
              <div className="flex flex-col h-full p-4">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  {animationData[values[1].title] && (
                    <Lottie
                      animationData={animationData[values[1].title]}
                      loop={true}
                      autoplay={true}
                      style={{ width: 100, height: 100 }}
                    />
                  )}
                </div>
                <h3 className="text-lg font-manrope font-semibold text-global-1 mb-3">
                  {values[1].title}
                </h3>
                <div className="w-full h-px bg-gray-300 mb-3"></div>
                <p className="text-sm font-inter text-gray-700 leading-relaxed">
                  {values[1].description}
                </p>
              </div>
            </WobbleCard>

            {/* Second Row - One Wide Card */}
            <WobbleCard containerClassName="md:col-span-2 min-h-[200px] bg-[#DCE7FD]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 mb-4 sm:mb-0">
                  {animationData[values[2].title] && (
                    <Lottie
                      animationData={animationData[values[2].title]}
                      loop={true}
                      autoplay={true}
                      style={{ width: 100, height: 100 }}
                    />
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                  <h3 className="text-lg font-manrope font-semibold text-global-1 flex-shrink-0">
                    {values[2].title}
                  </h3>
                  <div className="w-full sm:w-px h-px sm:h-8 bg-gray-300 flex-shrink-0"></div>
                  <p className="text-sm font-inter text-gray-700 leading-relaxed">
                    {values[2].description}
                  </p>
                </div>
              </div>
            </WobbleCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
