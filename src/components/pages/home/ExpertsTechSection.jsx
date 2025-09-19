import React from "react";
import LogoLoop from "../../common/LogoLoop";

const logos = [
  { src: "/images/home/company logos/AWS.png", alt: "AWS" },
  { src: "/images/home/company logos/AZURE.png", alt: "Azure" },
  { src: "/images/home/company logos/Databricks.png", alt: "Databricks" },
  { src: "/images/home/company logos/SalesForce.png", alt: "Salesforce" },
  { src: "/images/home/company logos/ServiceNow.png", alt: "ServiceNow" },
  { src: "/images/home/company logos/Snowflake.png", alt: "Snowflake" },
];

const ExpertsTechSection = () => {
  return (
    <section className="px-4 xs:px-5 sm:px-6 lg:px-8 py-10 md:py-14 lg:py-16">
      <div className="max-w-[1480px] mx-auto">
        <h5 className="leading-tight text-black mb-6 text-center">
          Experts in Cutting-Edge Technologies
        </h5>
        <LogoLoop
          logos={logos}
          speed={120}
          direction="left"
          logoHeight={36}
          gap={48}
          pauseOnHover={true}
          fadeOut={true}
          scaleOnHover={false}
          ariaLabel="Technology partner logos"
          className="w-full mt-8"
        />
      </div>
    </section>
  );
};

export default ExpertsTechSection;


