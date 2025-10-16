import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

  // Close mobile sidebar when category/subcategory is selected
  useEffect(() => {
    if (selectedCategory || selectedSubCategory) {
      setIsMobileSidebarOpen(false);
    }
  }, [selectedCategory, selectedSubCategory]);

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
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-center drop-shadow-lg mt-15 py-5"
        >
          Agentic Workbench
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white text-sm sm:text-base md:text-lg lg:text-3xl text-center drop-shadow-lg pt-3 sm:pt-4 lg:pt-5 max-w-7xl"
        >
          Welcome back, {userName}! Explore our comprehensive suite of AI agents and choose the perfect one for your needs
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mt-25 sm:mb-8"
        >
          <div className="p-1 w-full sm:w-auto">
            <div className="flex space-x-5">
              {['foundational', 'industry'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-none px-6 sm:px-8 py-2.5 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white border-2 border-white/40 hover:border-white hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
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

  const MobileSidebar = () => (
    <>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto shadow-2xl ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Categories</h3>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full px-4 py-4 text-left transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border-b border-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-base">{category.name}</div>
                      <div className={`text-sm mt-1 ${selectedCategory === category.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {category.subCategories
                          ? `${category.subCategories.length} subcategories`
                          : `${getFilteredAgentCount(category.agents)} agents`}
                      </div>
                    </div>
                    {category.subCategories && (
                      <div className={`p-1 rounded-full transition-all duration-300 ${selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${selectedCategory === category.id ? 'rotate-90 text-white' : 'text-gray-600'}`}
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
                    <div className="p-3 space-y-2">
                      {category.subCategories.map((subCategory) => (
                        <button
                          key={subCategory.id}
                          onClick={() => handleSubCategoryClick(subCategory.id)}
                          className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 border ${
                            selectedSubCategory === subCategory.id
                              ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
                              : 'text-gray-700 hover:bg-white border-transparent hover:border-gray-200 hover:shadow-sm'
                          }`}
                        >
                          <div className="font-medium text-sm">{subCategory.name}</div>
                          <div className={`text-xs mt-1 ${selectedSubCategory === subCategory.id ? 'text-blue-600' : 'text-gray-500'}`}>
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
      </div>
    </>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 sm:mt-6 text-blue-600 font-medium text-base sm:text-lg">Loading your workspace...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {heroSection}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl mx-auto pt-6 sm:pt-8 lg:pt-10 px-4 sm:px-0"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search agents by name, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md text-sm sm:text-base bg-white"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              className="w-full sm:w-40 px-4 py-3 pr-10 border-0 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer appearance-none"
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
        </div>
      </motion.div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-18 sm:py-20 ">
        {/* Tabs */}

        <div className="lg:hidden mb-4 sm:mb-6">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span className="text-gray-700 font-medium">Filter Categories</span>
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex gap-6 lg:-mt-20 ">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
              <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <h3 className="text-lg font-bold text-gray-900">Categories</h3>
              </div>

              <div className="py-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="space-y-0">
                  {categories.map((category) => (
                    <div key={category.id} className="relative">
                      {selectedCategory === category.id && category.subCategories && category.subCategories.length > 0 && (
                        <div
                          className="absolute left-6.5 top-10 w-1 bg-gradient-to-b from-blue-500 to-blue-600 transition-all duration-300 ease-out z-10 rounded-full"
                          style={{
                            height: selectedSubCategory ?
                              `${((category.subCategories.findIndex(sub => sub.id === selectedSubCategory) + 1) * 40) + 8}px` :
                              `${category.subCategories.length * 40}px`,
                          }}
                        />
                      )}

                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full px-5 py-3 text-left transition-all duration-200 group ${
                          selectedCategory === category.id ? 'bg-blue-50/70' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 flex-shrink-0">
                            {categoryIcons[category.id] ? (
                              <img
                                src={categoryIcons[category.id]}
                                alt={category.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-semibold text-white ${
                                selectedCategory === category.id ? 'bg-blue-500' : 'bg-gray-400'
                              }`}>
                                📄
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className={`font-semibold text-base leading-tight ${
                              selectedCategory === category.id ? 'text-blue-700' : 'text-gray-900'
                            }`}>
                              {category.name}
                            </div>
                          </div>
                        </div>
                      </button>

                      {selectedCategory === category.id && category.subCategories && (
                        <div className="relative">
                          <div className="ml-8 space-y-1 animate-in slide-in-from-top duration-300">
                            {category.subCategories.map((subCategory, index) => (
                              <div key={subCategory.id} className="relative">
                                <button
                                  onClick={() => handleSubCategoryClick(subCategory.id)}
                                  className={`w-65 px-4 py-2.5 text-left transition-all duration-150 rounded-lg ml-2 transform hover:scale-[1.02] ${
                                    selectedSubCategory === subCategory.id
                                      ? 'text-blue-700 bg-blue-50 shadow-sm border border-blue-200'
                                      : 'hover:bg-white hover:shadow-sm border border-transparent'
                                  }`}
                                >
                                  <div className="text-sm font-medium leading-tight">
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
          <div className="flex-1  ">
            <div className="mb-6 ml-1 mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {searchQuery.trim() ? 'Search Results' :
                      selectedSubCategory ? getCurrentSubCategoryData()?.name :
                        selectedCategory ? getCurrentCategoryData()?.name :
                          `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Agents`}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {searchQuery.trim() ? `Found ${filteredAgents.length} agents matching "${searchQuery}"` :
                      selectedSubCategory ? getCurrentSubCategoryData()?.description :
                        selectedCategory ? getCurrentCategoryData()?.description :
                          `Explore our ${activeTab} agent categories`}
                  </p>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-sm font-semibold text-blue-700">
                    {filteredAgents.length} {filteredAgents.length === 1 ? 'Agent' : 'Agents'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="col-span-full flex flex-col items-center justify-center text-center py-16 sm:py-20 mt-4 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <img
                    src={SelectCatagoryImg}
                    alt="Objects"
                    className="w-48 sm:w-60 mb-6 opacity-80"
                  />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    {selectedCategory ? 'No agents found' : 'Select a category to view agents'}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base px-4 max-w-md">
                    {selectedCategory
                      ? 'Try adjusting your search terms or browse different categories.'
                      : 'Choose a category from the sidebar to explore available agents.'}
                  </p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 sm:mt-10">
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