import React from "react";
import { TestimonialTooltip } from "../../ui/testimonial-tooltip";
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

const LeadershipSection = () => {
  return (
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
  );
};

export default LeadershipSection;
