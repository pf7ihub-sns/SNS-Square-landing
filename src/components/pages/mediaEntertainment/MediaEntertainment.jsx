import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/store';
import agentsData from '../../../../public/data/agentsData.js';
import AgentDetailsModal from './AgentDetailsModal';
import Pagination from '../../common/Pagination.jsx';

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
  const [currentPage, setCurrentPage] = useState(1); // Add page state

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
    setCurrentPage(1); // Reset to first page when tab changes
  }, [activeTab]);

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

  // Hero Section
  const heroSection = (
    <div
      className="relative w-full h-[400px] md:h-[440px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/AgentFrame.png')",
      }}
    >
      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-3xl md:text-4xl font-bold text-center drop-shadow-lg"
        >
          Agentic Workbench
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-xl md:text-1xl text-center drop-shadow-lg pt-5"
        >
          Welcome back, {userName}! Explore our comprehensive suite of AI agents and choose the perfect one for your needs
        </motion.p>
      </div>
    </div>
  );

  const filteredAgents = agents.filter(agent => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      agent.name.toLowerCase().includes(query) ||
      (agent.summary && agent.summary.toLowerCase().includes(query)) ||
      (agent.description && agent.description.toLowerCase().includes(query)) ||
      (agent.solutions && agent.solutions.some(sol => sol.toLowerCase().includes(query)));
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && agent.status === 'available') ||
      (statusFilter === 'not available' && agent.status === 'not available');
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const agentsPerPage = 12;
  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * agentsPerPage,
    currentPage * agentsPerPage
  );

  const handleTryAgent = (agentId) => {
    navigate(`/agent-playground/agent/${agentId}`);
  };

  const handleViewAgent = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      setIsModalOpen(true);
    }
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
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleSubCategoryClick = (subCategoryId) => {
    setSelectedSubCategory(selectedSubCategory === subCategoryId ? null : subCategoryId);
    setCurrentPage(1); // Reset to first page when subcategory changes
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-6 text-blue-600 font-medium text-lg">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {heroSection}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-md mx-auto pt-10"
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Agents"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white shadow-sm hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer appearance-none"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="not available">Not Available</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <div className="flex space-x-1">
              {['foundational', 'industry'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="border border-gray-100 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full px-4 py-4 text-left transition-all duration-300 ${selectedCategory === category.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border-b border-gray-50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-base">{category.name}</div>
                          <div className={`text-sm mt-1 ${selectedCategory === category.id
                            ? 'text-blue-100'
                            : 'text-gray-500'
                            }`}>
                            {category.subCategories?.length || category.agents?.length || 0} {category.subCategories ? 'subcategories' : 'agents'}
                          </div>
                        </div>
                        {category.subCategories && (
                          <div className={`p-1 rounded-full transition-all duration-300 ${selectedCategory === category.id
                            ? 'bg-white/20'
                            : 'bg-gray-100'}`}>
                            <svg
                              className={`w-4 h-4 transition-transform duration-300 ${selectedCategory === category.id ? 'rotate-90 text-white' : 'text-gray-600'
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
                        <div className="p-3 space-y-2">
                          {category.subCategories.map((subCategory) => (
                            <button
                              key={subCategory.id}
                              onClick={() => handleSubCategoryClick(subCategory.id)}
                              className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 border ${selectedSubCategory === subCategory.id
                                ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
                                : 'text-gray-700 hover:bg-white border-transparent hover:border-gray-200 hover:shadow-sm'
                                }`}
                            >
                              <div className="font-medium text-sm">{subCategory.name}</div>
                              <div className={`text-xs mt-1 ${selectedSubCategory === subCategory.id
                                ? 'text-blue-600'
                                : 'text-gray-500'}`}>
                                {subCategory.agents?.length || 0} agents
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

          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedSubCategory ? getCurrentSubCategoryData()?.name :
                      selectedCategory ? getCurrentCategoryData()?.name :
                        `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Agents`}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedSubCategory ? getCurrentSubCategoryData()?.description :
                      selectedCategory ? getCurrentCategoryData()?.description :
                        `Explore our ${activeTab} agent categories`}
                  </p>
                </div>
                <span className="text-sm text-gray-500">{filteredAgents.length} agents</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedAgents.length > 0 ? (
                paginatedAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 flex flex-col h-full"
                  >
                    {/* Agent Icon and Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-lg font-bold">
                            {agent.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${agent.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : agent.status === 'not available'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {agent.status === 'available'
                          ? 'Available'
                          : agent.status === 'not available'
                            ? 'Not Available'
                            : 'Status Unknown'}
                      </span>
                    </div>

                    {/* Agent Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h3>

                    {/* Agent Description */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1">
                      {agent.summary || agent.description}
                    </p>

                    {/* Solutions Preview */}
                    {agent.solutions && agent.solutions.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {agent.solutions.slice(0, 2).map((solution, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-md"
                            >
                              {solution}
                            </span>
                          ))}
                          {agent.solutions.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-md">
                              +{agent.solutions.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons - Fixed at Bottom */}
                    <div className="mt-auto flex space-x-3">
                      <button
                        onClick={() => handleTryAgent(agent.id)}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Try Agent
                      </button>
                      <button
                        onClick={() => handleViewAgent(agent.id)}
                        className="text-blue-600 hover:opacity-80 text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {selectedCategory ? 'No agents found' : 'Select a category to view agents'}
                  </h3>
                  <p className="text-gray-500">
                    {selectedCategory
                      ? 'Try adjusting your search terms or browse different categories.'
                      : 'Choose a category from the sidebar to explore available agents.'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Add Pagination Component */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

        {/* Agent Details Modal */}
        <AgentDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          agent={selectedAgent}
          category={getCurrentCategoryData()}
        />
      </div>
    </div>
  );
};

export default MediaEntertainment;