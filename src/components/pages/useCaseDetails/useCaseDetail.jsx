import { Clock, Calendar, RefreshCw,} from "lucide-react";
import { AiOutlineYoutube } from "react-icons/ai";
import { LuLinkedin } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa6";
import { RiShareForwardLine } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useCaseData from "../../../data/usecase.json";
import { FaWhatsapp, FaLinkedinIn, FaInstagram as FaInsta, FaTimes } from 'react-icons/fa';

export default function UseCaseDetailPage() {
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Get current page URL and title for sharing
  const currentUrl = window.location.href;
  const pageTitle = document.title;

  const shareOptions = [
    {
      name: 'LinkedIn',
      icon: <FaLinkedinIn className="w-4 h-4" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="w-4 h-4" />,
      url: `https://wa.me/?text=${encodeURIComponent(`${pageTitle} - ${currentUrl}`)}`,
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      name: 'Instagram',
      icon: <FaInsta className="w-4 h-4" />,
      url: `https://www.instagram.com/?url=${encodeURIComponent(currentUrl)}`,
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    }
  ];
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Category mapping for breadcrumb display and navigation
  const categoryMapping = {
    "Supply Chain": "supply-chain",
    "Technology": "technology", // Use "Technology" as it appears in the data
    "Healthcare": "healthcare",
    "Human Resource": "human-resource",
    "Insurance": "insurance"
  };

  // Reverse mapping for breadcrumb display
  const breadcrumbCategoryNames = {
    "Supply Chain": "Supply Chain",
    "Technology": "Technology", // This matches the actual data category
    "Healthcare": "Healthcare",
    "Human Resource": "Human Resource", 
    "Insurance": "Insurance"
  };
  
  // Handle both /usecase/:id and /usecase/:category/:id routes
  let useCaseId;
  if (params.id) {
    useCaseId = params.id; // For /usecase/:category/:id route
  } else if (params.category) {
    useCaseId = params.category; // For /usecase/:id route (where id is captured as category)
  } else {
    useCaseId = 'smart-inventory'; // fallback
  }
  
  const useCase = useCaseData[useCaseId] || useCaseData['smart-inventory']; // fallback to smart-inventory
  
  // Create dynamic progress state based on sections
  const sections = useCase.sections || [];
  const sectionIds = sections.map(section => section.id);
  
  const [scrollProgress, setScrollProgress] = useState(() => {
    const progress = {};
    sectionIds.forEach(id => {
      progress[id] = 0;
    });
    return progress;
  });
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');
  const sectionIdsRef = useRef(sectionIds);
  const scrollHandlerRef = useRef(null);
  
  // Update ref when sections change
  useEffect(() => {
    sectionIdsRef.current = sectionIds;
    // Update active section when sections change
    if (sectionIds.length > 0 && !activeSection) {
      setActiveSection(sectionIds[0]);
    }
  }, [sectionIds, activeSection]);

  // Handle navigation when location changes (when user clicks navbar links)
  useEffect(() => {
    // List of non-usecase paths that should trigger navigation
    const nonUseCasePaths = ['/', '/about-us', '/life-at-sns', '/careers', '/resources', '/agent-workbench'];
    
    // Check if current path matches any non-usecase path or starts with them
    const shouldNavigateAway = nonUseCasePaths.some(path => 
      location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path))
    );
    
    // If user clicked a navbar link to go to a non-usecase page, navigate away immediately
    if (shouldNavigateAway) {
      console.log('Detected navigation to:', location.pathname);
      // Use setTimeout to ensure this runs after the current execution cycle
      setTimeout(() => {
        console.log('Executing navigation to:', location.pathname);
        window.location.href = location.pathname;
      }, 0);
    }
  }, [location.pathname]);

  // Create the scroll handler function
  useEffect(() => {
    const handleScroll = () => {
      const currentSectionIds = sectionIdsRef.current;
      if (currentSectionIds.length === 0) return;

      let currentActiveSection = '';
      const navbarHeight = 160; // Approximate navbar height including sticky offset

      // Use functional update to avoid dependency on scrollProgress
      setScrollProgress(prevProgress => {
        const newProgress = {};
        
        // Reset all progress first
        currentSectionIds.forEach(sectionId => {
          newProgress[sectionId] = 0;
        });

        // Find which section is currently active and calculate progress
        currentSectionIds.forEach((sectionId, index) => {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            const heading = element.querySelector('h2');
            const headingRect = heading ? heading.getBoundingClientRect() : rect;
            
            // Determine if this section is active (heading has reached the navbar)
            if (headingRect.top <= navbarHeight) {
              currentActiveSection = sectionId;
            }
            
            // Calculate progress for each section independently
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            const sectionHeight = rect.height;
            
            if (sectionBottom < navbarHeight) {
              // Section has completely scrolled past the navbar
              newProgress[sectionId] = 100;
            } else if (sectionTop < navbarHeight && sectionBottom > navbarHeight) {
              // Section is partially scrolled - calculate how much has passed the navbar
              const scrolledAmount = navbarHeight - sectionTop;
              const progress = (scrolledAmount / sectionHeight) * 100;
              newProgress[sectionId] = Math.min(100, Math.max(0, progress));
            } else {
              // Section hasn't reached the navbar yet
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
  }, []); // Create handler once

  // Set up scroll listener when sections are available
  useEffect(() => {
    if (sectionIds.length === 0 || !scrollHandlerRef.current) return;

    const handleScroll = scrollHandlerRef.current;

    // Use passive listener to improve performance and avoid blocking navigation
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Trigger initial calculation after a short delay to ensure DOM is ready
    setTimeout(() => {
      handleScroll();
    }, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds.length]); // Re-run when we get sections

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate offset to account for fixed navbar and sidebar positioning
      const offsetTop = element.offsetTop - 160; // 160px offset for navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
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
            onClick={() => navigate('/usecase')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Use Cases
          </button>
          <svg className="w-1.5 h-2.5 text-gray-400" viewBox="0 0 7 11" fill="none">
            <path d="M3.79335 5.40047L0.117188 1.7243L1.23602 0.605469L6.03102 5.40047L1.23602 10.1955L0.117188 9.07664L3.79335 5.40047Z" fill="currentColor"/>
          </svg>
          <button 
            onClick={() => navigate(`/usecase?category=${categoryMapping[useCase.category] || useCase.category?.toLowerCase().replace(/\s+/g, '-')}`)}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            {breadcrumbCategoryNames[useCase.category] || useCase.category}
          </button>
          <svg className="w-1.5 h-2.5 text-gray-400" viewBox="0 0 7 11" fill="none">
            <path d="M4.02382 5.40047L0.347656 1.7243L1.46649 0.605469L6.26149 5.40047L1.46649 10.1955L0.347656 9.07664L4.02382 5.40047Z" fill="currentColor"/>
          </svg>
          <span className="text-blue-600">{useCase.title}</span>
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
                      <span>7min reading</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Published on August 18, 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      <span>Updated on September 2, 2025</span>
                    </div>
                  </div>
                </div>
                
                {/* Navigation anchors */}
                <div className="pt-6 space-y-2">
                  {sections.map((section) => (
                    <div 
                      key={section.id}
                      className="py-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg px-3"
                      onClick={() => scrollToSection(section.id)}
                    >
                      <span className={`text-base font-medium transition-colors ${
                        activeSection === section.id ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {section.title}
                      </span>
                      {/* Show progress bar only when section is being read (0% < progress < 100%) */}
                      {scrollProgress[section.id] > 0 && scrollProgress[section.id] < 100 && (
                        <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                            style={{width: `${scrollProgress[section.id]}%`}}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              

            </div>
          </div>

          {/* Scrollable main content */}
          <div className="flex-1 min-w-0 relative max-w-4xl">
            {/* Follow Us section - positioned separately on the right */}
            <div className="absolute top-0 -right-28 flex flex-col items-center gap-3">
              <span className="text-sm text-gray-600">Follow Us</span>
              <div className="flex flex-col gap-2 relative">
                {/* Direct Social Links */}
                <a 
                  href="https://www.linkedin.com/company/snssquare/posts/?feedView=all" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors"
                >
                  <LuLinkedin className="w-5 h-5 text-gray-900" />
                </a>
                
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors"
                >
                  <FaInstagram className="w-5 h-5 text-gray-900" />
                </a>
                
                <a 
                  href="https://www.youtube.com/@snssquare" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors"
                >
                  <AiOutlineYoutube className="w-5 h-5 text-gray-900" />
                </a>

                {/* Share Button with Dropdown - Now Last */}
                <div className="relative">
                  <button 
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors"
                  >
                    <RiShareForwardLine className="w-5 h-5 text-gray-900" />
                  </button>
                  
                  {/* Share Dropdown Menu */}
                  {showShareMenu && (
                    <div className="absolute left-12 top-0 bg-white rounded-lg shadow-lg border p-2 min-w-[140px] z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 font-medium">Share via</span>
                        <button 
                          onClick={() => setShowShareMenu(false)}
                          className="w-4 h-4 text-gray-400 hover:text-gray-600"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex flex-col gap-1">
                        {shareOptions.map((option, index) => (
                          <a
                            key={index}
                            href={option.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-2 rounded-md ${option.bgColor} transition-colors`}
                            onClick={() => setShowShareMenu(false)}
                          >
                            {option.icon}
                            <span className="text-sm text-gray-800">{option.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Article header */}
            <div className="mb-12 pr-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 leading-tight mb-6">
                {useCase.heroTitle || useCase.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl pt-2">
                {useCase.description}
              </p>
            </div>

            {/* Hero image */}
            {useCase.image && (
              <div className="w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden mb-12">
                <img 
                  src={useCase.image} 
                  alt={useCase.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article sections */}
            <div className="space-y-12 pb-64">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="space-y-6 progress-section scroll-mt-40">
                  <h2 className="text-xl font-medium text-gray-900 leading-tight">
                    {section.title}
                  </h2>
                  <div className="text-base sm:text-lg text-gray-600 leading-relaxed space-y-4 pt-4">
                    {section.content && (
                      <p>{section.content}</p>
                    )}
                    
                    {/* Render challenges if they exist */}
                    {section.challenges && section.challenges.length > 0 && (
                      <>
                        <p>Key challenges include:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          {section.challenges.map((challenge, index) => (
                            <li key={index}><strong>{challenge.split(':')[0]}:</strong> {challenge.split(':')[1]}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    
                    {/* Render features if they exist */}
                    {section.features && section.features.length > 0 && (
                      <>
                        <p>Our platform provides:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          {section.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    
                    {/* Render benefits if they exist */}
                    {section.benefits && section.benefits.length > 0 && (
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        {section.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    )}
                    
                    {/* Render additional content if it exists */}
                    {section.additionalContent && (
                      <p>{section.additionalContent}</p>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
