import React from "react";

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

const LeadershipSection = () => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      
      {/* Background covering entire screen width */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/backgroundgrids/bgforteam.svg')",
          backgroundSize: 'cover'
        }}
      />

      {/* Content Container - centered with max-width */}
      <div className="relative z-10 w-full max-w-[1441px] mx-auto h-auto lg:min-h-[861px] py-16 lg:py-0">
        
        {/* Header */}
        <div className="absolute left-4 lg:left-[108px] top-8 lg:top-[64px]">
          <h2 className="w-full lg:w-96 text-2xl lg:text-4xl font-bold font-manrope text-neutral-800">
            Meet Our<br />
            Leadership team
          </h2>
        </div>

        {/* Main Content */}
        <div className="absolute left-4 lg:left-[108px] top-32 lg:top-[180px] w-full lg:w-[1221px] pr-4 lg:pr-0">
          <div className="flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-9">
            
            {leadershipTeam.map((member, index) => (
              <div key={member.id} className="w-full lg:w-96 flex flex-col justify-start items-start gap-3 lg:gap-3.5">
                
                {/* Image Container with Gradient Background */}
                <div className="w-full h-[400px] lg:h-[478.27px] relative rounded-md overflow-hidden">
                  
                  {/* Gradient Blur Effects */}
                  <div 
                    className="w-72 h-[903px] absolute opacity-30 bg-sky-400 rounded-full blur-[125px]"
                    style={{
                      left: '173px',
                      top: '-201px'
                    }} 
                  />
                  <div 
                    className="w-72 h-[903px] absolute opacity-30 bg-blue-700 rounded-full blur-[125px]"
                    style={{
                      left: '-117px',
                      top: '-250px'
                    }} 
                  />
                  
                  {/* Member Image - positioned on top with z-index */}
                  <img 
                    className="w-full h-full absolute left-0 top-0 object-cover z-20" 
                    src={member.image} 
                    alt={member.name}
                  />
                </div>

                {/* Member Info */}
                <div className="w-full flex flex-col justify-start items-start gap-2.5">
                  <h3 className="w-full text-black text-lg lg:text-xl font-bold font-manrope">
                    {member.name}
                  </h3>
                  <p className="w-full text-black text-base lg:text-lg font-medium font-manrope">
                    {member.title}
                  </p>
                  <div className="w-48 h-1 bg-blue-700 rounded-[87.85px]" />
                  <p className="w-full text-black text-xl lg:text-2xl font-normal font-inter leading-loose">
                    {member.company}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadershipSection;
