// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';

// const AgentDetailsModal = ({ isOpen, onClose, agent, category }) => {
//   const navigate = useNavigate();

//   if (!agent || !category) return null;

//   const handleTryAgent = () => {
//     navigate(`/agent-playground/agent/${agent.id}`);
//   };

//   // Get other agents in the same category (excluding current agent)
//   const otherAgents = category.agents?.filter(a => a.id !== agent.id) || [];

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-[100] overflow-y-auto" style={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}>
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 backdrop-blur-sm"
//             onClick={onClose}
//           />

//           {/* Modal Container - Positioned relative to viewport */}
//           <div className="relative min-h-screen flex items-start justify-center pt-20 pb-10 px-4">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 30 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 30 }}
//               transition={{ duration: 0.2, ease: 'easeOut' }}
//               onClick={(e) => e.stopPropagation()}
//               className="relative bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-5xl max-h-[75vh] flex flex-col"
//             >
//               {/* Header */}
//               <div className="text-white text-center py-4 px-6 rounded-t-lg border-b border-gray-200 flex items-center justify-between" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-lg font-bold" style={{ color: '#1E3A8A' }}>
//                     {agent.name.charAt(0)}
//                   </div>
//                   <div className="text-left">
//                     <h2 className="text-xl font-semibold text-white">{agent.name}</h2>
//                     {/* <p className="text-sm text-blue-200">{category.name}</p> */}
//                     {/* <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                       {agent.status || 'Available'}
//                     </span> */}
//                   </div>
//                 </div>
//                 <button
//                   onClick={onClose}
//                   className="text-blue-200 hover:text-white transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               {/* Content */}
//               <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#F9FAFB' }}>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                   {/* Main Content */}
//                   <div className="lg:col-span-2 space-y-6">
//                     {/* Agent Overview */}
//                     <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
//                       <div className="border-b border-gray-200 pb-3 mb-3">
//                         <h4 className="text-md font-medium mb-2" style={{ color: '#1E3A8A' }}>Overview</h4>
//                       </div>
//                       <p className="text-gray-900 leading-relaxed text-md">
//                         {agent.description}
//                       </p>
//                     </div>

//                     {/* Related Agents Cards */}
//                     {otherAgents.length > 0 && (
//                       <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
//                         <h4 className="text-md font-medium mb-4" style={{ color: '#1E3A8A' }}>Related Agents</h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                           {otherAgents.slice(0, 6).map((relatedAgent) => (
//                             <div key={relatedAgent.id} className="bg-gray-50 rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200 border border-gray-200">
//                               {/* Agent Icon */}
//                               <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-white" style={{ backgroundColor: '#1E3A8A' }}>
//                                 <span className="text-lg font-bold">
//                                   {relatedAgent.name.charAt(0)}
//                                 </span>
//                               </div>

//                               {/* Agent Info */}
//                               <h5 className="text-sm font-medium text-gray-800 mb-2 line-clamp-1">
//                                 {relatedAgent.name}
//                               </h5>
//                               <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
//                                 {relatedAgent.description}
//                               </p>

//                               {/* Action Buttons */}
//                               <div className="flex space-x-2">
//                                 <button
//                                   onClick={() => navigate(`/agent-playground/agent/${relatedAgent.id}`)}
//                                   className="flex-1 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors hover:opacity-90"
//                                   style={{ backgroundColor: '#1E3A8A' }}
//                                 >
//                                   Try Agent
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     window.location.reload();
//                                     console.log('View agent:', relatedAgent.id);
//                                   }}
//                                   className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50 transition-colors"
//                                 >
//                                   View
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Sidebar */}
//                   <div className="lg:col-span-1">
//                     <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 h-full">
//                       <h4 className="text-md font-medium mb-4" style={{ color: '#1E3A8A' }}>Quick Actions</h4>

//                       <div className="space-y-3 mb-6">
//                         <button
//                           onClick={handleTryAgent}
//                           className="w-full text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm hover:opacity-90"
//                           style={{ backgroundColor: '#1E3A8A' }}
//                         >
//                           Try Our Agent
//                         </button>
//                         <button
//                           onClick={onClose}
//                           className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default AgentDetailsModal;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/store';
import agentsData from '../../../../public/data/agentsData';

