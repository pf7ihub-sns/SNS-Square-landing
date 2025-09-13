import React from "react";
import HeroSection from "./HeroSection";
import ValuesSection from "./ValuesSection";
import MissionVisionSection from "./MissionVisionSection";
import LeadershipSection from "./LeadershipSection";
import Certificate from "./Certificate";
import CareersSection from "./CareersSection";

const AboutUs = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <ValuesSection />
      <MissionVisionSection />
      <LeadershipSection />
      <Certificate />
      <CareersSection />
    </div>
  );
};

export default AboutUs;
