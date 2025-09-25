import React from "react";
import HeroSection from "./HeroSection";
import ValuesSection from "./ValuesSection";
import MissionVisionSection from "./MissionVisionSection";
import LeadershipSection from "./LeadershipSection";
import Certificate from "./Certificate";
import CareersSection from "./CareersSection";
import EndToEndCards from "./endtoendCards";

const AboutUs = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <ValuesSection />
      <MissionVisionSection />
      <EndToEndCards/>
      <LeadershipSection />
      <Certificate />
    </div>
  );
};

export default AboutUs;
