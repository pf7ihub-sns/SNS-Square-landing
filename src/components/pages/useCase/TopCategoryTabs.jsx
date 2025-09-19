import React from "react";
import Button from "../../common/BlackButton";

const TopCategoryTabs = ({ categoryFilters, handleCategoryClick }) => {
  return (
    <div className="w-full max-w-[1300px] mx-auto">
      {/* Section Title */}
      <p className="text-center mb-4 md:mb-8 highlight">
        Explore your business sector
      </p>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 mt-10">
        {categoryFilters.map((filter) => (
          <Button
            key={filter.id}
            onClick={() => handleCategoryClick(filter.id)}
            variant={filter.isActive ? "black" : "black-outline"}
            size="medium"
            className="flex items-center gap-2"
          >
            <img
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Category icon"
              src={filter.icon}
              style={
                filter.isActive
                  ? {
                      filter: "brightness(0) saturate(100%) invert(100%)",
                    }
                  : {
                      filter:
                        "brightness(0) saturate(100%) invert(15%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(95%)",
                      opacity: 0.7,
                    }
              }
            />
            <span className="font-medium text-sm md:text-base whitespace-nowrap">
              {filter.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TopCategoryTabs;
