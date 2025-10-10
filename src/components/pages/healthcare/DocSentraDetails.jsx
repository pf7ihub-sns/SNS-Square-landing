import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/store';
import { 
  Users, 
  FileText, 
  Brain, 
  Shield, 
  Clock, 
  TrendingUp,
  Heart,
  UserCheck,
  FileCheck,
  Pill,
  Stethoscope,
  Database
} from 'lucide-react';

const DocSentraDetails = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }
  }, [isAuthenticated, navigate]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTryAgent = () => {
    navigate('/agent-playground/agent/Doc-Sentra');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const docSentraData = {
    name: "DocSentra",
    heading: "AI-Driven Healthcare Automation Platform",
    summary: "AI-driven healthcare automation platform integrating clinical intelligence, conversational AI, and smart workflow management to enhance patient care, diagnosis accuracy, and operational efficiency.",
    solutions: [
      "Doctor Assistant",
      "Patient Management", 
      "Medical Documentation",
      "Prescription Management",
      "Clinical Decision Support",
      "Health Record Management"
    ],
    features: [
      "Intelligent Clinical Decision Support",
      "Automated Medical Documentation",
      "Real-time Patient Monitoring",
      "Prescription Management System",
      "HIPAA-Compliant Data Handling",
      "Multi-language Support",
      "Integration with EHR Systems",
      "Advanced Analytics Dashboard"
    ],
    useCases: [
      {
        icon: <Heart className="w-6 h-6" />,
        title: "Patient Care Enhancement",
        description: "Streamline patient interactions and improve care quality through AI-powered assistance and real-time monitoring."
      },
      {
        icon: <FileText className="w-6 h-6" />,
        title: "Clinical Documentation",
        description: "Automate medical record creation and maintenance with intelligent transcription and data entry."
      },
      {
        icon: <Brain className="w-6 h-6" />,
        title: "Decision Support",
        description: "Provide evidence-based treatment recommendations and diagnostic assistance to healthcare professionals."
      },
      {
        icon: <Users className="w-6 h-6" />,
        title: "Workflow Optimization",
        description: "Enhance hospital operations and clinic workflow efficiency through intelligent automation."
      },
      {
        icon: <Pill className="w-6 h-6" />,
        title: "Prescription Management",
        description: "Streamline medication prescribing with drug interaction checks and dosage recommendations."
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "Performance Analytics",
        description: "Track healthcare metrics and operational performance with comprehensive reporting tools."
      }
    ],
    benefits: [
      {
        icon: <Shield className="w-6 h-6" />,
        title: "Enhanced Patient Safety"
      },
      {
        icon: <Clock className="w-6 h-6" />,
        title: "Reduced Processing Time"
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "Improved Efficiency"
      },
      {
        icon: <Brain className="w-6 h-6" />,
        title: "AI-Powered Insights"
      }
    ],
    howItWorks: {
      title: "How DocSentra Works",
      steps: [
        {
          number: "01",
          title: "Patient Intake",
          description: "AI-powered patient registration and initial assessment with automated data collection and verification."
        },
        {
          number: "02", 
          title: "Clinical Analysis",
          description: "Advanced clinical intelligence analyzes patient data and provides diagnostic support to healthcare professionals."
        },
        {
          number: "03",
          title: "Treatment Planning",
          description: "Generate personalized treatment plans with evidence-based recommendations and medication management."
        },
        {
          number: "04",
          title: "Documentation & Follow-up",
          description: "Automated documentation generation and intelligent scheduling for follow-up appointments and care continuity."
        }
      ]
    }
  };

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
        <div className="w-full max-w-6xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-5 py-2 border-1 border-[#155DFC] bg-transparent text-blue-600 text-[16px] font-semibold rounded-full mb-8 mt-8"
          >
            Healthcare Industry Agent
          </motion.div>

          <div className="flex justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight px-4 max-w-4xl text-center"
            >
              {docSentraData.heading}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-[#6E757E] mb-10 max-w-2xl mx-auto leading-relaxed px-4"
          >
            {docSentraData.summary}
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

        {/* Solutions Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="mb-12">
            <div className="inline-block border-b-4 border-blue-500 pb-2">
              <h2 className="text-2xl font-medium text-[#000]">Core Solutions</h2>
            </div>
          </div>

          <div className="px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Title and Description */}
              <div className="pr-8">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Comprehensive Healthcare Automation
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed text-justify">
                  DocSentra provides a complete suite of AI-powered healthcare solutions designed to streamline clinical workflows, 
                  enhance patient care, and improve operational efficiency. Our platform integrates seamlessly with existing 
                  healthcare systems to deliver intelligent automation across all aspects of medical practice.
                </p>
              </div>

              {/* Right Column - Solutions */}
              <div className="space-y-5">
                {docSentraData.solutions.map((solution, index) => {
                  const icons = [
                    <UserCheck className="w-4 h-4 text-white" />,
                    <Users className="w-4 h-4 text-white" />,
                    <FileText className="w-4 h-4 text-white" />,
                    <Pill className="w-4 h-4 text-white" />,
                    <Stethoscope className="w-4 h-4 text-white" />,
                    <Database className="w-4 h-4 text-white" />
                  ];
                  
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                        {icons[index]}
                      </div>
                      <span className="text-lg text-[#000] leading-relaxed flex-1 font-medium">
                        {solution}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Use Cases Section */}
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
              Transforming Healthcare Operations
            </h3>
            <p className="text-[17px] text-[#3D3D3D] max-w-5xl mx-auto leading-relaxed">
              From patient management to clinical decision support, DocSentra streamlines every aspect of healthcare delivery 
              with intelligent automation and AI-powered insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
            {docSentraData.useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-sm transition-all">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {useCase.icon}
                  </div>
                  <h4 className="text-[17px] font-bold text-[#000]">{useCase.title}</h4>
                </div>
                <p className="text-[17px] text-[#3D3D3D] leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Why It Matters Section */}
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
              Revolutionizing Healthcare Delivery
            </h3>
            <p className="text-[17px] text-[#6B7280] max-w-4xl mx-auto leading-relaxed">
              DocSentra addresses critical healthcare challenges by providing intelligent automation, 
              reducing administrative burden, and improving patient outcomes through advanced AI capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {docSentraData.benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 text-white">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-medium text-[#000] mb-3 leading-tight">
                  {benefit.title}
                </h4>
              </div>
            ))}
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-8">
            <div className="inline-block border-b-4 border-blue-500 pb-2">
              <h2 className="text-2xl font-medium text-[#000]">{docSentraData.howItWorks.title}</h2>
            </div>
          </div>

          {/* Steps Navigation */}
          <div className="flex justify-center mb-12 overflow-x-auto">
            <div className="flex space-x-4 lg:space-x-8 min-w-fit">
              {docSentraData.howItWorks.steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className="relative pb-4 px-4 transition-all duration-300 border border-gray-200 rounded-xl shadow-lg bg-white min-w-[280px]"
                >
                  {/* Top border */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-2 rounded-t-xl transition-all duration-300 ${
                      activeStep === index ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />

                  <span className={`text-2xl font-bold block text-left mt-4 ${
                    activeStep === index ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.number}
                  </span>
                  <div className={`text-xl mt-1 font-medium text-left ${
                    activeStep === index ? 'text-[#000]' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <p className="text-[16px] mt-1 text-[#6E757E] text-left">
                    {step.description?.substring(0, 80)}...
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Content */}
          <div className="bg-[#EFF3FF] rounded-2xl p-8 lg:p-12 border border-blue-100">
            {docSentraData.howItWorks.steps[activeStep] && (
              <div>
                <div className="items-start space-x-6 mb-8">
                  <div className="mb-2 items-center justify-center">
                    <span className="text-[#155DFC] text-3xl font-bold">
                      {docSentraData.howItWorks.steps[activeStep].number}
                    </span>
                  </div>
                  <div className="inline-block">
                    <h4 className="text-3xl font-bold text-[#000] mb-2">
                      {docSentraData.howItWorks.steps[activeStep].title}
                    </h4>
                    <p className="text-lg text-[#6B7280] leading-relaxed">
                      {docSentraData.howItWorks.steps[activeStep].description}
                    </p>
                    <hr className="mt-5 border-t-2 border-[#C7C7C7]" />
                  </div>
                </div>

                {/* Features for each step */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
                  <div className="lg:col-span-1 space-y-4">
                    {docSentraData.features.slice(activeStep * 2, activeStep * 2 + 4).map((feature, idx) => (
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

                  {/* Healthcare themed image placeholder */}
                  <div className="lg:col-span-1 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 flex justify-center items-center w-full">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Heart className="w-16 h-16 text-white" />
                      </div>
                      <h5 className="text-lg font-semibold text-gray-800">Healthcare Innovation</h5>
                      <p className="text-sm text-gray-600 mt-1">AI-Powered Medical Solutions</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default DocSentraDetails;