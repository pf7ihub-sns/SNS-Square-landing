import React from "react";
import UseCaseCardNew from "../../common/UseCaseCardNew";

const items = [
  {
    id: 1,
    title: "Blog 1",
    description: "Earn rewards for securing the protocol.",
  },
  {
    id: 2,
    title: "Blog 1",
    description: "Earn rewards for securing the protocol.",
  },
  {
    id: 3,
    title: "Blog 1",
    description: "Earn rewards for securing the protocol.",
  },
];

const IdeaSuiteSection = () => {
  return (
    <section className="px-4 xs:px-5 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      <div className="max-w-[1480px] mx-auto">
        <div className="mb-8 lg:mb-12">
          <h3 className="font-manrope font-bold text-[28px] md:text-[30px] lg:text-[36px] leading-tight text-black">
            Idea Suite
          </h3>
          <p className="font-inter text-black/70 mt-3">
            Knowledge that grows smarter with agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((it) => (
            <UseCaseCardNew key={it.id} title={it.title} description={it.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default IdeaSuiteSection;


