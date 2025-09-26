"use client";
 
import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "../common/card.jsx";
export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  useEffect(() => {
    addAnimation();
  }, []);
  
  const [start, setStart] = useState(false);
  
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
 
      // Clone the items multiple times to ensure smooth infinite scroll
      for (let i = 0; i < 3; i++) {
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });
      }
 
      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "150s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "250s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "150s");
      }
    }
  };
  
  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    if (containerRef.current) {
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    if (containerRef.current) {
      const x = e.pageX - containerRef.current.offsetLeft;
      const scroll = x - startX;
      containerRef.current.scrollLeft = scrollLeft - scroll;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-hidden cursor-grab active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4  px-6",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className={cn(
              "relative  max-w-full shrink-0",
              item.cardStyle
            )}
          >
            <Card>
              <CardContent className="flex flex-col gap-4 w-150">
                {item.textPosition === 'top' ? (
                  <>
                    <div className="p-8">
                      <h4 className={cn("", item.textRotate)}>
                        {item.title}
                      </h4>
                    </div>
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      draggable="false"
                      className="w-full h-150 object-cover rounded-lg"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      draggable="false"
                      className="w-full h-150 object-cover rounded-lg"
                    />
                    <div className="p-8">
                      <h4 className={cn("", item.textRotate)}>
                        {item.title}
                      </h4>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};
