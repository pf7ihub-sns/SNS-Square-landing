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
        <div className="fixed inset-0 z-[100] overflow-y-auto" style={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}>
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
              className="relative bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-5xl max-h-[75vh] flex flex-col"
            >
              {/* Header */}
              <div className="text-white text-center py-4 px-6 rounded-t-lg border-b border-gray-200 flex items-center justify-between" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-lg font-bold" style={{ color: '#1E3A8A' }}>
                    {agent.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-semibold text-white">{agent.name}</h2>
                    {/* <p className="text-sm text-blue-200">{category.name}</p> */}
                    {/* <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {agent.status || 'Available'}
                    </span> */}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-blue-200 hover:text-white transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Agent Overview */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                      <div className="border-b border-gray-200 pb-3 mb-3">
                        <h4 className="text-md font-medium mb-2" style={{ color: '#1E3A8A' }}>Overview</h4>
                      </div>
                      <p className="text-gray-900 leading-relaxed text-md">
                        {agent.description}
                      </p>
                    </div>

                    {/* Related Agents Cards */}
                    {otherAgents.length > 0 && (
                      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <h4 className="text-md font-medium mb-4" style={{ color: '#1E3A8A' }}>Related Agents</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {otherAgents.slice(0, 6).map((relatedAgent) => (
                            <div key={relatedAgent.id} className="bg-gray-50 rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200 border border-gray-200">
                              {/* Agent Icon */}
                              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-white" style={{ backgroundColor: '#1E3A8A' }}>
                                <span className="text-lg font-bold">
                                  {relatedAgent.name.charAt(0)}
                                </span>
                              </div>

                              {/* Agent Info */}
                              <h5 className="text-sm font-medium text-gray-800 mb-2 line-clamp-1">
                                {relatedAgent.name}
                              </h5>
                              <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                {relatedAgent.description}
                              </p>

                              {/* Action Buttons */}
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => navigate(`/agent-playground/agent/${relatedAgent.id}`)}
                                  className="flex-1 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors hover:opacity-90"
                                  style={{ backgroundColor: '#1E3A8A' }}
                                >
                                  Try Agent
                                </button>
                                <button
                                  onClick={() => {
                                    window.location.reload();
                                    console.log('View agent:', relatedAgent.id);
                                  }}
                                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50 transition-colors"
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 h-full">
                      <h4 className="text-md font-medium mb-4" style={{ color: '#1E3A8A' }}>Quick Actions</h4>

                      <div className="space-y-3 mb-6">
                        <button
                          onClick={handleTryAgent}
                          className="w-full text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm hover:opacity-90"
                          style={{ backgroundColor: '#1E3A8A' }}
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