const AgentDetailsPage = () => {
  const navigate = useNavigate();
  const { agentId } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [agent, setAgent] = useState(null);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    // Find the agent and its category
    const findAgentInData = () => {
      const allCategories = [...(agentsData.foundational || []), ...(agentsData.industry || [])];
      
      for (const cat of allCategories) {
        // Check if agent is directly in category
        if (cat.agents) {
          const foundAgent = cat.agents.find(a => a.id === agentId);
          if (foundAgent) {
            setAgent(foundAgent);
            setCategory(cat);
            setIsLoading(false);
            return;
          }
        }
        
        // Check in subcategories
        if (cat.subCategories) {
          for (const subCat of cat.subCategories) {
            if (subCat.agents) {
              const foundAgent = subCat.agents.find(a => a.id === agentId);
              if (foundAgent) {
                setAgent(foundAgent);
                setCategory(cat);
                setIsLoading(false);
                return;
              }
            }
          }
        }
      }
      
      // Agent not found
      setIsLoading(false);
    };

    findAgentInData();
  }, [agentId, isAuthenticated, navigate]);

  const handleTryAgent = () => {
    navigate(`/agent-playground/agent/${agent.id}`);
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Get other agents in the same category (excluding current agent)
  const getOtherAgents = () => {
    if (!category) return [];
    
    let allAgents = [];
    if (category.agents) {
      allAgents = [...category.agents];
    }
    if (category.subCategories) {
      category.subCategories.forEach(subCat => {
        if (subCat.agents) {
          allAgents = [...allAgents, ...subCat.agents];
        }
      });
    }
    
    return allAgents.filter(a => a.id !== agent?.id);
  };

  const otherAgents = getOtherAgents();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-6 text-blue-600 font-medium text-lg">Loading agent details...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agent Not Found</h2>
          <p className="text-gray-600 mb-6">The requested agent could not be found.</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button - Fixed Position */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 px-4 py-2 bg-white shadow-md rounded-lg hover:shadow-lg transition-all duration-200 border border-gray-200"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-gray-700 font-medium">Back</span>
        </button>
      </div>

      {/* Hero Section with Background Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(29, 78, 216, 0.9)), url('/images/AgentFrame.png')",
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-8 left-8 w-16 h-16 bg-white bg-opacity-20 rounded-lg transform rotate-12"></div>
        <div className="absolute top-12 right-20 w-12 h-12 bg-white bg-opacity-15 rounded-lg transform -rotate-45"></div>
        <div className="absolute bottom-16 left-16 w-20 h-20 bg-white bg-opacity-10 rounded-lg transform rotate-45"></div>
        <div className="absolute bottom-8 right-16 w-8 h-8 bg-white bg-opacity-25 rounded-lg"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          {/* Agent Category Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-blue-500 bg-opacity-80 text-white text-sm font-medium rounded-full mb-4"
          >
            Foundation Agent
          </motion.div>

          {/* Agent Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
          >
            {agent.heading && agent.heading[0] ? agent.heading[0] : agent.name}
          </motion.h1>

          {/* Agent Subtitle/Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-white text-opacity-90 mb-8 max-w-4xl leading-relaxed"
          >
            {agent.summary || 'An AI-powered agent that extracts structured metadata and summaries from PDF and Excel files'}
          </motion.p>

          {/* Try Now Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            onClick={handleTryAgent}
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Try Now
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Agent Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Overview</h3>
              </div>
              <div className="prose prose-gray max-w-none">
                {agent.description && agent.description.length > 0 ? (
                  agent.description.map((desc, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {desc}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {agent.summary || 'No description available.'}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Solutions & Use Cases */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Solutions */}
              {agent.solutions && agent.solutions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Solutions</h4>
                  <ul className="space-y-3">
                    {agent.solutions.map((solution, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Use Cases */}
              {agent.useCases && agent.useCases.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Use Cases</h4>
                  <ul className="space-y-3">
                    {agent.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h4>

              <div className="space-y-4 mb-8">
                <button
                  onClick={handleTryAgent}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  Try Our Agent
                </button>
                <button
                  onClick={handleBack}
                  className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Go Back
                </button>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsPage;