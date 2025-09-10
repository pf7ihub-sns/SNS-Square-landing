import React from "react";
import Hero from "../../common/hero"
import { Card, CardContent } from "../../common/card";
const contentSections = [
  {
    id: 1,
    title: "Culture, Crafted\nwith Purpose",
    description:
      "We give ourselves a creative environment that brings out the best, with an open work culture and balance built into everyday life. Productivity here feels natural, never forced, because we are not workaholics.",
    imageSrc: "/images/IMG_6488.png",
    imagePosition: "right",
    cardPosition: "left",
    cardStyle: "rounded-[0px_60px_0px_0px]",
    imageWidth: "w-[1032px]",
    imageLeft: "left-[390px]",
  },
  {
    id: 2,
    title: "Innovation Without Boundaries",
    description:
      "Our ideas are not chained to a laptop, chair, or machine; they flow in coffee corners, brainstorming spaces, and labs alive with possibility. Innovation here is fearless, limitless, and unbounded.",
    imageSrc: "/images/IMG_6533.png",
    imagePosition: "left",
    cardPosition: "right",
    cardStyle: "rounded-[60px_0px_0px_0px]",
    imageWidth: "w-[796px]",
    imageLeft: "left-0",
  },
  {
    id: 3,
    title: "The Untiring Force",
    description:
      "No cubicles, no rules, all energy.\nWe dream, design, and deliver like legends.\nEvery idea here doesn't just exist; it explodes and ignites new possibilities.\nThis is where creativity runs wild, collaboration fuels brilliance, and innovation knows no limits.",
    imageSrc: "/images/IMG_7778.png",
    imagePosition: "right",
    cardPosition: "left",
    cardStyle: "rounded-[0px_0px_0px_60px] rotate-180",
    imageWidth: "w-[767px]",
    imageLeft: "left-[453px]",
    textRotate: "rotate-180",
  },
  {
    id: 4,
    title: "Community That Lifts Together",
    description:
      "Collaboration here is deeper than teamwork; it is trust, openness, and a shared purpose to rise together. Colleagues become a tribe, solving problems, celebrating wins, and creating lasting change.",
    imageSrc: "/images/IMG_6534.png",
    imagePosition: "left",
    cardPosition: "right",
    cardStyle: "rounded-[60px_0px_0px_0px]",
    imageWidth: "w-[786px]",
    imageLeft: "left-0",
  },
  {
    id: 5,
    title: "Wellness at the Core, SNS Square",
    description:
      "Our five-level hub, keeps energy alive with yoga, sports, music, art, and spaces to recharge. It ensures sharp minds, strong bodies, and unstoppable spirits that fuel creativity every day.",
    imageSrc: "/images/IMG_6535.png",
    imagePosition: "right",
    cardPosition: "left",
    cardStyle: "rounded-[0px_60px_0px_0px]",
    imageWidth: "w-[765px]",
    imageLeft: "left-[455px]",
    hasOverlay: true,
  },
  {
    id: 6,
    title: "An Ecosystem for Growth",
    description:
      "This is more than an office, it is a system designed so engaging that we don't feel like going home. Every floor is a launchpad where startups, teams, and mentors turn creativity into impact.",
    imageSrc: "/images/IMG_6676.png",
    imagePosition: "left",
    cardPosition: "right",
    cardStyle: "rounded-[0px_0px_60px_0px] rotate-180",
    imageWidth: "w-[786px]",
    imageLeft: "left-[2px]",
    textRotate: "rotate-180",
  },
  {
    id: 7,
    title: "Belonging Through Celebration",
    description:
      "Festivals, traditions, and shared joy weave belonging into the fabric of our work. This ecosystem gives us connection, community, and unbounded creativity; that's how we bring out our best.",
    imageSrc: "/images/IMG_6586.png",
    imagePosition: "right",
    cardPosition: "left",
    cardStyle: "rounded-[0px_0px_0px_60px] rotate-180",
    imageWidth: "w-[786px]",
    imageLeft: "left-[436px]",
    textRotate: "rotate-180",
  },
];
export default function Page() {
  return (
    <main className="bg-[#FFFFFF] grid justify-items-center [align-items:start] w-screen">
      <Hero />
      {/* Desktop Content Sections - Hidden on Mobile */}
      <div className="hidden lg:block bg-[#FFFFFF] w-full h-auto min-h-[3360px] relative">
        <section className="flex items-center justify-center gap-2.5 px-4 lg:px-8 xl:px-16 2xl:px-24 py-8 xl:py-[54px] absolute top-0 left-1/2 transform -translate-x-1/2 rounded-b-[32px] overflow-hidden bg-[linear-gradient(46deg,rgba(224,233,251,1)_0%,rgba(252,253,254,1)_100%)] w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] xl:w-[calc(100%-8rem)] 2xl:w-[calc(100%-12rem)] max-w-[1440px]">
          <div className="flex flex-col w-full max-w-[1222px] items-center gap-6 relative overflow-hidden mx-auto">
            {contentSections.map((section, index) => (
              <article
                key={section.id}
                className={`relative w-full max-w-[1222px] ${index === 4 ? "h-[443px]" : "h-[442px]"}`}
              >
                <div
                  className={`relative ${index === 4 ? "h-[443px]" : "h-[442px]"}`}
                >
                  {section.imageSrc && (
                    <img
                      className={`absolute w-1/2 ${index === 4 ? "h-[443px]" : "h-[442px]"} top-0 ${section.imagePosition === "left" ? "left-0" : "right-0"} ${index === 0 || index === 3 || index === 6 ? "object-cover" : ""}`}
                      alt="Img"
                      src={section.imageSrc}
                    />
                  )}
                  {section.hasOverlay && (
                    <div
                      className={`absolute w-1/2 ${index === 4 ? "h-[443px]" : "h-[442px]"} top-0 ${section.imagePosition === "left" ? "left-0" : "right-0"} bg-[#00000033]`}
                    />
                  )}
                  <Card
                    className={`absolute w-1/2 ${index === 4 ? "h-[443px]" : "h-[442px]"} top-0 ${section.cardPosition === "left" ? "left-0" : "right-0"} bg-[#FFFFFF] border-0 ${section.cardStyle} shadow-[0px_2px_16px_#10182814]`}
                  >
                    <CardContent
                      className={`absolute flex flex-col items-start gap-6 p-6 w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${section.textRotate || ""}`}
                    >
                      <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
                        <h2
                          className={`relative self-stretch [font-family:'Sora',Helvetica] font-semibold text-black text-[32px] tracking-[0] leading-[40px]`}
                        >
                          {section.title.split("\n").map((line, lineIndex) => (
                            <React.Fragment key={lineIndex}>
                              {line}
                              {lineIndex <
                                section.title.split("\n").length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </h2>
                        <p className="relative self-stretch [font-family:'Sora',Helvetica] font-normal text-[#000000] text-base tracking-[0] leading-[26px]">
                          {section.description
                            .split("\n")
                            .map((line, lineIndex) => (
                              <React.Fragment key={lineIndex}>
                                {line}
                                {lineIndex <
                                  section.description.split("\n").length -
                                    1 && <br />}
                              </React.Fragment>
                            ))}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      {/* Mobile Content Sections - Only visible on Mobile/Tablet */}
      <div className="block lg:hidden w-full px-4 py-8 mb-16">
        <div className="w-full max-w-md mx-auto space-y-6">
          {contentSections.map((section) => (
            <div key={`mobile-${section.id}`} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {section.imageSrc && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Img"
                    src={section.imageSrc}
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-black mb-4 font-['Sora',_Helvetica] leading-tight">
                  {section.title.split("\n").map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line}
                      {lineIndex < section.title.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed font-['Sora',_Helvetica]">
                  {section.description.split("\n").map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line}
                      {lineIndex < section.description.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}