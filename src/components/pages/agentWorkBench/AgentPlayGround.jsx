import React, { useState, useEffect } from 'react';
import AgentCard from '../../common/AgentCard';
import agentsData from '../../../data/agents.json';

function AgentPlayGround() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [allAgents, setAllAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [featuredAgent, setFeaturedAgent] = useState(null);

  useEffect(() => {
    // Combine all agents from different categories
    const combinedAgents = [
      ...agentsData.foundationAgents,
      ...agentsData.industrySolutions,
      ...agentsData.customerSolutions
    ];
    
    setAllAgents(combinedAgents);
    
    // Find the featured agent (Deep Research Agent)
    const featured = combinedAgents.find(agent => agent.featured);
    setFeaturedAgent(featured);
    
    // Filter agents based on selected category
    filterAgents(selectedCategory, combinedAgents);
  }, [selectedCategory]);

  useEffect(() => {
    filterAgents(selectedCategory, allAgents);
  }, [selectedCategory, allAgents]);

  const filterAgents = (category, agents) => {
    if (category === 'all') {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter(agent => 
        agent.category.toLowerCase().replace(' ', '-') === category
      );
      setFilteredAgents(filtered);
    }
  };

  const categories = [
    { id: 'all', label: 'All Agents' },
    { id: 'foundation-agents', label: 'Foundation Agents' },
    { id: 'industry-solutions', label: 'Industry Solutions' },
    { id: 'customer-solutions', label: 'Customer Solutions' }
  ];

  // Separate featured agent from other agents for display
  const otherAgents = filteredAgents.filter(agent => !agent.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Agent Playground
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover and interact with our collection of specialized AI agents. 
              Each agent is designed for specific tasks and industries.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${selectedCategory === category.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Featured Agent Section */}
        {featuredAgent && (selectedCategory === 'all' || selectedCategory === 'foundation-agents') && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              🌟 Featured Agent
            </h2>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <AgentCard agent={featuredAgent} isFeatured={true} />
              </div>
            </div>
          </div>
        )}

        {/* Agents Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {selectedCategory === 'all' ? 'All Agents' : 
             categories.find(c => c.id === selectedCategory)?.label || 'Agents'}
          </h2>
          
          {otherAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {otherAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} isFeatured={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No agents found</h3>
              <p className="text-gray-600">
                Try selecting a different category to see available agents.
              </p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mt-12">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
            Playground Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {allAgents.length}
              </div>
              <div className="text-gray-600">Total Agents</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {agentsData.foundationAgents.length}
              </div>
              <div className="text-gray-600">Foundation Agents</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-purple-500 mb-2">
                {agentsData.industrySolutions.length + agentsData.customerSolutions.length}
              </div>
              <div className="text-gray-600">Specialized Agents</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentPlayGround;
