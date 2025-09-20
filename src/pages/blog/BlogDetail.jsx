import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Calendar, RefreshCw, Link } from 'lucide-react';
import { AiOutlineYoutube } from 'react-icons/ai';
import { LuLinkedin } from 'react-icons/lu';
import { FaInstagram } from 'react-icons/fa6';

// Import blog data
import supplyChainData from '../../data/Blog/supplyChain.json';
import itData from '../../data/Blog/it.json';
import healthCareData from '../../data/Blog/healthCare.json';
import insuranceData from '../../data/Blog/insuranc.json';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [activeSection, setActiveSection] = useState('');

  const blogDataMap = {
    'supply-chain-1': supplyChainData,
    'information-technology-1': itData,
    'healthcare-1': healthCareData,
    'human-resource-1': itData,
    'insurance-1': insuranceData
  };

  useEffect(() => {
    const blogData = blogDataMap[id];
    if (blogData) {
      setBlog({
        id,
        title: blogData.title,
        content: blogData,
        date: "April 1, 2025",
        updatedDate: "April 24, 2025",
        readTime: "7min reading"
      });
    }
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h2>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  const { title, content, date, updatedDate, readTime } = blog;

  // Generate navigation anchors based on content structure
  const getNavigationAnchors = (content) => {
    const anchors = [];
    
    if (content.challenge) {
      anchors.push({ id: 'challenge', title: 'Challenge' });
    }
    if (content.smart_supply_chain || content.what_is_agentic_ai || content.how_ai_transforms_risk_assessment) {
      anchors.push({ id: 'solution', title: 'Solution' });
    }
    if (content.benefits || content.benefits_for_organizations) {
      anchors.push({ id: 'benefits', title: 'Benefits' });
    }
    if (content.industry_examples || content.key_applications) {
      anchors.push({ id: 'examples', title: 'Examples' });
    }
    if (content.road_ahead || content.the_road_ahead) {
      anchors.push({ id: 'future', title: 'Future' });
    }
    
    return anchors;
  };

  const navigationAnchors = getNavigationAnchors(content);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const renderContent = () => {
    const sections = [];

    // Introduction
    if (content.introduction) {
      sections.push(
        <div key="introduction" className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            {content.introduction.context || content.introduction.overview}
          </p>
          {content.introduction.impact && (
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Impact:</strong> {content.introduction.impact}
            </p>
          )}
          {content.introduction.shift && (
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Shift:</strong> {content.introduction.shift}
            </p>
          )}
        </div>
      );
    }

    // Challenge section
    if (content.challenge) {
      sections.push(
        <div key="challenge" id="challenge" className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {content.challenge.description}
          </p>
          {content.challenge.risks && (
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {content.challenge.risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          )}
          {content.challenge.problem && (
            <p className="text-gray-700 leading-relaxed mt-4 font-medium">
              {content.challenge.problem}
            </p>
          )}
        </div>
      );
    }

    // Solution sections
    if (content.smart_supply_chain) {
      sections.push(
        <div key="solution" id="solution" className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Supply Chain Solution</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {content.smart_supply_chain.definition}
          </p>
          {content.smart_supply_chain.capabilities && (
            <div className="space-y-4">
              {content.smart_supply_chain.capabilities.map((capability, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{capability.name}</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {capability.functions.map((func, funcIndex) => (
                      <li key={funcIndex}>{func}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (content.what_is_agentic_ai) {
      sections.push(
        <div key="solution" id="solution" className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">What is Agentic AI?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {content.what_is_agentic_ai.definition}
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            {content.what_is_agentic_ai.differences_from_traditional_ai}
          </p>
          {content.what_is_agentic_ai.capabilities && (
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              {content.what_is_agentic_ai.capabilities.map((capability, index) => (
                <li key={index}>{capability}</li>
              ))}
            </ul>
          )}
          <p className="text-gray-700 leading-relaxed font-medium">
            {content.what_is_agentic_ai.impact}
          </p>
        </div>
      );
    }

    if (content.how_ai_transforms_risk_assessment) {
      sections.push(
        <div key="solution" id="solution" className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">How AI Transforms Risk Assessment</h3>
          <div className="space-y-4">
            {content.how_ai_transforms_risk_assessment.map((section, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{section.section}</h4>
                <p className="text-gray-700 leading-relaxed mb-2">{section.description}</p>
                {section.example && (
                  <p className="text-gray-600 text-sm mb-2"><em>Example: {section.example}</em></p>
                )}
                <p className="text-gray-700 font-medium">{section.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Benefits
    if (content.benefits || content.benefits_for_organizations) {
      const benefits = content.benefits || content.benefits_for_organizations;
      sections.push(
        <div key="benefits" id="benefits" className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      );
    }

    // Examples
    if (content.industry_examples || content.key_applications) {
      sections.push(
        <div key="examples" id="examples" className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {content.industry_examples ? 'Industry Examples' : 'Key Applications'}
          </h3>
          {content.industry_examples && (
            <div className="space-y-4">
              {Object.entries(content.industry_examples).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 capitalize">
                    {key.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
          )}
          {content.key_applications && (
            <div className="space-y-4">
              {content.key_applications.map((app, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{app.application}</h4>
                  <p className="text-gray-700">{app.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Future/Road Ahead
    if (content.road_ahead || content.the_road_ahead) {
      const roadAhead = content.road_ahead || content.the_road_ahead;
      sections.push(
        <div key="future" id="future" className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">The Road Ahead</h3>
          {roadAhead.vision && (
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Vision:</strong> {roadAhead.vision}
            </p>
          )}
          {roadAhead.warning && (
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Warning:</strong> {roadAhead.warning}
            </p>
          )}
          {roadAhead.future_focus && (
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Future Focus:</strong> {roadAhead.future_focus}
            </p>
          )}
          {roadAhead.closing_statement && (
            <p className="text-gray-700 leading-relaxed font-medium">
              {roadAhead.closing_statement}
            </p>
          )}
        </div>
      );
    }

    return sections;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 xs:px-5 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-[1480px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Breadcrumb */}
                <nav className="mb-6">
                  <button
                    onClick={() => navigate('/blog')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Resources &gt; Blog
                  </button>
                </nav>

                {/* Blog Metadata */}
                <div className="mb-8">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    {readTime}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Published on {date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Updated on {updatedDate}
                  </div>
                </div>

                {/* Navigation Anchors */}
                {navigationAnchors.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Table of Contents</h4>
                    <nav className="space-y-2">
                      {navigationAnchors.map((anchor) => (
                        <button
                          key={anchor.id}
                          onClick={() => scrollToSection(anchor.id)}
                          className={`block text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                            activeSection === anchor.id
                              ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {anchor.title}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <article>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {title}
                </h1>
                
                <div className="prose prose-lg max-w-none">
                  {renderContent()}
                </div>
              </article>
            </div>

            {/* Right Sidebar - Social Media */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
                  <div className="flex justify-center space-x-4">
                    <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                      <Link className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                      <LuLinkedin className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                      <FaInstagram className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                      <AiOutlineYoutube className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
