import { Clock, Calendar, RefreshCw, Copy, Linkedin, Instagram, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useCaseData from "../../../data/usecase.json";

export default function UseCaseDetailPage() {
  const params = useParams();
  
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

  useEffect(() => {
    // Only set up scroll listener if we have sections
    if (sectionIds.length === 0) return;

    const handleScroll = () => {
      const sections = sectionIds;

      let currentActiveSection = '';
      const newProgress = { ...scrollProgress };
      const navbarHeight = 160; // Approximate navbar height including sticky offset

      // Reset all progress first
      sections.forEach(sectionId => {
        newProgress[sectionId] = 0;
      });

      // Find which section is currently active and calculate progress
      sections.forEach((sectionId, index) => {
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

      setScrollProgress(newProgress);
      if (currentActiveSection) {
        setActiveSection(currentActiveSection);
      }
    };

    // Use passive listener to improve performance and avoid blocking navigation
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, scrollProgress]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
        <nav className="flex items-center gap-3 py-8 text-sm text-gray-500">
          <span>Use Cases</span>
          <svg className="w-1.5 h-2.5 text-gray-400" viewBox="0 0 7 11" fill="none">
            <path d="M3.79335 5.40047L0.117188 1.7243L1.23602 0.605469L6.03102 5.40047L1.23602 10.1955L0.117188 9.07664L3.79335 5.40047Z" fill="currentColor"/>
          </svg>
          <span>{useCase.category}</span>
          <svg className="w-1.5 h-2.5 text-gray-400" viewBox="0 0 7 11" fill="none">
            <path d="M4.02382 5.40047L0.347656 1.7243L1.46649 0.605469L6.26149 5.40047L1.46649 10.1955L0.347656 9.07664L4.02382 5.40047Z" fill="currentColor"/>
          </svg>
          <span className="text-blue-600">{useCase.title}</span>
        </nav>

        {/* Article header section */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 lg:gap-8 mb-16">
          {/* Left sidebar - article metadata */}
          <div className="lg:col-span-1 space-y-4 relative">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>7min reading</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Published on April 1, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Updated on April 24, 2025</span>
              </div>
            </div>
            {/* Vertical separator line */}
            <div className="hidden lg:block absolute right-0 top-0 h-full w-px bg-gray-200"></div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-4 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 leading-tight">
              {useCase.heroTitle || useCase.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed pt-4">
              {useCase.description}
            </p>
          </div>

          {/* Social media follow section - moved to top right */}
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <div className="flex flex-col items-center gap-3">
              <span className="text-sm text-gray-600">Follow Us</span>
              <div className="flex flex-col gap-2">
                <button className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors">
                  <Copy className="w-5 h-5 text-gray-900" />
                </button>
                <button className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors">
                  <Linkedin className="w-5 h-5 text-gray-900" />
                </button>
                <button className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors">
                  <Instagram className="w-5 h-5 text-gray-900" />
                </button>
                <button className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors">
                  <Youtube className="w-5 h-5 text-gray-900" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main article content */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 lg:gap-8 pb-32">
          {/* Left sidebar - navigation anchors */}
          <div className="lg:col-span-1">
            <div className="sticky top-40 space-y-3">
              {sections.map((section) => (
                <div 
                  key={section.id}
                  className="py-2 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg"
                  onClick={() => scrollToSection(section.id)}
                >
                  <span className={`text-lg font-medium transition-colors ${
                    activeSection === section.id ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {section.title}
                  </span>
                  {activeSection === section.id && (
                    <div className="mt-2 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                        style={{width: `${scrollProgress[section.id]}%`}}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-4 space-y-12">
            {/* Hero image */}
            {useCase.image && (
              <div className="w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
                <img 
                  src={useCase.image} 
                  alt={useCase.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article sections */}
            <div className="space-y-12">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="space-y-6 progress-section">
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
