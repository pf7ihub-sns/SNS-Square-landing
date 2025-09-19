import React from "react";
import CareersHeroSection from "./CareersHeroSection";
import JobOpportunitiesSection from "./JobOpportunitiesSection";

const CareersPage = () => {
  return (
    <main className="bg-white overflow-x-hidden">
      <CareersHeroSection />
      <JobOpportunitiesSection />
    </main>
  );
};

export default CareersPage;
