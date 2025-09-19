import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import CTASection from "../Home/CTASection";
import useCaseData from "../../../data/usecase.json";
import HeroSection from "./HeroSection";
import CategoryFilters from "./CategoryFilters";
import UseCasesGrid from "./UseCasesGrid";

// Main App component
export const UseCase = () => {
  const [activeCategory, setActiveCategory] = useState("supply-chain");
  const [showAllUseCases, setShowAllUseCases] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic data mapping
  const dataMapping = useMemo(() => ({
    "supply-chain": {
      data: Object.values(useCaseData).filter(
        (uc) => uc.category === "Supply Chain"
      ),
      categoryInfo: {
        id: "supply-chain",
        label: "Supply Chain",
        icon: "/icons/supply.svg",
      },
    },
    "information-technology": {
      data: Object.values(useCaseData).filter(
        (uc) => uc.category === "Technology"
      ),
      categoryInfo: {
        id: "information-technology",
        label: "Information Technology",
        icon: "/icons/it.svg",
      },
    },
    healthcare: {
      data: Object.values(useCaseData).filter(
        (uc) => uc.category === "Healthcare"
      ),
      categoryInfo: {
        id: "healthcare",
        label: "Healthcare",
        icon: "/icons/healthcare.svg",
      },
    },
    "human-resource": {
      data: Object.values(useCaseData).filter(
        (uc) => uc.category === "Human Resource"
      ),
      categoryInfo: {
        id: "human-resource",
        label: "Human Resource",
        icon: "/icons/humanresource.svg",
      },
    },
    insurance: {
      data: Object.values(useCaseData).filter(
        (uc) => uc.category === "Insurance"
      ),
      categoryInfo: {
        id: "insurance",
        label: "Insurance",
        icon: "/icons/humanresource.svg",
      },
    },
  }), []);

  // Handle URL parameters to set active category
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    
    if (categoryParam && dataMapping[categoryParam]) {
      setActiveCategory(categoryParam);
    }
    
    // Scroll to top when component mounts or category changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.search, dataMapping]);

  // Extract category filters dynamically from the data mapping
  const getCategoryFilters = () => {
    return Object.entries(dataMapping).map(([key, config]) => ({
      ...config.categoryInfo,
      isActive: activeCategory === key,
    }));
  };

  // Create use cases based on active category - UPDATED to include tagline
  const getCurrentUseCases = () => {
    const currentConfig = dataMapping[activeCategory];
    if (!currentConfig) return [];

    return currentConfig.data.map((useCase) => ({
      id: useCase.id,
      title: useCase.title,
      tagline: useCase.tagline, // Added tagline field
      description: useCase.summary || useCase.description,
      category: activeCategory,
      image: useCase.image,
    }));
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setIsDropdownOpen(false); // Close dropdown when category is selected
    // Reset showAllUseCases when category changes
    setShowAllUseCases(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getActiveFilter = () => {
    return categoryFilters.find(filter => filter.isActive);
  };

  const handleViewAllClick = () => {
    setShowAllUseCases(true);
  };

  const handleShowLessClick = () => {
    setShowAllUseCases(false);
  };

  const handleLearnMoreClick = (useCaseId) => {
    navigate(`/usecase/${activeCategory}/${useCaseId}`);
  };

  // Get the use cases to display (first 4 by default, all if showAllUseCases is true)
  const currentUseCases = getCurrentUseCases();
  const useCasesToDisplay = showAllUseCases
    ? currentUseCases
    : currentUseCases.slice(0, 6);

  const categoryFilters = getCategoryFilters();

  return (
    <div className="bg-white min-h-screen w-full">
      {/* Hero Section - Full Width */}
      <HeroSection />

      {/* Main Content */}
      <div className="relative overflow-hidden">
        <div className="flex flex-col items-center gap-8 sm:gap-10 md:gap-16 lg:gap-20 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row w-full xl:max-w-[1300px] items-start gap-6 lg:gap-6">
            {/* Category Filters */}
            <CategoryFilters
              isDropdownOpen={isDropdownOpen}
              toggleDropdown={toggleDropdown}
              getActiveFilter={getActiveFilter}
              categoryFilters={categoryFilters}
              handleCategoryClick={handleCategoryClick}
            />

            {/* Use Cases Grid */}
            <UseCasesGrid
              currentUseCases={currentUseCases}
              useCasesToDisplay={useCasesToDisplay}
              showAllUseCases={showAllUseCases}
              handleViewAllClick={handleViewAllClick}
              handleShowLessClick={handleShowLessClick}
              handleLearnMoreClick={handleLearnMoreClick}
            />
          </div>

          {/* CTA Section */}
          {/* <CTASection /> */}
        </div>
      </div>
    </div>
  );
};

export default UseCase;