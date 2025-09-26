import React from "react";
import Hero from "./hero";
import { Card, CardContent } from "../../common/card";
import CoreValueSection from "./CoreValueSection";
import InTheirOwnWords from "./InTheirOwn";
import ScenarioSection from "./scenarioSection";
import { InfiniteMovingCards } from "../../ui/infinite-moving-cards";
import "../../ui/infinite-moving-cards.css";
const contentSections = [
    {
        id: 1,
        title: "Culture, Crafted\nwith Purpose",
        imageSrc: "/images/IMG_6488.png",
        imagePosition: "right",
        cardPosition: "left",
        cardStyle: "rounded-md-none",
        textPosition: "top"
    },
    {
        id: 2,
        title: "Innovation Without Boundaries",
        imageSrc: "/images/IMG_6533.png",
        imagePosition: "left",
        cardPosition: "right",
        cardStyle: "rounded-md-none",
        textPosition: "bottom"
    },
    {
        id: 3,
        title: "The Untiring Force",
        imageSrc: "/images/IMG_7778.png",
        imagePosition: "right",
        cardPosition: "left",
        cardStyle: "rounded-md-none",
        textPosition: "top"
    },
    {
        id: 4,
        title: "Community That Lifts Together",
        imageSrc: "/images/IMG_6534.png",
        imagePosition: "left",
        cardPosition: "right",
        cardStyle: "rounded-md-none",
        textPosition: "bottom"
    },
    {
        id: 5,
        title: "Wellness at the Core, SNS Square",
        imageSrc: "/images/IMG_6535.png",
        imagePosition: "right",
        cardPosition: "left",
        cardStyle: "rounded-md-none",
        textPosition: "top",
        hasOverlay: true
    },
    {
        id: 6,
        title: "An Ecosystem for Growth",
        imageSrc: "/images/IMG_6676.png",
        imagePosition: "left",
        cardPosition: "right",
        cardStyle: "rounded-md-none",
        textPosition: "bottom"
    },
];

export default function Page() {
    return (
        <div className=" bg-white">

            <Hero />
            <div className=" pt-14 mb-12 flex max-w-7xl  mx-auto">
                <div className=""><h3>What defines us</h3>
                    <p className="mt-6 mb-6">What defines us</p></div>
             
            </div>
               <InfiniteMovingCards
                    items={contentSections}
                    direction="left"
                    speed="normal"
                    pauseOnHover={true}
                />
            <CoreValueSection />
            <ScenarioSection />
            <InTheirOwnWords />
        </div>
    );
}