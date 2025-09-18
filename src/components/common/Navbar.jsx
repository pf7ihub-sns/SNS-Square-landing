import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import Button from "./Button2.jsx";
import { useAuthStore } from "../../store/store";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiMiniSquare3Stack3D } from "react-icons/hi2";

// Animated Hamburger Icon Component
const HamburgerIcon = ({ isOpen, className, ...props }) => (
  <svg
    className={`pointer-events-none transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] ${className}`}
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className={`origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] ${isOpen
          ? 'translate-x-0 translate-y-0 rotate-[315deg]'
          : '-translate-y-[7px]'
        }`}
    />
    <path
      d="M4 12H20"
      className={`origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] ${isOpen ? 'rotate-45' : 'rotate-0'
        }`}
    />
    <path
      d="M4 12H20"
      className={`origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] ${isOpen
          ? 'translate-y-0 rotate-[135deg]'
          : 'translate-y-[7px]'
        }`}
    />
  </svg>
);

// Animated Arrow Component for Navigation
const AnimatedArrow = ({ isHovered, className, ...props }) => (
  <div className={`relative inline-flex items-center transition-all duration-300 ease-in-out ${className}`}>
    <MdOutlineKeyboardArrowRight
      className={`absolute transition-all duration-300 ease-in-out ${isHovered
          ? 'opacity-0 rotate-90 scale-0'
          : 'opacity-100 rotate-0 scale-100'
        }`}
      size={16}
      {...props}
    />
    <MdOutlineKeyboardArrowDown
      className={`absolute transition-all duration-300 ease-in-out ${isHovered
          ? 'opacity-100 rotate-0 scale-100'
          : 'opacity-0 -rotate-90 scale-0'
        }`}
      size={16}
      {...props}
    />
  </div>
);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  // Dropdown content for each navigation item
  const dropdownContent = {
    'agentic-workbench': [
      { label: 'AI Agents', href: '/agent-workbench/ai-agents' },
      { label: 'Workflow Builder', href: '/agent-workbench/workflow-builder' },
      { label: 'Agent Marketplace', href: '/agent-workbench/marketplace' }
    ],
    'use-cases': [
      { label: 'Healthcare', href: '/usecase/healthcare' },
      { label: 'Finance', href: '/usecase/finance' },
      { label: 'E-commerce', href: '/usecase/ecommerce' },
      { label: 'Manufacturing', href: '/usecase/manufacturing' }
    ],
    'life-at-sns': [
      { label: 'Our Culture', href: '/life-at-sns/culture' },
      { label: 'Team Stories', href: '/life-at-sns/team' },
      { label: 'Events', href: '/life-at-sns/events' }
    ],
    'about-us': [
      { label: 'Our Story', href: '/about-us/story' },
      { label: 'Leadership', href: '/about-us/leadership' },
      { label: 'Mission & Vision', href: '/about-us/mission' }
    ],
    'careers': [
      { label: 'Open Positions', href: '/careers/positions' },
      { label: 'Benefits', href: '/careers/benefits' },
      { label: 'Internships', href: '/careers/internships' }
    ],
    'resources': [
      { label: 'Documentation', href: '/resources/docs' },
      { label: 'Blog', href: '/resources/blog' },
      { label: 'Support', href: '/resources/support' },
      { label: 'API Reference', href: '/resources/api' }
    ]
  };

  const linkClasses = ({ isActive }) =>
    `text-small font-normal font-inter cursor-pointer transition-colors duration-300
     ${isActive ? "text-blue-600" : "text-black hover:text-blue-600"}`;

  // Function to handle navigation link clicks
  const handleNavClick = () => {
    closeMenu();
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to open menu with animation
  const openMenu = () => {
    setMenuOpen(true);
    setIsAnimating(true);
  };

  // Function to close menu with animation
  const closeMenu = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setMenuOpen(false);
    }, 140); // Match the transition duration
  };

  // Function to handle logo click - navigate to home
  const handleLogoClick = () => {
    navigate('/');
    closeMenu(); // Close mobile menu if open
    // Scroll to top when navigating to home
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to handle contact button click
  const handleContactClick = () => {
    const ctaSection = document.getElementById('cta-section');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  };

  // Function to handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
    closeMenu();
  };

  // Function to navigate to agent workbench
  const handleAgentWorkbenchClick = () => {
    navigate('/media-entertainment');
    closeMenu();
  };

  // Function to handle dropdown hover
  const handleDropdownHover = (dropdownKey) => {
    setHoveredDropdown(dropdownKey);
  };

  // Function to handle dropdown leave
  const handleDropdownLeave = () => {
    setHoveredDropdown(null);
  };

  // Function to handle dropdown item click
  const handleDropdownItemClick = (href) => {
    navigate(href);
    setHoveredDropdown(null);
    closeMenu();
  };

  // Dropdown component
  const DropdownMenu = ({ items, isVisible }) => {
    if (!isVisible || !items) return null;

    return (
      <div className="absolute top-full left-0 mt-2 w-92 bg-white rounded-xl shadow-lg border border-gray-100 py-3 z-50 animate-in slide-in-from-top-2 fade-in-0 duration-200">
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleDropdownItemClick(item.href)}
              className="group flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg  flex items-center justify-center  transition-colors duration-200">
                <HiMiniSquare3Stack3D className="w-8 h-5 text-teal-600 rotate-90" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-900">
                  {item.label}
                </span>
                <span className="text-sm text-gray-500">
                  Foundational Agents
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Function to handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Function to handle clicks outside the user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.relative')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="w-full bg-white p-4 fixed top-0 left-0 z-100 backdrop-blur-md shadow-sm">
      <div className="w-[90%] max-w-[1440px] mx-auto relative flex items-center justify-between">
        {/* Logo - left corner */}
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={handleLogoClick}
        >
          <img
            src="/images/square_logo_black.png"
            alt="SNS Square Logo"
            className="w-[60px] h-[42px] sm:w-[80px] sm:h-[55px] md:w-[96px] md:h-[66px]"
          />
        </div>

        {/* Nav - center */}
        <nav className="hidden lg:flex flex-row items-center gap-6 xl:gap-6 absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="relative group">
            <div
              className="flex items-center cursor-pointer"
              onMouseEnter={() => handleDropdownHover('agentic-workbench')}
              onMouseLeave={handleDropdownLeave}
            >
              <NavLink
                to="/agent-workbench"
                className={({ isActive }) => {
                  const isAgentWorkbenchActive = isActive || window.location.pathname === '/media-entertainment';
                  return `text-small font-normal font-inter cursor-pointer transition-colors duration-300
                  ${isAgentWorkbenchActive ? "text-blue-600" : "text-black hover:text-blue-600"}`;
                }}
                onClick={handleNavClick}
              >
                Agentic Workbench
              </NavLink>
              <AnimatedArrow
                isHovered={hoveredDropdown === 'agentic-workbench'}
                className="text-gray-400 hover:text-gray-600 ml-1"
              />
            </div>
            <DropdownMenu
              items={dropdownContent['agentic-workbench']}
              isVisible={hoveredDropdown === 'agentic-workbench'}
            />
          </div>

          <div className="relative group">
            <div
              className="flex items-center cursor-pointer"
              onMouseEnter={() => handleDropdownHover('use-cases')}
              onMouseLeave={handleDropdownLeave}
            >
              <NavLink
                to="/usecase"
                className={linkClasses}
                onClick={handleNavClick}
              >
                Use Cases
              </NavLink>
              <AnimatedArrow
                isHovered={hoveredDropdown === 'use-cases'}
                className="text-gray-400 hover:text-gray-600 ml-1"
              />
            </div>
            <DropdownMenu
              items={dropdownContent['use-cases']}
              isVisible={hoveredDropdown === 'use-cases'}
            />
          </div>

          <div className="relative group">
            <div
              className="flex items-center cursor-pointer"
              onMouseEnter={() => handleDropdownHover('life-at-sns')}
              onMouseLeave={handleDropdownLeave}
            >
              <NavLink
                to="/life-at-sns"
                className={linkClasses}
                onClick={handleNavClick}
              >
                Life at SNS Square
              </NavLink>
              <AnimatedArrow
                isHovered={hoveredDropdown === 'life-at-sns'}
                className="text-gray-400 hover:text-gray-600 ml-1"
              />
            </div>
            <DropdownMenu
              items={dropdownContent['life-at-sns']}
              isVisible={hoveredDropdown === 'life-at-sns'}
            />
          </div>

          <div className="relative group">
            <div
              className="flex items-center cursor-pointer"
              onMouseEnter={() => handleDropdownHover('about-us')}
              onMouseLeave={handleDropdownLeave}
            >
              <NavLink
                to="/about-us"
                className={linkClasses}
                onClick={handleNavClick}
              >
                About Us
              </NavLink>
              <AnimatedArrow
                isHovered={hoveredDropdown === 'about-us'}
                className="text-gray-400 hover:text-gray-600 ml-1"
              />
            </div>
            <DropdownMenu
              items={dropdownContent['about-us']}
              isVisible={hoveredDropdown === 'about-us'}
            />
          </div>

          <div className="relative group">
            <div
              className="flex items-center cursor-pointer"
              onMouseEnter={() => handleDropdownHover('careers')}
              onMouseLeave={handleDropdownLeave}
            >
              <NavLink
                to="/careers"
                className={linkClasses}
                onClick={handleNavClick}
              >
                Careers
              </NavLink>
              <AnimatedArrow
                isHovered={hoveredDropdown === 'careers'}
                className="text-gray-400 hover:text-gray-600 ml-1"
              />
            </div>
            <DropdownMenu
              items={dropdownContent['careers']}
              isVisible={hoveredDropdown === 'careers'}
            />
          </div>

          <div className="relative group">
            <div
              className="flex items-center cursor-pointer"
              onMouseEnter={() => handleDropdownHover('resources')}
              onMouseLeave={handleDropdownLeave}
            >
              <NavLink
                to="/resources"
                className={linkClasses}
                onClick={handleNavClick}
              >
                Resources
              </NavLink>
              <AnimatedArrow
                isHovered={hoveredDropdown === 'resources'}
                className="text-gray-400 hover:text-gray-600 ml-1"
              />
            </div>
            <DropdownMenu
              items={dropdownContent['resources']}
              isVisible={hoveredDropdown === 'resources'}
            />
          </div>
        </nav>

        {/* Authentication/User Menu - right corner */}
        <div className="hidden lg:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-small font-normal font-inter text-gray-700">{user?.name || 'User'}</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 fade-in-0 duration-200">
                  <button
                    onClick={handleAgentWorkbenchClick}
                    className="w-full text-left px-4 py-2 text-small font-normal font-inter text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Agent Workbench
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-small font-normal font-inter text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button
                variant="secondary"
                size="small"
                className="rounded px-6 py-2 text-sm font-bold font-manrope bg-black text-white hover:bg-gray-800 transition-colors"
                onClick={() => {
                  const event = new CustomEvent('openSignupModal');
                  window.dispatchEvent(event);
                }}
              >
                Sign In
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="rounded px-6 py-2 text-sm font-bold font-manrope bg-white text-black border border-black hover:bg-gray-50 transition-colors"
                onClick={handleContactClick}
              >
                Contact Us
              </Button>
            </>
          )}
        </div>

        {/* Hamburger Menu Icon (Mobile only) */}
        <button
          className="block lg:hidden p-2 ml-auto hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => menuOpen ? closeMenu() : openMenu()}
        >
          <HamburgerIcon isOpen={menuOpen} className="text-black" />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className={`lg:hidden mt-4 bg-white rounded-lg p-4 flex flex-col gap-4 shadow-lg border border-gray-200 animate-in slide-in-from-top-2 fade-in-0 duration-300 ease-out`}
        >
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/agent-workbench"
              className={({ isActive }) => {
                const isAgentWorkbenchActive = isActive || window.location.pathname === '/media-entertainment';
                return `text-small font-normal font-inter cursor-pointer transition-all duration-200 rounded-md px-3 py-2 hover:bg-gray-100
                        ${isAgentWorkbenchActive ? "text-blue-600 bg-blue-50" : "text-black hover:text-blue-600"}`;
              }}
              onClick={handleNavClick}
            >
              Agentic Workbench
            </NavLink>
            <NavLink to="/usecase" className={({ isActive }) =>
              `text-small font-normal font-inter cursor-pointer transition-all duration-200 rounded-md px-3 py-2 hover:bg-gray-100
               ${isActive ? "text-blue-600 bg-blue-50" : "text-black hover:text-blue-600"}`
            } onClick={handleNavClick}>
              Use Cases
            </NavLink>
            <NavLink to="/life-at-sns" className={({ isActive }) =>
              `text-small font-normal font-inter cursor-pointer transition-all duration-200 rounded-md px-3 py-2 hover:bg-gray-100
               ${isActive ? "text-blue-600 bg-blue-50" : "text-black hover:text-blue-600"}`
            } onClick={handleNavClick}>
              Life at SNS Square
            </NavLink>
            <NavLink to="/about-us" className={({ isActive }) =>
              `text-small font-normal font-inter cursor-pointer transition-all duration-200 rounded-md px-3 py-2 hover:bg-gray-100
               ${isActive ? "text-blue-600 bg-blue-50" : "text-black hover:text-blue-600"}`
            } onClick={handleNavClick}>
              About Us
            </NavLink>
            <NavLink to="/careers" className={({ isActive }) =>
              `text-small font-normal font-inter cursor-pointer transition-all duration-200 rounded-md px-3 py-2 hover:bg-gray-100
               ${isActive ? "text-blue-600 bg-blue-50" : "text-black hover:text-blue-600"}`
            } onClick={handleNavClick}>
              Careers
            </NavLink>
            <NavLink to="/resources" className={({ isActive }) =>
              `text-small font-normal font-inter cursor-pointer transition-all duration-200 rounded-md px-3 py-2 hover:bg-gray-100
               ${isActive ? "text-blue-600 bg-blue-50" : "text-black hover:text-blue-600"}`
            } onClick={handleNavClick}>
              Resources
            </NavLink>
          </nav>
          {isAuthenticated ? (
            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
              <button
                onClick={handleAgentWorkbenchClick}
                className="w-full text-left px-4 py-2 text-small font-normal font-inter text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Agent Workbench
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-small font-normal font-inter text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
              <Button
                variant="secondary"
                size="small"
                className="w-full rounded-lg px-6 py-2 text-sm font-bold font-manrope bg-black text-white hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02]"
                onClick={() => {
                  const event = new CustomEvent('openSignupModal');
                  window.dispatchEvent(event);
                  closeMenu();
                }}
              >
                Sign In
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="w-full rounded-lg px-6 py-2 text-sm font-bold font-manrope bg-white text-black border border-black hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02]"
                onClick={() => {
                  handleContactClick();
                  closeMenu();
                }}
              >
                Contact Us
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;