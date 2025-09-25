import React from "react";
import Hero from "./hero";
import { Card, CardContent } from "../../common/card";
import CoreValueSection from "./CoreValueSection";
import InTheirOwnWords from "./InTheirOwn";
import ScenarioSection from "./scenarioSection";
const contentSections = [
    {
        id: 1,
        title: "Culture, Crafted\nwith Purpose",
        description:
            "We give ourselves a creative environment that brings out the best, with an open work culture and balance built into everyday life. Productivity here feels natural, never forced, because we are not workaholics.",
        imageSrc: "/images/IMG_6488.png",
        imagePosition: "right",
        cardPosition: "left",
        cardStyle: "rounded-none lg:rotate-180",
        textRotate: "lg:rotate-180",
    },
    {
        id: 2,
        title: "Innovation Without Boundaries",
        description:
            "Our ideas are not chained to a laptop, chair, or machine; they flow in coffee corners, brainstorming spaces, and labs alive with possibility. Innovation here is fearless, limitless, and unbounded.",
        imageSrc: "/images/IMG_6533.png",
        imagePosition: "left",
        cardPosition: "right",
        cardStyle: "rounded-none ",
    },
    {
        id: 3,
        title: "The Untiring Force",
        description:
            "No cubicles, no rules, all energy.\nWe dream, design, and deliver like legends.\nEvery idea here doesn't just exist; it explodes and ignites new possibilities.\nThis is where creativity runs wild, collaboration fuels brilliance, and innovation knows no limits.",
        imageSrc: "/images/IMG_7778.png",
        imagePosition: "right",
        cardPosition: "left",
        cardStyle: "rounded-none  lg:rotate-180",
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
        cardStyle: "rounded-none ",
    },
    {
        id: 5,
        title: "Wellness at the Core, SNS Square",
        description:
            "Our five-level hub, keeps energy alive with yoga, sports, music, art, and spaces to recharge. It ensures sharp minds, strong bodies, and unstoppable spirits that fuel creativity every day.",
        imageSrc: "/images/IMG_6535.png",
        imagePosition: "right",
        cardPosition: "left",
        cardStyle: "rounded-none lg:rotate-180",
        hasOverlay: true,
        textRotate: "lg:rotate-180",
    },
    {
        id: 6,
        title: "An Ecosystem for Growth",
        description:
            "This is more than an office, it is a system designed so engaging that we don't feel like going home. Every floor is a launchpad where startups, teams, and mentors turn creativity into impact.",
        imageSrc: "/images/IMG_6676.png",
        imagePosition: "left",
        cardPosition: "right",
        cardStyle: "rounded-none ",
        
    },
    {
        id: 7,
        title: "Belonging Through Celebration",
        description:
            "Festivals, traditions, and shared joy weave belonging into the fabric of our work. This ecosystem gives us connection, community, and unbounded creativity; that's how we bring out our best.",
        imageSrc: "/images/IMG_6586.png",
        imagePosition: "right",
        cardPosition: "left",
        cardStyle: "rounded-none lg:rotate-180",
        textRotate: "lg:rotate-180",
    },
];

export default function Page() {
    return (
        <main className="bg-[#FFFFFF] overflow-x-hidden">
            <Hero showButton={false} />

            {/* What defines us section */}
            <div className="max-w-7xl mx-auto mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">What defines us</h3>
                <p className="text-gray-600 text-lg mb-8">What defines us</p>
            </div>

            {/* Culture Cards Horizontal Scroll */}
            <div className="max-w-7xl mx-auto">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex space-x-6 pb-4 rounded-lg" style={{ width: 'max-content' }}>
                        {contentSections.map((section) => (
                            <div 
                                key={section.id} 
                                className={`bg-[#F0FAFF]  overflow-hidden hover:shadow-xl h-90 rounded-xl transition-shadow duration-300 flex-shrink-0 w-80 ${section.cardStyle}`}
                            >
                                <div className={`h-64 relative overflow-hidden ${section.hasOverlay ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50' : ''}`}>
                                    <img
                                        src={section.imageSrc}
                                        alt={section.title}
                                        className={`w-full h-full object-cover rounded-lg ${section.textRotate || ''}`}
                                    />
                                </div>
                                <div className={`p-6 ${section.textRotate || ''}`}>
                                    <h4 className=" text-gray-900 rounded-lg">{section.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <CoreValueSection />
            <ScenarioSection />
            <InTheirOwnWords />
        </main>
    );
}