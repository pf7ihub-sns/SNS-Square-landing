import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MediaEntertainment = () => {
  const [selectedCategory, setSelectedCategory] = useState('Category 1');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Category 1', 'Category 2', 'Category 3'];

  // Hero Section
  const heroSection = (
    <div className="relative mt-20 w-full overflow-hidden py-16 px-4 h-[400px]" style={{ backgroundImage: "url('/images/Full-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="text-center mb-12 relative sm:pt-20">
        <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Media & Entertainment Solutions
        </h1>
        <p className="text-white/80 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
          Discover our comprehensive suite of AI solutions tailored for the media and entertainment industry.
        </p>
      </div>
    </div>
  );
  
  const agents = [
    {
      id: 1,
      name: 'Agent 1',
      description: 'Lorem ipsum dolor sit amet consectetur. Massa mattis sed magna sociis volutpat tristique eget.',
      image: '/icons/Group.png'
    },
    {
      id: 2,
      name: 'Agent 2',
      description: 'Lorem ipsum dolor sit amet consectetur. Massa mattis sed magna sociis volutpat tristique eget.',
      image: '/icons/Group.png'
    },
    {
      id: 3,
      name: 'Agent 3',
      description: 'Lorem ipsum dolor sit amet consectetur. Massa mattis sed magna sociis volutpat tristique eget.',
      image: '/icons/Group.png'
    },
    {
      id: 4,
      name: 'Agent 4',
      description: 'Lorem ipsum dolor sit amet consectetur. Massa mattis sed magna sociis volutpat tristique eget.',
      image: '/icons/Group.png'
    }
  ];

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {heroSection}
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex">
          {/* Left Sidebar with Categories */}
          <div className="w-64 pr-8">
            <div className="flex flex-col space-y-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-left ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Agents Grid */}
          <div className="flex-1">
                        <div className="mb-6">
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredAgents.map((agent) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-16 h-16 mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{agent.name}</h3>
                  <p className="text-gray-600 mb-4">{agent.description}</p>
                  <div className="flex items-center justify-between">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Try Our Agent
                    </button>
                    <a href="#" className="text-blue-600 hover:underline">
                      View Agent
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaEntertainment;