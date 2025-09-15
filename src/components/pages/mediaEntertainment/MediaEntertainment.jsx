import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/store';
import agentsData from '../../../../public/data/agentsData.js';
import AgentDetailsModal from './AgentDetailsModal';

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
  }, [activeTab]);

  // Get user name from localStorage
  const userName = localStorage.getItem("name") || "User";

  // Get categories based on active tab
  const getCategories = () => {
    if (activeTab === 'foundational') return agentsData.foundational || [];
    if (activeTab === 'industry') return agentsData.industry || [];
    // Add customer when available in data
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
      // If category has subcategories, get all agents from all subcategories
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
        className="text-white text-xl md:text-1xl  text-center drop-shadow-lg pt-5"
      >
        Welcome back, {userName}! Explore our comprehensive suite of AI agents and choose the perfect one for your needs
      </motion.p>
    </div>
  </div>
);


  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (agent.description && agent.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
  };

  const handleSubCategoryClick = (subCategoryId) => {
    setSelectedSubCategory(selectedSubCategory === subCategoryId ? null : subCategoryId);
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
          className="relative max-w-md mx-auto pt-10"
        >
          <input
            type="text"
            placeholder="Search Agents"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <div className="absolute mt-11 inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
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
          {/* Left Sidebar with Categories */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{category.name}</div>
                          <div className={`text-xs ${
                            selectedCategory === category.id 
                              ? 'text-blue-100' 
                              : 'text-gray-500'
                          }`}>
                            {category.subCategories?.length || category.agents?.length || 0} {category.subCategories ? 'subcategories' : 'agents'}
                          </div>
                        </div>
                        {category.subCategories && (
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              selectedCategory === category.id ? 'rotate-90' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                    
                    {/* Subcategories dropdown */}
                    {selectedCategory === category.id && category.subCategories && (
                      <div className="ml-4 mt-2 space-y-1">
                        {category.subCategories.map((subCategory) => (
                          <button
                            key={subCategory.id}
                            onClick={() => handleSubCategoryClick(subCategory.id)}
                            className={`w-full px-3 py-2 rounded-md text-left text-sm transition-colors ${
                              selectedSubCategory === subCategory.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium">{subCategory.name}</div>
                            <div className="text-xs text-gray-500">
                              {subCategory.agents?.length || 0} agents
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Content Section Header */}
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

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
                  >
                    {/* Agent Icon */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-lg font-bold">
                            {agent.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>

                    {/* Agent Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h3>
                    
                    {/* Agent Description */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
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

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
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
          </div>
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
  );
};

export default MediaEntertainment;