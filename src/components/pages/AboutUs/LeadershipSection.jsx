import React, { useState, useEffect } from "react";
import { CometCard } from "../../ui/comet-card";

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
    name: "Nalin SNS",
    title: "Co-Founder & CEO",
    image: "/images/leadership/About-us-TD.png",
    company: "SNS Square"
  }
];

const LeadershipAndCertificate = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile Layout
  const MobileLayout = () => (
    <div className="w-full min-h-screen relative overflow-hidden">
      
      {/* Mobile Grid Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-50"
        style={{
          backgroundImage: "url('/images/backgroundgrids/wholebg.svg')",
          backgroundSize: 'cover'
        }}
      />

      {/* Mobile Leadership Section */}
      <div className="relative z-10 w-full mx-auto py-12">
        
        {/* Mobile Leadership Header */}
        <div className="px-4 mb-8">
          <h2 className="text-neutral-800 text-center">
            Meet Our<br />
            Leadership Team
          </h2>
        </div>

        {/* Mobile Leadership Cards */}
        <div className="px-4 mb-12">
          <div className="flex flex-col gap-6">
            {leadershipTeam.map((member) => (
              <div key={member.id} className="w-full flex flex-col items-center gap-4">
                
                {/* Mobile Member Image */}
                <div className="w-48 h-48 relative rounded-full overflow-hidden shadow-lg">
                  <img 
                    className="w-full h-full object-cover" 
                    src={member.image} 
                    alt={member.name}
                  />
                </div>

                {/* Mobile Member Info */}
                <div className="w-full flex flex-col items-center gap-2 text-center">
                  <h4 className="text-black">
                    {member.name}
                  </h4>
                  <h6 className="text-black">
                    {member.title}
                  </h6>
                  <div className="w-24 h-1 bg-blue-700 rounded-full" />
                  <p className="text-black font-inter">
                    {member.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Certificate Section */}
      <div className="relative z-10 w-full px-4 pb-12">
        
        {/* Mobile Certificate Container */}
        <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          
          {/* Mobile Certificate Header */}
          <div className="text-center mb-6">
            <h2 className="text-neutral-800 mb-4">
              Our Awards & Achievements
            </h2>
            <div className="w-32 h-0.5 bg-blue-700 mx-auto"></div>
          </div>

          {/* Mobile Certificate Image */}
          <div className="w-full h-48 mb-4 rounded overflow-hidden">
            <img
              src="/images/certificate.webp"
              alt="SNS Square Certificate of Achievement"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mobile Award Text */}
          <div className="text-center">
            <h5 className="text-red-600 mb-2">
              CIO Tech Outlook
            </h5>
            <h6 className="text-neutral-800 mb-2">
              10 Most Promising Agentic AI Startups 2025
            </h6>
            <p className="text-neutral-600 font-inter text-sm">
              Awarded by CIO Tech Outlook for having the 10 most promising Agentic AI Startups
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Layout (Your existing layout)
  const DesktopLayout = () => (
    <div className="w-full min-h-screen relative overflow-hidden">
      
      {/* Unified Grid Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/backgroundgrids/wholebg.svg')",
          backgroundSize: 'cover'
        }}
      />

      {/* Leadership Section */}
      <div className="relative z-10 w-full max-w-[1441px] mx-auto h-auto py-16 lg:py-24">
        
        {/* Leadership Header */}
        <div className="px-4 lg:px-[108px]">
          <h2 className="leading-tight text-neutral-800 mb-8 lg:mb-16">
            Meet Our<br />
            Leadership team
          </h2>
        </div>

        {/* Leadership Cards */}
        <div className="px-4 lg:px-[108px] mb-16 lg:mb-24">
          <div className="flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-9">
            
            {leadershipTeam.map((member) => (
              <div key={member.id} className="w-full lg:w-96 flex flex-col justify-start items-start gap-3 lg:gap-3.5">
                
                {/* Image Container */}
                <div className="w-full h-[400px] lg:h-[478.27px] relative rounded-md overflow-hidden">
                  {/* Member Image */}
                  <img 
                    className="w-full h-full absolute left-0 top-0 object-cover z-20" 
                    src={member.image} 
                    alt={member.name}
                  />
                </div>

                {/* Member Info */}
                <div className="w-full flex flex-col justify-start items-start gap-2.5">
                  <h5 className="w-full text-black">
                    {member.name}
                  </h5>
                  <h6 className="w-full text-black">
                    {member.title}
                  </h6>
                  <div className="w-48 h-1 bg-blue-700 rounded-[87.85px]" />
                  <p className="w-full text-black font-inter">
                    {member.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Section */}
      <div className="relative z-10 w-full px-4 lg:px-28 pb-16 lg:pb-24">
        
        {/* Certificate Container */}
        <div className="w-full max-w-[1225px] min-h-[400px] lg:h-[518px] relative bg-white rounded shadow-[0px_0px_46.20000076293945px_2px_rgba(0,0,0,0.25)] outline outline-[1.50px] outline-offset-[-1.50px] outline-sky-950/40 mx-auto">
          
          {/* Certificate Header */}
          <div className="absolute left-4 lg:left-[85px] top-8 lg:top-[59px] w-full lg:w-[487px] flex flex-col items-center gap-3.5 px-4 lg:px-0">
            <h2 className="w-full text-center text-neutral-800 whitespace-nowrap">
              Our Awards & Achievements
            </h2>
            <div className="w-48 lg:w-72 h-0 opacity-70 outline outline-1 outline-offset-[-0.50px] outline-blue-700 mt-4"></div>
          </div>

          {/* Decorated Text Section as SVG */}
          <div className="absolute left-4 lg:left-[100px] top-32 lg:top-[150px] w-full lg:w-[450px] h-[180px] lg:h-[200px] px-4 lg:px-0 z-20">
            <img 
              src="/images/certificationsection/certificationtext.svg" 
              alt="CIO Tech Outlook Award - 10 Most Promising Agentic AI Startups 2025" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Award Description Text */}
          <div className="absolute left-4 lg:left-[140px] top-[320px] lg:top-[360px] w-full lg:w-[380px] px-4 lg:px-0 z-20">
            <p className="w-full text-center text-neutral-800 font-inter">
              Awarded by CIO Tech Outlook for having the 10 most promising Agentic AI Startups
            </p>
          </div>

          {/* Certificate Image */}
          <div className="absolute right-4 lg:left-[664px] top-80 lg:top-[59px] w-full lg:w-[501px] h-48 lg:h-96 px-4 lg:px-0 z-30">
            <CometCard rotateDepth={15} translateDepth={15}>
              <div className="w-full h-full rounded overflow-hidden cursor-pointer border border-black/40">
                <img
                  src="/images/certificate.webp"
                  alt="SNS Square Certificate of Achievement - Top 10 Agentic AI Startups 2025"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            </CometCard>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Conditional Rendering */}
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </>
  );
};

export default LeadershipAndCertificate;
