import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../common/Button2";
import Header from "../../common/Navbar";
import Footer from "../../common/Footer";
import { DraggableCardBody, DraggableCardContainer } from "../../ui/draggable-card";
import { WobbleCard } from "../../ui/wobble-card";
import { TestimonialTooltip } from "../../ui/testimonial-tooltip";
import Lottie from "lottie-react";
import purposefulGrowthUrl from "/images/icons/animated_json/Purposeful Growth.json?url";
import trustAtCoreUrl from "/images/icons/animated_json/Trust at the Core.json?url";
import futureFirstImpactUrl from "/images/icons/animated_json/Future-First Impact.json?url";
import leadershipBgImage from "/images/About-us-BG-leaders.png";

// Leadership team data
const leadershipTeam = [
  {
    id: 1,
    name: "Deiva Thiru Dr. S.N. Subbramanian",
    title: "Founder",
    image: "/images/leadership/About-us-chairman.png",
    company: "SNS Square"
  },
  {
    id: 2,
    name: "Dr. S. Rajalakshmi",
    title: "Co-Founder & CFO",
    image: "/images/leadership/About-us-correspondent.png",
    company: "SNS Square"
  },
  {
    id: 3,
    name: "Dr. Nalin",
    title: "Co-Founder & CEO",
    image: "/images/leadership/About-us-TD.png",
    company: "SNS Square"
  },
  {
    id: 4,
    name: "Jothi Mani",
    title: "Delivery Manager",
    image: "/images/leadership/About-us-jothi.png",
    company: "SNS"
  },
  {
    id: 5,
    name: "Gautham S",
    title: "CGC (Communication & Growth Center)",
    image: "/images/leadership/About-us-gowtham.png",
    company: "SNS"
  },
  {
    id: 6,
    name: "Raj Kanu",
    title: "Product Manager",
    image: "/images/leadership/about-us-raj.png",
    company: "SNS"
  }
];

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

// Life at SNS images for draggable cards
const lifeAtSnsImages = [
  {
    id: 1,
    title: "Office Collaboration",
    image: "/images/IMG_6488.png",
    className: "absolute top-10 left-1/2 -translate-x-[120%] sm:left-[20%] sm:translate-x-0 rotate-[-5deg]"
  },
  {
    id: 2,
    title: "Team Building",
    image: "/images/IMG_6534.png",
    className: "absolute top-32 left-1/2 -translate-x-[30%] sm:left-[55%] sm:translate-x-0 rotate-[10deg]"
  },
  {
    id: 3,
    title: "Growth Ecosystem",
    image: "/images/IMG_6676.png",
    className: "absolute top-24 left-1/2 -translate-x-1/2 sm:left-[45%] rotate-[-7deg]"
  },
];

// Careers data
const careers = [
  {
    id: 1,
    title: "Head of Digital Marketing",
    description: "Lead our digital marketing initiatives and drive growth through innovative strategies.",
    icon: "/images/icons/cube.png",
    responsibilities: [
      "Develop and execute digital marketing strategies",
      "Manage social media presence",
      "Analyze marketing metrics and ROI",
      "Lead marketing team"
    ]
  },
  {
    id: 2,
    title: "Business Development Manager",
    description: "Drive business growth through strategic partnerships and client relationships.",
    icon: "/images/icons/squares.png",
    responsibilities: [
      "Identify new business opportunities",
      "Build strategic partnerships",
      "Manage client relationships",
      "Develop growth strategies"
    ]
  }
];

