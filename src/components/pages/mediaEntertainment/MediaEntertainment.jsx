import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/store';
import agentsData from '../../../../public/data/agentsData.js';
import AgentDetailsModal from './AgentDetailsModal';
import Pagination from '../../common/Pagination.jsx';
import SelectCatagoryImg from "../../../../public/images/objects.png";
import Docimg from "../../../../public/images/doc.png";
import Sumimg from "../../../../public/images/sum.png";
import Com from "../../../../public/images/Com.png"
import BusinessImg from "../../../../public/images/Business.png"
import Compliance from "../../../../public/images/compliance.png"
import Dataimg from "../../../../public/images/data.png";
import Dev from "../../../../public/images/dev.png";
import Work from "../../../../public/images/work.png";
import Social from "../../../../public/images/social.png";
import AgentCard from './AgentCard.jsx';
import HumanResource from "../../../../public/icons/Corprate.svg";
import Healthcare from "../../../../public/icons/Healthcareuicon.svg"
import Finance from "../../../../public/icons/finance.svg";
import Manufacturing from "../../../../public/icons/supports.svg";
import RealEstate from "../../../../public/icons/imporve.svg";
import Retail from "../../../../public/icons/Reduces.svg";
import Marketing from "../../../../public/icons/Marketing,Sales.svg";
import Bank from "../../../../public/icons/ITIcon.svg";
import General from "../../../../public/icons/Contextual.svg";
import Agri from "../../../../public/icons/plant.png";
const categoryIcons = {
  'doc-knowledge': Docimg,
  'data-management': Dataimg,
  'communication-assistance': Com,
  'business-intelligence': BusinessImg,
  'compliance-security': Compliance,
  'summarization': Sumimg,
  'social-media': Social,
  'work-management': Work,
  'developer-support': Dev,
  'manufacturing': Manufacturing,
  'agriculture': Agri,
  'healthcare': Healthcare,
  'legal': Finance,
  'media-entertainment': Social,
  'retail': Retail,
  'real-estate': RealEstate,
  'hr': HumanResource,
  'fintech': Marketing,
  'banking': Bank,
  'general': General
};

