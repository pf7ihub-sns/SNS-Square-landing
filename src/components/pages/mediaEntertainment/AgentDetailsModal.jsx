
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/store';
import agentsData from '../../../../public/data/agentsDataView';
import Right from "../../../../public/images/rightclick.png";


const AgentDetailsPage = () => {
  const navigate = useNavigate();
  const { agentId } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [agent, setAgent] = useState(null);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

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
        className="relative w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bgall.png')",
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4 py-20 text-center ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-5 py-2 border-1 border-[#155DFC] bg-transparent text-blue-600 text-[16px] font-semibold rounded-full mb-8 mt-8"
          >
            {activeTab === 'foundational' ? 'Foundation Agent' : 'Industry Agent'}
          </motion.div>

          <div className="flex justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold 
               text-gray-900 mb-6 leading-tight px-4 max-w-4xl text-center"
            >
              {agent.heading || agent.name}
            </motion.h1>
          </div>


          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-[#6E757E] mb-10 max-w-2xl mx-auto leading-relaxed px-4"
          >
            {agent.summary}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            onClick={handleTryAgent}
            className="inline-flex items-center px-11 py-3 bg-gradient-to-r from-blue-600 to-blue-400 hover:bg-blue-700 text-white text-base font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Try Now
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
            <div className="mb-12">
              <div className="inline-block border-b-4 border-blue-500 pb-2">
                <h2 className="text-2xl font-medium text-[#000]">What It Is</h2>
              </div>
            </div>

            <div className="px-6 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Title and Description */}
                <div className="pr-8">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight break-words">
                    {agent.whatItIs.title}
                  </h3>

                  <p className="text-lg text-gray-600 leading-relaxed text-justify">
                    {agent.whatItIs.description}
                  </p>
                </div>

                {/* Right Column - Features in single column */}
                {agent.features && agent.features.length > 0 && (
                  <div className="space-y-5">
                    {agent.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                          <img src={Right} alt="" />
                        </div>
                        <span className="text-lg text-[#000] leading-relaxed flex-1 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
            <div className="text-center mb-8">
              <div className="inline-block border-b-4 border-blue-500 pb-2">
                <h2 className="text-2xl font-medium text-[#000]">Use Cases</h2>
              </div>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-[#000] mb-4">
                {agent.useCases.title}
              </h3>
              <p className="text-[17px] text-[#3D3D3D] max-w-5xl mx-auto leading-relaxed">
                {agent.useCases.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
              {agent.useCases.cases.map((useCase, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-4xl">
                      {typeof useCase.icon === 'string' && useCase.icon.startsWith('/') ? (
                        <img src={useCase.icon} alt={useCase.title} className="w-9 h-9 object-contain" />
                      ) : (
                        useCase.icon
                      )}
                    </div>
                    <h4 className="text-[17px] font-bold text-[#000]">{useCase.title}</h4>
                  </div>
                  <p className="text-[17px] text-[#3D3D3D] leading-relaxed">{useCase.description}</p>
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
            <div className="text-center mb-8">
              <div className="inline-block border-b-4 border-blue-500 pb-2">
                <h2 className="text-2xl font-medium text-[#000]">Why It Matters</h2>
              </div>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-[#000] mb-6">
                {agent.whyItMatters.title}
              </h3>
              <p className="text-[17px] text-[#6B7280] max-w-4xl mx-auto leading-relaxed">
                {agent.whyItMatters.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agent.whyItMatters.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    {typeof benefit.icon === 'string' && benefit.icon.startsWith('/') ? (
                      <img src={benefit.icon} alt={benefit.title} className="w-6 h-6 object-contain" />
                    ) : (
                      <span className="text-white text-2xl">{benefit.icon}</span>
                    )}
                  </div>
                  <h4 className="text-lg  font-medium text-[#000] mb-3 leading-tight">
                    {benefit.title}
                  </h4>
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
            <div className="text-center mb-8">
              <div className="inline-block border-b-4 border-blue-500 pb-2">
                <h2 className="text-2xl font-medium text-[#000]">{agent.howItWorks.title}</h2>
              </div>
            </div>

            {/* Steps Navigation */}
            <div className="flex justify-center mb-12">
              <div className="flex space-x-8">
                {agent.howItWorks.steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className="relative pb-4 px-4 transition-all duration-300 border border-gray-200 rounded-xl shadow-lg bg-white"
                  >
                    {/* Top border */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-2 rounded-t-xl transition-all duration-300 ${activeStep === index
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                        }`}
                    />


                    <span className={`text-2xl font-bold block text-left mt-4 ${activeStep === index ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                      {step.number}
                    </span>
                    <div className={`text-xl mt-1 font-medium text-left  ${activeStep === index ? 'text-[#000]' : 'text-gray-500'
                      }`}>
                      {step.title}
                    </div>
                    <p className="text-[18px] mt-1 text-[#6E757E] text-left">
                      {step.description?.substring(0, 80)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Step Content */}
            <div className="bg-[#EFF3FF] rounded-2xl p-8 lg:p-12 border border-blue-100">
              {agent.howItWorks.steps[activeStep] && (
                <div>
                  <div className=" items-start space-x-6 mb-8">
                    <div className=" mb-2  items-center justify-center ">
                      <span className="text-[#155DFC] text-3xl font-bold">
                        {agent.howItWorks.steps[activeStep].number}
                      </span>
                    </div>
                    <div className=" inline-block ">
                      <h4 className="text-3xl font-bold text-[#000] mb-2">
                        {agent.howItWorks.steps[activeStep].title}
                      </h4>
                      <p className="text-lg text-[#6B7280] leading-relaxed">
                        {agent.howItWorks.steps[activeStep].description}
                      </p>
                      <hr className='mt-5 border-t-2 border-[#C7C7C7]' />
                    </div>
                  </div>

                  {/* Process Flow - Only for step 1 (Architecture Overview) */}
                  {agent.howItWorks.steps[activeStep].process && (
                    <div className="flex flex-wrap items-center justify-center gap-4  rounded-xl p-6">
                      {agent.howItWorks.steps[activeStep].process.map((item, idx) => (
                        <React.Fragment key={idx}>
                          <div className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-md border border-gray-100 min-w-[200px]">
                            {item.isImage ? (
                              <img
                                src={item.icon}
                                alt={item.label}
                                className="w-7 h-7 object-contain flex-shrink-0"
                              />
                            ) : (
                              <span className="text-xl flex-shrink-0">{item.icon}</span>
                            )}
                            <span className="font-medium text-gray-900 text-base text-left leading-snug max-w-[160px]">
                              {item.label}
                            </span>
                          </div>
                          {idx < agent.howItWorks.steps[activeStep].process.length - 1 && (
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {agent.howItWorks.steps[activeStep].features && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
                      {/* Left side - Features (spans 1 column) */}
                      <div className="lg:col-span-1 space-y-4">
                        {agent.howItWorks.steps[activeStep].features.map((feature, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-base text-[#000] leading-relaxed font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Right side - Image (spans 1 column, aligned to the top right) */}
                      {agent.howItWorks.steps[activeStep].image && (
                        <div className="lg:col-span-1 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-2 flex justify-end w-full">
                          <img
                            src={agent.howItWorks.steps[activeStep].image}
                            alt={agent.howItWorks.steps[activeStep].title}
                            className="w-full h-auto rounded-lg max-w-[400px]"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default AgentDetailsPage;