const AboutUs = () => {
  const [animationData, setAnimationData] = useState({});
  const navigate = useNavigate();

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
    <div className="bg-white">
      {/* Hero Section */}
      <section 
        aria-labelledby="hero-heading" 
        className="relative bg-gradient-to-b from-[#EEF4FF] to-white w-full"
        style={{
          backgroundImage: `url('/images/HomeHero.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32 xl:py-40">
          <header className="text-center">
            <h1
              id="hero-heading"
              className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] xl:text-7xl font-sora font-semibold leading-tight sm:leading-snug md:leading-tight lg:leading-snug text-center text-global-1 w-full mt-12 sm:mt-16 md:mt-20"
            >
              About <span className="text-[#1E63FF]">SNS Square</span>
            </h1>
          </header>

          <p className="mx-auto mt-6 sm:mt-8 lg:mt-10 max-w-5xl text-pretty text-center font-sans text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-black/90 font-medium">
            We are a team of passionate individuals dedicated to creating innovative AI solutions that drive growth and efficiency across industries.
          </p>

        </div>
      </section>

      {/* Values Section */}
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
      
      {/* Mission & Vision Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-manrope font-bold text-global-1 mb-8">
                Our Mission
              </h2>
              <p className="text-lg sm:text-xl font-inter text-gray-700 leading-relaxed mb-8">
                To empower businesses with cutting-edge AI solutions that drive growth and efficiency. 
                We strive to be a leader in the AI industry, delivering exceptional value to our clients 
                and fostering a culture of innovation and collaboration.
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-manrope font-bold text-global-1 mb-6">
                Our Vision
              </h3>
              <p className="text-lg sm:text-xl font-inter text-gray-700 leading-relaxed">
                To redefine the future through world-class agentic AI, creating adaptive solutions 
                that drive growth and innovation across industries.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="/images/innovation-concept.jpg"
                alt="Innovation concept"
                className="w-full max-w-md lg:max-w-lg h-auto object-cover rounded-[32px] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${leadershipBgImage})` }}
        />
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* First Row - 30/70 Split */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 mb-12 md:mb-16 text-center lg:text-left">
            {/* Left Column - 30% - Title */}
            <div className="lg:col-span-3 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl font-manrope font-bold text-global-1 mb-4">
                <span className="text-[#1E63FF]">Meet Our</span> Leadership team
              </h2>
            </div>

            {/* Right Column - 70% - Main Leadership */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Dr. S.N. Subbramanian */}
              <div className="rounded-2xl text-center md:text-left">
                <div className="w-full max-w-[280px] sm:max-w-xs mx-auto mb-6 overflow-hidden">
                  <img
                    src={leadershipTeam[0].image}
                    alt={leadershipTeam[0].name}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-manrope font-semibold text-global-1 mb-2">
                  {leadershipTeam[0].name}
                </h3>
                <div className="w-32 h-1 bg-[#1357E5] mb-2 rounded-full mx-auto md:mx-0"></div>
                <p className="text-sm font-inter text-gray-600 mb-1">
                  {leadershipTeam[0].title}
                </p>
                <p className="text-sm font-inter text-blue-600 font-medium">
                  {leadershipTeam[0].company}
                </p>
              </div>

              {/* Dr. S. Rajalakshmi */}
              <div className="rounded-2xl text-center md:text-left">
                <div className="w-full max-w-[280px] sm:max-w-xs mx-auto mb-6 overflow-hidden">
                  <img
                    src={leadershipTeam[1].image}
                    alt={leadershipTeam[1].name}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-manrope font-semibold text-global-1 mb-2">
                  {leadershipTeam[1].name}
                </h3>
                <div className="w-32 h-1 bg-[#1357E5] mb-2 rounded-full mx-auto md:mx-0"></div>
                <p className="text-sm font-inter text-gray-600 mb-1">
                  {leadershipTeam[1].title}
                </p>
                <p className="text-sm font-inter text-blue-600 font-medium">
                  {leadershipTeam[1].company}
                </p>
              </div>

              {/* Nalin SNS */}
              <div className="rounded-2xl text-center md:text-left">
                <div className="w-full max-w-[280px] sm:max-w-xs mx-auto mb-6 overflow-hidden">
                  <img
                    src={leadershipTeam[2].image}
                    alt={leadershipTeam[2].name}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-manrope font-semibold text-global-1 mb-2">
                  {leadershipTeam[2].name}
                </h3>
                <div className="w-32 h-1 bg-[#1357E5] mb-2 rounded-full mx-auto md:mx-0"></div>
                <p className="text-sm font-inter text-gray-600 mb-1">
                  {leadershipTeam[2].title}
                </p>
                <p className="text-sm font-inter text-blue-600 font-medium">
                  {leadershipTeam[2].company}
                </p>
              </div>
            </div>
          </div>

          {/* Second Row - Other Team Members with Tooltip */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <TestimonialTooltip people={leadershipTeam.slice(3)} />
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:text-left mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-manrope font-bold text-global-1 mb-6">
              <span className="text-[#1E63FF]">Careers @</span> <br /> SNS Square
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {careers.map((career) => (
              <div
                key={career.id}
                className="bg-[#E6EDFC] rounded-2xl lg:rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                  <img
                    src={career.icon}
                    alt={career.title}
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-manrope font-bold text-global-1 mb-4">
                  {career.title}
                </h3>
                <div className="w-full h-px bg-gray-300 mb-3"></div>
                <p className="text-base sm:text-lg font-inter text-gray-700 leading-relaxed mb-6">
                  {career.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {career.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-[#525252] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm sm:text-base font-inter text-gray-700">
                        {responsibility}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="primary"
                  size="medium"
                  className="rounded-xl px-6 py-3 text-base text-white font-semibold w-full sm:w-auto bg-[#1E63FF] hover:bg-[#1357E5]"
                >
                  Apply Now
                </Button>
              </div>
            ))}
          </div>

          {/* Life at SNS - Draggable Cards */}
          <div className="relative -mb-32 pb-32 overflow-visible" style={{ clipPath: 'inset(0 0 32px 0)' }}>
            <DraggableCardContainer className="relative flex min-h-[280px] w-full items-center justify-center overflow-visible">
              <p 
                className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800 z-0 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => {navigate("/life-at-sns"); window.scrollTo(0, 0);}}
              >
                Life at SNS Square
              </p>
              {lifeAtSnsImages.map((item) => (
                <DraggableCardBody key={item.id} className={item.className}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="pointer-events-none relative z-10 h-80 w-80 object-cover rounded-lg bg-white"
                  />
                </DraggableCardBody>
              ))}
            </DraggableCardContainer>
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
};

export default AboutUs;
