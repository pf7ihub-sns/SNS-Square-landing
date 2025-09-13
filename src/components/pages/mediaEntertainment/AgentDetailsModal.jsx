import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AgentDetailsModal = ({ isOpen, onClose, agent, category }) => {
  const navigate = useNavigate();
  
  if (!agent || !category) return null;

  const handleTryAgent = () => {
    navigate(`/agent-playground/agent/${agent.id}`);
  };

  // Get other agents in the same category (excluding current agent)
  const otherAgents = category.agents?.filter(a => a.id !== agent.id) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container - Positioned relative to viewport */}
          <div className="relative min-h-screen flex items-start justify-center pt-20 pb-10 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[75vh] flex flex-col"
            >
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{agent.name}</h2>
                    <p className="text-sm text-gray-500">{category.name}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Agent Overview */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                          {agent.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-800">{agent.name}</h3>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {agent.status || 'Available'}
                            </span>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-sm">{agent.description}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Overview</h4>
                        <p className="text-gray-600 leading-relaxed text-xs">
                          {agent.description} This AI agent is designed to handle complex tasks with high accuracy and efficiency, 
                          leveraging state-of-the-art machine learning models for optimal performance.
                        </p>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Key Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {agent.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-800 text-sm">{feature}</h5>
                              <p className="text-xs text-gray-600 mt-1">
                                Advanced capability that enhances performance.
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Use Cases */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Use Cases</h4>
                      <div className="space-y-2">
                        {agent.useCases.map((useCase, idx) => (
                          <div key={idx} className="flex items-start space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 font-semibold text-xs">{idx + 1}</span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-800 mb-1 text-sm">{useCase}</h5>
                              <p className="text-xs text-gray-600">
                                Perfect for handling this specific scenario with high accuracy.
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
                      <h4 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h4>
                      
                      <div className="space-y-3 mb-6">
                        <button 
                          onClick={handleTryAgent}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                        >
                          Try Our Agent
                        </button>
                        <button
                          onClick={onClose}
                          className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                        >
                          Close
                        </button>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h5 className="font-semibold text-gray-700 mb-3 text-sm">Agent Information</h5>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium text-gray-800">Foundational Agent</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Categories:</span>
                            <span className="font-medium text-gray-800">{category.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">AI models:</span>
                            <span className="font-medium text-gray-800 flex items-center">
                              <span className="w-4 h-4 bg-gray-300 rounded mr-1"></span>
                              OpenAI GPT-4o
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h5 className="font-semibold text-gray-700 mb-3 text-sm">Related Agents</h5>
                        <div className="space-y-2">
                          {otherAgents.slice(0, 3).map((relatedAgent, idx) => (
                            <div key={relatedAgent.id} className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                                <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                  {relatedAgent.name.charAt(0)}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h6 className="text-xs font-medium text-gray-800 truncate">{relatedAgent.name}</h6>
                                <p className="text-xs text-gray-500 truncate">{relatedAgent.description}</p>
                              </div>
                              {idx === 0 ? (
                                <button 
                                  onClick={() => navigate(`/agent-playground/agent/${relatedAgent.id}`)}
                                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                                >
                                  Try
                                </button>
                              ) : (
                                <button 
                                  onClick={() => {
                                    // Close current modal and open new one with related agent
                                    onClose();
                                    setTimeout(() => {
                                      // This would need to be handled by parent component
                                      console.log('View agent:', relatedAgent.id);
                                    }, 100);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  View
                                </button>
                              )}
                            </div>
                          ))}
                          {otherAgents.length === 0 && (
                            <p className="text-xs text-gray-500 italic">No other agents in this category</p>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex space-x-2">
                          <button className="flex-1 text-gray-600 hover:text-gray-800 text-xs font-medium border border-gray-300 py-1 rounded transition-colors">
                            Contact Us
                          </button>
                          <button 
                            onClick={handleTryAgent}
                            className="flex-1 bg-blue-600 text-white text-xs font-medium py-1 rounded hover:bg-blue-700 transition-colors"
                          >
                            Try Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AgentDetailsModal;