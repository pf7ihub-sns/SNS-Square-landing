import React from "react";
import Hero from "../../common/hero";
import { Card, CardContent } from "../../common/card";
import CoreValueSection from "./CoreValueSection";
const contentSections = [
	{
		id: 1,
		title: "Culture, Crafted\nwith Purpose",
		description:
			"We give ourselves a creative environment that brings out the best, with an open work culture and balance built into everyday life. Productivity here feels natural, never forced, because we are not workaholics.",
		imageSrc: "/images/IMG_6488.png",
		imagePosition: "right",
		cardPosition: "left",
		cardStyle: "rounded-none lg:rounded-[0px_60px_0px_0px]",
	},
	{
		id: 2,
		title: "Innovation Without Boundaries",
		description:
			"Our ideas are not chained to a laptop, chair, or machine; they flow in coffee corners, brainstorming spaces, and labs alive with possibility. Innovation here is fearless, limitless, and unbounded.",
		imageSrc: "/images/IMG_6533.png",
		imagePosition: "left",
		cardPosition: "right",
		cardStyle: "rounded-none lg:rounded-[60px_0px_0px_0px]",
	},
	{
		id: 3,
		title: "The Untiring Force",
		description:
			"No cubicles, no rules, all energy.\nWe dream, design, and deliver like legends.\nEvery idea here doesn't just exist; it explodes and ignites new possibilities.\nThis is where creativity runs wild, collaboration fuels brilliance, and innovation knows no limits.",
		imageSrc: "/images/IMG_7778.png",
		imagePosition: "right",
		cardPosition: "left",
		cardStyle: "rounded-none lg:rounded-[0px_0px_0px_60px] lg:rotate-180",
		textRotate: "lg:rotate-180",
	},
	{
		id: 4,
		title: "Community That Lifts Together",
		description:
			"Collaboration here is deeper than teamwork; it is trust, openness, and a shared purpose to rise together. Colleagues become a tribe, solving problems, celebrating wins, and creating lasting change.",
		imageSrc: "/images/IMG_6534.png",
		imagePosition: "left",
		cardPosition: "right",
		cardStyle: "rounded-none lg:rounded-[60px_0px_0px_0px]",
	},
	{
		id: 5,
		title: "Wellness at the Core, SNS Square",
		description:
			"Our five-level hub, keeps energy alive with yoga, sports, music, art, and spaces to recharge. It ensures sharp minds, strong bodies, and unstoppable spirits that fuel creativity every day.",
		imageSrc: "/images/IMG_6535.png",
		imagePosition: "right",
		cardPosition: "left",
		cardStyle: "rounded-none lg:rounded-[0px_60px_0px_0px]",
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
		cardStyle: "rounded-none lg:rounded-[0px_0px_60px_0px] lg:rotate-180",
		textRotate: "lg:rotate-180",
	},
	{
		id: 7,
		title: "Belonging Through Celebration",
		description:
			"Festivals, traditions, and shared joy weave belonging into the fabric of our work. This ecosystem gives us connection, community, and unbounded creativity; that's how we bring out our best.",
		imageSrc: "/images/IMG_6586.png",
		imagePosition: "right",
		cardPosition: "left",
		cardStyle: "rounded-none lg:rounded-[0px_0px_0px_60px] lg:rotate-180",
		textRotate: "lg:rotate-180",
	},
];

export default function Page() {
    return (
        <main className="bg-[#FFFFFF] overflow-x-hidden">
            <Hero />
            <div className="w-full bg-[#FFFFFF] lg:px-10">
                <section className="max-w-7xl mx-auto rounded-b-2xl">
                    <div className="flex flex-col items-center gap-6 lg:gap-2.5 p-4 lg:py-4">
                        {contentSections.map((section) => (
                            <article
                                key={section.id}
                                className="w-full bg-white rounded-2xl shadow-lg overflow-hidden lg:bg-transparent lg:shadow-none lg:relative lg:h-[450px] lg:max-w-[1222px]"
                            >
                                {/* Mobile Layout: Stacked Image and Text */}
                                <div className="lg:hidden">
                                    <img
                                        className="w-full h-48 md:h-64 object-cover"
                                        alt={section.title}
                                        src={section.imageSrc}
                                    />
                                    {/* {section.hasOverlay && (
										<div className="absolute inset-0" />
									)} */}
                                    <div className="p-6 md:p-8">
                                        <h2 className="text-xl md:text-2xl font-semibold text-black mb-4 font-['Sora',_Helvetica] leading-tight">
                                            {section.title.split("\n").map((line, i) => (
                                                <React.Fragment key={i}>
                                                    {line}
                                                    {i <
                                                        section.title.split("\n")
                                                            .length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </h2>
                                        <p className="text-sm md:text-base text-gray-700 leading-relaxed font-['Sora',_Helvetica]">
                                            {section.description
                                                .split("\n")
                                                .map((line, i) => (
                                                    <React.Fragment key={i}>
                                                        {line}
                                                        {i <
                                                            section.description.split(
                                                                "\n"
                                                            ).length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}
                                        </p>
                                    </div>
                                </div>

                                {/* Desktop Layout: Overlapping and Absolutely Positioned */}
                                <div className="hidden lg:block w-full h-full relative">
                                    <img
                                        className={`absolute top-0 h-full object-cover object-center ${
                                            section.imagePosition === "left"
                                                ? "left-0 lg:w-[75%] xl:w-[65%]"
                                                : "right-0 lg:w-[75%] xl:w-[70%]"
                                        }`}
                                        alt={section.title}
                                        src={section.imageSrc}
                                    />
                                    {section.hasOverlay && (
                                        <div
                                            className={`absolute top-0 h-full bg-[#00000033] ${
                                                section.imagePosition === "left"
                                                    ? "left-0 lg:w-[75%] xl:w-[65%]"
                                                    : "right-0 lg:w-[75%] xl:w-[70%]"
                                            }`}
                                        />
                                    )}
                                    <Card
                                        className={`absolute top-0 h-full w-[40%] bg-white border-0 shadow-[0px_2px_16px_#10182814] ${
                                            section.cardPosition === "left"
                                                ? "left-0"
                                                : "right-0"
                                        } ${section.cardStyle}`}
                                    >
                                        <CardContent
                                            className={`absolute top-1/2 -translate-y-1/2 flex flex-col gap-6 p-0 w-[75%] ${
                                                section.cardPosition === "left"
                                                    ? "left-14 items-start"
                                                    : "right-14 items-end"
                                            } ${section.textRotate || ""}`}
                                        >
                                            <div className="flex flex-col items-start gap-6 relative self-stretch w-full">
                                                <h2
                                                    className={`relative self-stretch [font-family:'Sora',Helvetica] font-semibold text-black text-[32px] tracking-[0] leading-[40px] ${
                                                        section.cardPosition === "right"
                                                            ? "text-right"
                                                            : ""
                                                    }`}
                                                >
                                                    {section.title.split("\n").map(
                                                        (line, i) => (
															<React.Fragment key={i}>
																{line}
																{i <
																	section.title.split(
																		"\n"
																	).length - 1 && <br />}
															</React.Fragment>
														)
													)}
                                                </h2>
                                                <p
                                                    className={`relative self-stretch [font-family:'Sora',Helvetica] font-normal text-[#000000] text-base tracking-[0] leading-[26px] ${
                                                        section.cardPosition === "right"
                                                            ? "text-right"
                                                            : ""
                                                    }`}
                                                >
                                                    {section.description
                                                        .split("\n")
                                                        .map((line, i) => (
															<React.Fragment key={i}>
																{line}
																{i <
																	section.description.split(
																		"\n"
																	).length - 1 && <br />}
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
            <CoreValueSection />
        </main>
	);
}