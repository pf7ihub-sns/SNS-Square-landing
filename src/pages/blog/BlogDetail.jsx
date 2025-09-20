import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [blog, setBlog] = useState(null);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState({});
  const [navigationAnchors, setNavigationAnchors] = useState([]);
  const sectionIdsRef = useRef([]);
  const scrollHandlerRef = useRef(null);

  const blogDataMap = {
    'supply-chain-1': Array.isArray(supplyChainData) ? supplyChainData[0] : supplyChainData,
    'information-technology-1': Array.isArray(itData) ? itData[0] : itData,
    'healthcare-1': Array.isArray(healthCareData) ? healthCareData[0] : healthCareData,
    'human-resource-1': Array.isArray(itData) ? itData[0] : itData,
    'insurance-1': Array.isArray(insuranceData) ? insuranceData[0] : insuranceData,
    // Legacy support for old IDs
    'supply-chain-main': Array.isArray(supplyChainData) ? supplyChainData[0] : supplyChainData,
    'information-technology-main': Array.isArray(itData) ? itData[0] : itData,
    'healthcare-main': Array.isArray(healthCareData) ? healthCareData[0] : healthCareData,
    'human-resource-main': Array.isArray(itData) ? itData[0] : itData,
    'insurance-main': Array.isArray(insuranceData) ? insuranceData[0] : insuranceData
  };

  // Function to find blog data based on ID pattern
  const findBlogData = useCallback((blogId) => {
    // First try direct lookup
    if (blogDataMap[blogId]) {
      return {
        data: blogDataMap[blogId],
        type: 'main'
      };
    }

    // Handle multiple blog entries from same category (e.g., supply-chain-2, supply-chain-3)
    const multiBlogMatch = blogId.match(/^(.+)-(\d+)$/);
    if (multiBlogMatch) {
      const category = multiBlogMatch[1];
      const blogIndex = parseInt(multiBlogMatch[2]) - 1; // Convert to 0-based index
      

      
      // Map category names to data arrays
      const categoryDataMap = {
        'supply-chain': supplyChainData,
        'information-technology': itData,
        'healthcare': healthCareData,
        'human-resource': itData,
        'insurance': insuranceData
      };
      
      const dataArray = categoryDataMap[category];
      if (dataArray && Array.isArray(dataArray) && dataArray[blogIndex]) {
        return {
          data: dataArray[blogIndex],
          type: 'main'
        };
      }
    }

    // Handle app-specific entries (e.g., supply-chain-app-1)
    const appMatch = blogId.match(/^(.+)-app-(\d+)$/);
    if (appMatch) {
      const baseId = appMatch[1];
      const appIndex = parseInt(appMatch[2]) - 1;
      const baseData = blogDataMap[baseId];
      
      if (baseData) {
        const applications = baseData.key_applications || baseData.smart_supply_chain?.capabilities || [];
        if (applications[appIndex]) {
          return {
            data: {
              ...baseData,
              focus: applications[appIndex],
              title: applications[appIndex].application || applications[appIndex].name || `${baseData.title} - Application ${appIndex + 1}`
            },
            type: 'app'
          };
        }
      }
    }

    // Handle benefits entries (e.g., supply-chain-benefits)
    const benefitsMatch = blogId.match(/^(.+)-benefits$/);
    if (benefitsMatch) {
      const baseId = benefitsMatch[1];
      const baseData = blogDataMap[baseId];
      
      if (baseData) {
        return {
          data: {
            ...baseData,
            focus: 'benefits',
            title: `${baseData.title} - Key Benefits & Insights`
          },
          type: 'benefits'
        };
      }
    }

    return null;
  }, []);

  // Load blog data
  useEffect(() => {
    
    // If no ID, use a default blog for testing
    const blogId = id || 'supply-chain-1';
    const blogResult = findBlogData(blogId);
    
    if (blogResult) {
      setBlog({
        id: blogId,
        title: blogResult.data.title,
        content: blogResult.data,
        date: "April 1, 2025",
        updatedDate: "April 24, 2025",
        readTime: "7min reading"
      });
    } else {
      setBlog(null);
    }
  }, [id, findBlogData]);

  // Handle navigation when location changes
  useEffect(() => {
    const nonBlogPaths = ['/', '/about-us', '/life-at-sns', '/careers', '/agent-workbench', '/usecase'];
    
    const shouldNavigateAway = nonBlogPaths.some(path => 
      location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path))
    );
    
    if (shouldNavigateAway) {
      setTimeout(() => {
        window.location.href = location.pathname;
      }, 0);
    }
  }, [location.pathname]);

  // Generate navigation anchors based on content structure
  const getNavigationAnchors = useCallback((content) => {
    if (!content) return [];
    
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
  }, []);

  // Initialize navigation anchors when blog content changes
  useEffect(() => {
    if (blog && blog.content) {
      const anchors = getNavigationAnchors(blog.content);
      setNavigationAnchors(anchors);
      
      if (anchors.length > 0) {
        const progress = {};
        anchors.forEach(anchor => {
          progress[anchor.id] = 0;
        });
        setScrollProgress(progress);
        setActiveSection(anchors[0].id);
        sectionIdsRef.current = anchors.map(anchor => anchor.id);
      }
    }
  }, [blog, getNavigationAnchors]);

  // Create scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const currentSectionIds = sectionIdsRef.current;
      if (currentSectionIds.length === 0) return;

      let currentActiveSection = '';
      const navbarHeight = 160;

      setScrollProgress(prevProgress => {
        const newProgress = {};
        
        currentSectionIds.forEach(sectionId => {
          newProgress[sectionId] = 0;
        });

        currentSectionIds.forEach((sectionId) => {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            const heading = element.querySelector('h3');
            const headingRect = heading ? heading.getBoundingClientRect() : rect;
            
            if (headingRect.top <= navbarHeight) {
              currentActiveSection = sectionId;
            }
            
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            const sectionHeight = rect.height;
            
            if (sectionBottom < navbarHeight) {
              newProgress[sectionId] = 100;
            } else if (sectionTop < navbarHeight && sectionBottom > navbarHeight) {
              const scrolledAmount = navbarHeight - sectionTop;
              const progress = (scrolledAmount / sectionHeight) * 100;
              newProgress[sectionId] = Math.min(100, Math.max(0, progress));
            } else {
              newProgress[sectionId] = 0;
            }
          }
        });

        return newProgress;
      });

      if (currentActiveSection) {
        setActiveSection(currentActiveSection);
      }
    };

    scrollHandlerRef.current = handleScroll;
  }, []);

  // Set up scroll listener
  useEffect(() => {
    if (blog && scrollHandlerRef.current) {
      const handleScroll = scrollHandlerRef.current;
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      setTimeout(() => {
        handleScroll();
      }, 100);

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [blog]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 160;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h2>
          <p className="text-gray-600 mb-4">ID: {id}</p>
          <button
            onClick={() => navigate('/resources/blog')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  const { title, content, date, updatedDate, readTime } = blog;

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
        <section key="challenge" id="challenge" className="space-y-6 progress-section scroll-mt-40">
          <h3 className="text-xl font-medium text-gray-900 leading-tight">The Challenge</h3>
          <div className="text-base sm:text-lg text-gray-600 leading-relaxed space-y-4 pt-4">
            <p>{content.challenge.description}</p>
            {content.challenge.risks && (
              <ul className="list-disc list-inside space-y-2 ml-4">
                {content.challenge.risks.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
            )}
            {content.challenge.problem && (
              <p className="font-medium">{content.challenge.problem}</p>
            )}
          </div>
        </section>
      );
    }

    // Solution sections
    if (content.smart_supply_chain) {
      sections.push(
        <section key="solution" id="solution" className="space-y-6 progress-section scroll-mt-40">
          <h3 className="text-xl font-medium text-gray-900 leading-tight">Smart Supply Chain Solution</h3>
          <div className="text-base sm:text-lg text-gray-600 leading-relaxed space-y-4 pt-4">
            <p>{content.smart_supply_chain.definition}</p>
            {content.smart_supply_chain.capabilities && (
              <div className="space-y-4">
                {content.smart_supply_chain.capabilities.map((capability, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">{capability.name}</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {capability.functions.map((func, funcIndex) => (
                        <li key={funcIndex}>{func}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );
    }

    if (content.what_is_agentic_ai) {
      sections.push(
        <section key="solution" id="solution" className="space-y-6 progress-section scroll-mt-40">
          <h3 className="text-xl font-medium text-gray-900 leading-tight">What is Agentic AI?</h3>
          <div className="text-base sm:text-lg text-gray-600 leading-relaxed space-y-4 pt-4">
            <p>{content.what_is_agentic_ai.definition}</p>
            <p>{content.what_is_agentic_ai.differences_from_traditional_ai}</p>
            {content.what_is_agentic_ai.capabilities && (
              <ul className="list-disc list-inside space-y-2">
                {content.what_is_agentic_ai.capabilities.map((capability, index) => (
                  <li key={index}>{capability}</li>
                ))}
              </ul>
            )}
            <p className="font-medium">{content.what_is_agentic_ai.impact}</p>
          </div>
        </section>
      );
    }

    if (content.how_ai_transforms_risk_assessment) {
      sections.push(
        <section key="solution" id="solution" className="space-y-6 progress-section scroll-mt-40">
          <h3 className="text-xl font-medium text-gray-900 leading-tight">How AI Transforms Risk Assessment</h3>
          <div className="text-base sm:text-lg text-gray-600 leading-relaxed space-y-4 pt-4">
            <div className="space-y-4">
              {content.how_ai_transforms_risk_assessment.map((section, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2">{section.section}</h5>
                  <p className="leading-relaxed mb-2">{section.description}</p>
                  {section.example && (
                    <p className="text-sm mb-2"><em>Example: {section.example}</em></p>
                  )}
                  <p className="font-medium">{section.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // Benefits
    if (content.benefits || content.benefits_for_organizations) {
      const benefits = content.benefits || content.benefits_for_organizations;
      sections.push(
        <section key="benefits" id="benefits" className="space-y-6 progress-section scroll-mt-40">
          <h3 className="text-xl font-medium text-gray-900 leading-tight">Benefits</h3>
          <div className="text-base sm:text-lg text-gray-600 leading-relaxed space-y-4 pt-4">
            <ul className="list-disc list-inside space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        </section>
      );
    }

    // Examples
    if (content.industry_examples || content.key_applications) {
      sections.push(
        <section key="examples" id="examples" className="space-y-6 progress-section scroll-mt-40">
          <h3 className="text-xl font-medium text-gray-900 leading-tight">
            {content.industry_examples ? 'Industry Examples' : 'Key Applications'}
          </h3>
          <div className="text-base sm:text-lg text-gray-600 leading-relaxed space-y-4 pt-4">
            {content.industry_examples && (
              <div className="space-y-4">
                {Object.entries(content.industry_examples).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-gray-900 mb-3 capitalize">
                      {key.replace(/_/g, ' ')}
                    </h5>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            )}
            {content.key_applications && (
              <div className="space-y-4">
                {content.key_applications.map((app, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">{app.application}</h5>
                    <p>{app.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

      // Add second image after examples if it exists
      if (content.image2) {
        sections.push(
          <div key="image2" className="mb-12 rounded-lg overflow-hidden">
            <img 
              src={content.image2} 
              alt={`${title} - Additional Content`}
              className="w-full h-auto object-cover"
            />
          </div>
        );
      }
    }

    // Future/Road Ahead
    if (content.road_ahead || content.the_road_ahead) {
      const roadAhead = content.road_ahead || content.the_road_ahead;
      sections.push(
        <section key="future" id="future" className="space-y-6 progress-section scroll-mt-40">
          <h3 className="text-xl font-medium text-gray-900 leading-tight">The Road Ahead</h3>
          <div className="text-base sm:text-lg text-gray-600 leading-relaxed space-y-4 pt-4">
            {roadAhead.vision && (
              <p>
                <strong>Vision:</strong> {roadAhead.vision}
              </p>
            )}
            {roadAhead.warning && (
              <p>
                <strong>Warning:</strong> {roadAhead.warning}
              </p>
            )}
            {roadAhead.future_focus && (
              <p>
                <strong>Future Focus:</strong> {roadAhead.future_focus}
              </p>
            )}
            {roadAhead.closing_statement && (
              <p className="font-medium">
                {roadAhead.closing_statement}
              </p>
            )}
          </div>
        </section>
      );
    }

    return sections;
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 right-0 w-[800px] h-[600px] bg-blue-300/20 rounded-full blur-3xl opacity-45"></div>
        <div className="absolute top-24 left-0 w-[800px] h-[600px] bg-blue-600/20 rounded-full blur-3xl opacity-45"></div>
      </div>

      {/* Main container */}
      <div className="max-w-[1480px] mx-auto">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-3 px-6 py-8 text-sm text-gray-500">
          <button
            onClick={() => navigate('/resources')}
            className="hover:text-blue-600 transition-colors"
          >
            Resources
          </button>
          <svg className="w-1.5 h-2.5 text-gray-400" viewBox="0 0 7 11" fill="none">
            <path d="M3.79335 5.40047L0.117188 1.7243L1.23602 0.605469L6.03102 5.40047L1.23602 10.1955L0.117188 9.07664L3.79335 5.40047Z" fill="currentColor"/>
          </svg>
          <button
            onClick={() => navigate('/resources/blog')}
            className="hover:text-blue-600 transition-colors"
          >
            Blog
          </button>
          <svg className="w-1.5 h-2.5 text-gray-400" viewBox="0 0 7 11" fill="none">
            <path d="M4.02382 5.40047L0.347656 1.7243L1.46649 0.605469L6.26149 5.40047L1.46649 10.1955L0.347656 9.07664L4.02382 5.40047Z" fill="currentColor"/>
          </svg>
          <span className="text-blue-600">{title}</span>
        </nav>

        {/* Main layout with fixed sidebar and scrollable content */}
        <div className="flex gap-8 px-6">
          {/* Sticky Left sidebar - Combined metadata and navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 w-80 h-fit max-h-[calc(100vh-16rem)] pb-16 overflow-y-auto">
              {/* Container with border that covers metadata and navigation */}
              <div className="border-r border-gray-200 pr-6">
                {/* Article metadata */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <div className="space-y-3 text-sm text-gray-600 pt-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{readTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Published on {date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      <span>Updated on {updatedDate}</span>
                    </div>
                  </div>
                </div>
                
                {/* Navigation anchors */}
                {navigationAnchors.length > 0 && (
                  <div className="pt-6 space-y-2">
                    {navigationAnchors.map((anchor) => (
                      <div 
                        key={anchor.id}
                        className="py-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg px-3"
                        onClick={() => scrollToSection(anchor.id)}
                      >
                        <span className={`text-base font-medium transition-colors ${
                          activeSection === anchor.id ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {anchor.title}
                        </span>
                        {/* Show progress bar only when section is being read (0% < progress < 100%) */}
                        {scrollProgress[anchor.id] > 0 && scrollProgress[anchor.id] < 100 && (
                          <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                              style={{width: `${scrollProgress[anchor.id]}%`}}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable main content */}
          <div className="flex-1 min-w-0 relative max-w-4xl">
            {/* Follow Us section - positioned separately on the right */}
            <div className="absolute top-0 -right-28 flex flex-col items-center gap-3">
              <span className="text-sm text-gray-600">Follow Us</span>
              <div className="flex flex-col gap-2">
                <button className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors">
                  <Link className="w-5 h-5 text-gray-900" />
                </button>
                <button className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors">
                  <LuLinkedin className="w-5 h-5 text-gray-900" />
                </button>
                <button className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors">
                  <FaInstagram className="w-5 h-5 text-gray-900" />
                </button>
                <button className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors">
                  <AiOutlineYoutube className="w-5 h-5 text-gray-900" />
                </button>
              </div>
            </div>

            {/* Article header */}
            <div className="mb-12 pr-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 leading-tight mb-6">
                {title}
              </h1>
            </div>

            {/* Blog Image */}
            {content.image && (
              <div className="mb-12 rounded-lg overflow-hidden">
                <img 
                  src={content.image} 
                  alt={title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Article sections */}
            <div className="space-y-12 pb-64">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;