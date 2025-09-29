
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/store';
import agentsData from '../../../../public/data/agentsDataView';

const AgentDetailsPage = () => {
  const navigate = useNavigate();
  const { agentId } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [agent, setAgent] = useState(null);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    const findAgentInData = () => {
      const allCategories = [...(agentsData.foundational || []), ...(agentsData.industry || [])];

      for (const cat of allCategories) {
        if (cat.agents) {
          const foundAgent = cat.agents.find(a => a.id === agentId);
          if (foundAgent) {
            setAgent(foundAgent);
            setCategory(cat);
            setIsLoading(false);
            return;
          }
        }
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

      setIsLoading(false);
    };

    findAgentInData();
  }, [agentId, isAuthenticated, navigate]);

  useEffect(() => {
    if (category) {
      const foundationalCategories = agentsData.foundational || [];
      const isFoundational = foundationalCategories.some(cat => cat.id === category.id);
      setActiveTab(isFoundational ? 'foundational' : 'industry');
    }
  }, [category]);

  const handleTryAgent = () => {
    navigate(`/agent-playground/agent/${agent.id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

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

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(29, 78, 216, 0.9)), url('/images/AgentFrame.png')",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-blue-500 bg-opacity-80 text-white text-sm font-medium rounded-full mb-4"
          >
            {activeTab === 'foundational' ? 'Foundation Agent' : 'Industry Agent'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight max-w-4xl"
          >
            {agent.heading || agent.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-white text-opacity-90 mb-8 max-w-3xl"
          >
            {agent.summary}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            onClick={handleTryAgent}
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Try Now
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* What It Is Section */}
        {agent.whatItIs && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="mb-8">
              <div className="inline-block border-b-4 border-blue-500 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">What It Is</h2>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {agent.whatItIs.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                {agent.whatItIs.description}
              </p>

              {agent.features && agent.features.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agent.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Use Cases Section */}
        {agent.useCases && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-20"
          >
            <div className="mb-8">
              <div className="inline-block border-b-4 border-blue-500 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">Use Cases</h2>
              </div>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {agent.useCases.title}
              </h3>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                {agent.useCases.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agent.useCases.cases.map((useCase, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{useCase.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Why It Matters Section */}
        {agent.whyItMatters && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-20"
          >
            <div className="mb-8">
              <div className="inline-block border-b-4 border-blue-500 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">Why it Matters</h2>
              </div>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {agent.whyItMatters.title}
              </h3>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                {agent.whyItMatters.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agent.whyItMatters.benefits.map((benefit, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-blue-100 hover:shadow-md transition-all">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* How It Works Section */}
        {agent.howItWorks && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-20"
          >
            <div className="mb-8">
              <div className="inline-block border-b-4 border-blue-500 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">{agent.howItWorks.title}</h2>
              </div>
            </div>

            {/* Steps Navigation */}
            <div className="flex justify-center mb-12 border-b border-gray-200">
              <div className="flex space-x-8">
                {agent.howItWorks.steps.map((step, index) => (
                  <button
                    key={index}
                    className="pb-4 px-2 border-b-2 border-blue-500 text-blue-600 font-medium"
                  >
                    <span className="text-sm">{step.number}</span>
                    <div className="text-base mt-1">{step.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Step Content */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 lg:p-12 border border-blue-100">
              {agent.howItWorks.steps[0] && (
                <div>
                  <div className="flex items-start space-x-6 mb-8">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {agent.howItWorks.steps[0].number}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-3xl font-bold text-gray-900 mb-4">
                        {agent.howItWorks.steps[0].title}
                      </h4>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {agent.howItWorks.steps[0].description}
                      </p>
                    </div>
                  </div>

                  {agent.howItWorks.steps[0].process && (
                    <div className="flex flex-wrap items-center justify-center gap-4 bg-white rounded-xl p-6">
                      {agent.howItWorks.steps[0].process.map((item, idx) => (
                        <React.Fragment key={idx}>
                          <div className="flex flex-col items-center space-y-2 p-4 bg-blue-50 rounded-lg border-2 border-blue-200 min-w-[140px]">
                            <span className="text-3xl">{item.icon}</span>
                            <span className="font-semibold text-gray-900 text-sm text-center">
                              {item.label}
                            </span>
                          </div>
                          {idx < agent.howItWorks.steps[0].process.length - 1 && (
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Related Agents Section */}
        {otherAgents.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Agents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherAgents.slice(0, 3).map((relatedAgent) => (
                <div key={relatedAgent.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-blue-600 text-xl font-bold">
                      {relatedAgent.name.charAt(0)}
                    </span>
                  </div>

                  <h5 className="font-bold text-gray-900 mb-2 text-lg">
                    {relatedAgent.name}
                  </h5>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {relatedAgent.summary}
                  </p>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/agent-playground/agent/${relatedAgent.id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Try Agent
                    </button>
                    <button
                      onClick={() => navigate(`/agent-details/${relatedAgent.id}`)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default AgentDetailsPage;