const MediaEntertainment = () => {
  const [activeTab, setActiveTab] = useState('foundational');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // Mobile sidebar state

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated, navigate]);

  // Reset selections when changing tabs
  useEffect(() => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setCurrentPage(1);
    setIsMobileSidebarOpen(false); // Close sidebar on tab change
  }, [activeTab]);

  // Replace the useEffect in MediaEntertainment.jsx with this fixed version
  useEffect(() => {
    console.log('=== MEDIA ENTERTAINMENT DEBUG ===');
    console.log('Location search:', location.search);

    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');

    console.log('Parsed URL Params:', { tabParam, categoryParam, subcategoryParam });

    // Only process if we have URL parameters (avoid processing empty states after URL cleaning)
    if (tabParam || categoryParam || subcategoryParam) {
      console.log('Processing URL parameters...');

      // Set the active tab if provided
      if (tabParam && ['foundational', 'industry'].includes(tabParam)) {
        console.log('Setting activeTab to:', tabParam);
        setActiveTab(tabParam);
      }

      // Set the category if provided
      if (categoryParam) {
        console.log('Processing category param:', categoryParam);

        const categoryMappings = {
          'data-management': 'data-management',
          'compliance-security': 'compliance-security',
          'business-intelligence': 'business-intelligence',
          'communication-assistance': 'communication-assistance',
          'summarization': 'summarization',
          'doc-knowledge': 'doc-knowledge',
          'social-media': 'social-media',
          'work-management': 'work-management',
          'developer-support': 'developer-support',
          'manufacturing': 'manufacturing',
          'agriculture': 'agriculture',
          'healthcare': 'healthcare',
          'legal': 'legal',
          'media-entertainment': 'media-entertainment',
          'retail': 'retail',
          'real-estate': 'real-estate',
          'hr': 'hr',
          'fintech': 'fintech',
          'banking': 'banking',
          'general': 'general'
        };

        const mappedCategory = categoryMappings[categoryParam] || categoryParam;
        console.log('Setting selectedCategory to:', mappedCategory);
        setSelectedCategory(mappedCategory);
      }

      // Set the subcategory if provided
      if (subcategoryParam) {
        console.log('Setting subcategory to:', subcategoryParam);
        setSelectedSubCategory(subcategoryParam);
      }

      // Clean URL after processing parameters (with a small delay to avoid race conditions)
      setTimeout(() => {
        const newUrl = window.location.pathname;
        console.log('Cleaning URL to:', newUrl);
        window.history.replaceState({}, '', newUrl);
      }, 100);
    } else {
      console.log('No URL parameters to process');
    }

    console.log('=== END DEBUG ===');
  }, [location.search]);

  // Get user name from localStorage
  const userName = localStorage.getItem('name') || 'User';

  // Get categories based on active tab
  const getCategories = () => {
    if (activeTab === 'foundational') return agentsData.foundational || [];
    if (activeTab === 'industry') return agentsData.industry || [];
    return [];
  };


  // Get current category data
  const getCurrentCategoryData = () => {
    if (!selectedCategory) return null;
    return getCategories().find(cat => cat.id === selectedCategory);
  };

  // Get current subcategory data
  const getCurrentSubCategoryData = () => {
    if (!selectedSubCategory) return null;
    const categoryData = getCurrentCategoryData();
    return categoryData?.subCategories?.find(sub => sub.id === selectedSubCategory);
  };

  // Get agents to display
  const getAgentsToDisplay = () => {
    // If there's a search query, search across ALL agents regardless of category selection
    if (searchQuery.trim()) {
      const allAgents = [];
      const categories = getCategories();

      categories.forEach(category => {
        // Add agents directly under category
        if (category.agents) {
          allAgents.push(...category.agents);
        }
        // Add agents from subcategories
        if (category.subCategories) {
          category.subCategories.forEach(subCat => {
            if (subCat.agents) {
              allAgents.push(...subCat.agents);
            }
          });
        }
      });

      return allAgents;
    }

    // If no search query, use the existing category-based filtering
    if (selectedSubCategory) {
      const subCategoryData = getCurrentSubCategoryData();
      return subCategoryData?.agents || [];
    }
    if (selectedCategory) {
      const categoryData = getCurrentCategoryData();
      if (categoryData?.agents) {
        return categoryData.agents;
      }
      if (categoryData?.subCategories) {
        return categoryData.subCategories.reduce((acc, subCat) => {
          return acc.concat(subCat.agents || []);
        }, []);
      }
    }
    return [];
  };

  const agents = getAgentsToDisplay();
  const categories = getCategories();

  const getFilteredAgentCount = (agentsList) => {
    if (!agentsList) return 0;
    if (statusFilter === 'all') return agentsList.length;
    return agentsList.filter(agent =>
      statusFilter === 'available' ? agent.status === 'available'
        : agent.status === 'not available' ? agent.status === 'not available'
          : true
    ).length;
  };

  // Hero Section
  const heroSection = (
    <div
      className="relative w-full h-[280px] sm:h-[320px] md:h-[380px] lg:h-[610px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/AgentFrame.png')",
      }}
    >
      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-center drop-shadow-lg mt-15  py-5"
        >
          Agentic Workbench
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-sm sm:text-base md:text-lg lg:text-3xl text-center drop-shadow-lg pt-3 sm:pt-4 lg:pt-5 max-w-7xl px-4"
        >
          Welcome back, {userName}! Explore our comprehensive suite of AI agents and choose the perfect one for your needs
        </motion.p>
        <div className="flex justify-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 px-4 w-full">
          <div className="p-1 w-full max-w-md sm:w-auto">
            <div className="flex space-x-3 sm:space-x-5">
              {['foundational', 'industry'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-sm sm:text-base lg:text-lg font-medium transition-colors ${activeTab === tab
                    ? 'bg-white text-blue-600'
                    : 'text-white border border-white/50 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>


    </div>
  );

  const filteredAgents = agents.filter(agent => {
    const query = searchQuery.trim().toLowerCase();

    // If no search query, only filter by status
    if (!query) {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'available' && agent.status === 'available') ||
        (statusFilter === 'not available' && agent.status === 'not available');
      return matchesStatus;
    }

    // Search in multiple fields
    const searchableText = [
      agent.name || '',
      agent.summary || '',
      agent.description || '',
      ...(agent.solutions || [])
    ].join(' ').toLowerCase();

    const matchesSearch = searchableText.includes(query);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && agent.status === 'available') ||
      (statusFilter === 'not available' && agent.status === 'not available');

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const agentsPerPage = 4;
  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * agentsPerPage,
    currentPage * agentsPerPage
  );

  const handleTryAgent = (agentId) => {
    navigate(`/agent-playground/agent/${agentId}`);
  };

  const handleViewAgent = (agentId) => {
    navigate(`/agent-details/${agentId}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
  };

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubCategory(null);
    }
    setCurrentPage(1);
  };

  const handleSubCategoryClick = (subCategoryId) => {
    setSelectedSubCategory(selectedSubCategory === subCategoryId ? null : subCategoryId);
    setCurrentPage(1);
  };

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <AnimatePresence mode="wait">
      {isMobileSidebarOpen && (
        <>
          {/* Blur Overlay with Glass Effect */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            key="mobile-sidebar"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className="fixed left-0 top-0 h-full w-[85vw] max-w-[320px] sm:w-80 bg-white/95 backdrop-blur-xl z-50 lg:hidden overflow-y-auto shadow-2xl border-r border-gray-200/50"
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))'
            }}
          >
        <div className="p-4 sm:p-5 border-b border-gray-200/70 sticky top-0 bg-white/90 backdrop-blur-lg z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Categories
            </h3>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div 
                key={category.id} 
                className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 text-left transition-all duration-300 ${selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border-b border-gray-50'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm sm:text-base truncate">{category.name}</div>
                      <div className={`text-xs sm:text-sm mt-1 ${selectedCategory === category.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                        {category.subCategories
                          ? `${category.subCategories.length} subcategories`
                          : `${getFilteredAgentCount(category.agents)} agents`}

                      </div>
                    </div>
                    {category.subCategories && (
                      <div className={`p-1 rounded-full transition-all duration-300 flex-shrink-0 ml-2 ${selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                        <svg
                          className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${selectedCategory === category.id ? 'rotate-90 text-white' : 'text-gray-600'
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>

                {selectedCategory === category.id && category.subCategories && (
                  <div className="bg-gray-50/50 border-t border-gray-100">
                    <div className="p-2 sm:p-3 space-y-2">
                      {category.subCategories.map((subCategory, subIndex) => (
                        <button
                          key={subCategory.id}
                          onClick={() => handleSubCategoryClick(subCategory.id)}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 border ${selectedSubCategory === subCategory.id
                            ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
                            : 'text-gray-700 hover:bg-white border-transparent hover:border-gray-200 hover:shadow-sm'
                            }`}
                        >
                          <div className="font-medium text-xs sm:text-sm">{subCategory.name}</div>
                          <div className={`text-xs mt-1 ${selectedSubCategory === subCategory.id ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                            {getFilteredAgentCount(subCategory.agents)} agents

                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 sm:mt-6 text-blue-600 font-medium text-base sm:text-lg">Loading your workspace...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 ">
      {heroSection}

      {/* Main Content Container */}
      <div className="container mx-auto px-4 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-4">
              <div className="px-4 lg:px-5 py-4 border-b border-gray-200">
                <h3 className="text-base lg:text-lg font-medium text-gray-900 -tracking-tight">Categories</h3>
              </div>

              <div className="py-3">
                <div className="space-y-0">
                  {categories.map((category) => (
                    <div key={category.id} className="relative">
                      {/* Flowing blue line from icon to selected subcategory */}
                      {selectedCategory === category.id && category.subCategories && category.subCategories.length > 0 && (
                        <div
                          className="absolute left-6.5 top-10 w-1 bg-blue-500 transition-all duration-300 ease-out z-10 rounded-2xl"
                          style={{
                            height: selectedSubCategory ?
                              `${((category.subCategories.findIndex(sub => sub.id === selectedSubCategory) + 1) * 40) + 8}px` :
                              `${category.subCategories.length * 40}px`,
                            background: selectedSubCategory ?
                              'linear-gradient(to bottom, #3b82f6, #1d4ed8)' :
                              '#d1d5db'
                          }}
                        />
                      )}

                      {/* Main Category Button */}
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full px-4 lg:px-5 py-2.5 lg:py-3 text-left transition-all duration-200 group ${selectedCategory === category.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          {/* Category Icon */}
                          <div className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0">
                            {categoryIcons[category.id] ? (
                              <img
                                src={categoryIcons[category.id]}
                                alt={category.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className={`w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-sm flex items-center justify-center text-xs font-semibold text-white ${selectedCategory === category.id ? 'bg-blue-500' : 'bg-gray-400'
                                }`}>
                                📄
                              </div>
                            )}
                          </div>

                          {/* Category Name */}
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm lg:text-base leading-tight tracking-tight ${selectedCategory === category.id ? 'text-[#000000]' : 'text-gray-900'
                              }`}>
                              {category.name}
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Subcategories with proper hierarchy */}
                      {selectedCategory === category.id && category.subCategories && (
                        <div className="relative">
                          <div className="ml-6 lg:ml-8 space-y-1 animate-in slide-in-from-top duration-300">
                            {category.subCategories.map((subCategory, index) => (
                              <div key={subCategory.id} className="relative">
                                <button
                                  onClick={() => handleSubCategoryClick(subCategory.id)}
                                  className={`w-full max-w-[calc(100%-1rem)] lg:max-w-[16rem] px-3 lg:px-4 py-1 text-left transition-all duration-150 rounded-md ml-2 transform ${selectedSubCategory === subCategory.id
                                    ? ' text-[#000000] bg-[#F3F5FA] shadow-lg scale-105'
                                    : ' hover:border border-[#064EE3]'
                                    }`}
                                  style={{
                                    animationDelay: `${index * 50}ms`
                                  }}
                                >
                                  <div
                                    className="text-xs lg:text-sm font-medium leading-tight tracking-tight bg-[#F3F5FA] px-2 lg:px-3 py-1.5 lg:py-2 rounded"
                                  >
                                    {subCategory.name}
                                  </div>

                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full lg:w-auto">
            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 lg:mb-8"
            >
              <div className="flex gap-2 sm:gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search Agents"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 sm:py-2.5 pl-10 border border-[#B6B9BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Status Filter Dropdown - Desktop */}
                <div className="hidden lg:block relative w-auto min-w-[140px] flex-shrink-0">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#064EE3] to-[#3D76EC] shadow-sm hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer appearance-none"
                  >
                    <option className='text-black' value="all">All Status</option>
                    <option className='text-black' value="available">Available</option>
                    <option className='text-black' value="not available">Not Available</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Status Filter - Mobile/Tablet (Icon Only) */}
                <div className="lg:hidden relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-r from-[#064EE3] to-[#3D76EC] text-white border border-blue-500 rounded-lg shadow-sm hover:shadow-md transition-all flex-shrink-0"
                    aria-label="Status Filter"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu for Mobile */}
                  {isOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setIsOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                        <div className="py-1">
                          <button
                            onClick={() => { setStatusFilter('all'); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            All Status
                          </button>
                          <button
                            onClick={() => { setStatusFilter('available'); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'available' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            Available
                          </button>
                          <button
                            onClick={() => { setStatusFilter('not available'); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'not available' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            Not Available
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Filter Button - Icon Only */}
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex-shrink-0"
                  aria-label="Filter Categories"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                </button>
              </div>
            </motion.div>

            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {searchQuery.trim() ? 'Search Results' :
                      selectedSubCategory ? getCurrentSubCategoryData()?.name :
                        selectedCategory ? getCurrentCategoryData()?.name :
                          `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Agents`}
                  </h2>
                  <p className="text-[#000] mt-1 text-xs sm:text-sm md:text-base line-clamp-2">
                    {searchQuery.trim() ? `Found ${filteredAgents.length} agents matching "${searchQuery}"` :
                      selectedSubCategory ? getCurrentSubCategoryData()?.description :
                        selectedCategory ? getCurrentCategoryData()?.description :
                          `Explore our ${activeTab} agent categories`}
                  </p>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 self-start sm:self-auto flex-shrink-0">
                  {filteredAgents.length} agents
                </span>
              </div>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {paginatedAgents.length > 0 ? (
                paginatedAgents.map((agent, index) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    index={index}
                    onTryAgent={handleTryAgent}
                    onViewAgent={handleViewAgent}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center text-center py-8 sm:py-12 px-4">
                  <img
                    src={SelectCatagoryImg}
                    alt="Objects"
                    className="w-40 sm:w-50 md:w-62 mb-4 sm:mb-6"
                  />
                  <h3 className="text-sm sm:text-base md:text-lg text-gray-800 mb-2">
                    {selectedCategory ? 'No agents found' : 'Select a category to view agents'}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base px-2 max-w-md">
                    {selectedCategory
                      ? 'Try adjusting your search terms or browse different categories.'
                      : 'Choose a category from the sidebar to explore available agents.'}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Agent Details Modal */}
        {/* <AgentDetailsModal

        /> */}
      </div>
    </div>
  );
};

export default MediaEntertainment;