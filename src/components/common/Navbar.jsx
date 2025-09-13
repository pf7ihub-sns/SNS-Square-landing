import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import Button from "./Button2.jsx";
import { useAuthStore } from "../../store/store";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const linkClasses = ({ isActive }) =>
    `text-sm lg:text-sm xl:text-base font-bold font-manrope cursor-pointer transition-colors duration-300
     ${isActive ? "text-blue-600" : "text-global-4 hover:text-blue-600"}`;

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
    <header className="w-full bg-white p-4 fixed top-0 left-0 z-100 backdrop-blur-md">
      <div className="w-[90%] max-w-[1440px] mx-auto relative flex items-center justify-between">
        {/* Logo - left corner */}
        <div 
          className="w-[60px] sm:w-[80px] md:w-[96px] cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={handleLogoClick}
        >
          <img
            src="/images/img_square_logo_black.png"
            alt="SNS Square Logo"
            className="w-[60px] h-[42px] sm:w-[80px] sm:h-[55px] md:w-[96px] md:h-[66px]"
          />
        </div>
        
        {/* Nav - center */}
        <nav className="hidden lg:flex flex-row items-center gap-4 xl:gap-8 absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <NavLink to="/" className={linkClasses} onClick={handleNavClick}>
            Home
          </NavLink>
          <NavLink to="/media-entertainment" className={linkClasses} onClick={handleNavClick}> 
            Agent Workbench
          </NavLink>
          <NavLink to="/usecase" className={linkClasses} onClick={handleNavClick}>
            Use Case
          </NavLink>
          <NavLink to="/life-at-sns" className={linkClasses} onClick={handleNavClick}>
            Life at SNS Square
          </NavLink>
          <NavLink to="/about-us" className={linkClasses} onClick={handleNavClick}>
            About Us
          </NavLink>
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
                <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleAgentWorkbenchClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Agent Workbench
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                className="rounded-[18px] px-6 py-1 text-sm font-bold bg-black text-white"
                onClick={handleContactClick}
              >
                Contact Us
              </Button>

            </>
          )}
        </div>
        
        {/* Hamburger Menu Icon (Mobile only) */}
        <button
          className="block lg:hidden p-2 ml-auto"
          aria-label="Open menu"
          onClick={() => menuOpen ? closeMenu() : openMenu()}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className="block w-full h-0.5 bg-black mb-1"></span>
            <span className="block w-full h-0.5 bg-black mb-1"></span>
            <span className="block w-full h-0.5 bg-black"></span>
          </div>
        </button>
      </div>
      
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div 
          ref={menuRef} 
          className={`lg:hidden mt-4 bg-global-7 rounded-lg p-4 flex flex-col gap-4 transition-all duration-200 ease-in-out transform ${
            isAnimating 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 -translate-y-2 scale-95'
          }`}
        >
          <nav className="flex flex-col gap-4">
            <NavLink to="/" className={linkClasses} onClick={handleNavClick}>
              Home
            </NavLink>
            <NavLink 
              to="/media-entertainment" 
              className={linkClasses} 
              onClick={handleNavClick}
            >
              Agent workbench
            </NavLink>
            <NavLink to="/usecase" className={linkClasses} onClick={handleNavClick}>
              Use Case
            </NavLink>
            <NavLink to="/life-at-sns" className={linkClasses} onClick={handleNavClick}>
              Life at SNS Square
            </NavLink>
            <NavLink to="/about-us" className={linkClasses} onClick={handleNavClick}>
              About Us
            </NavLink>
          </nav>
          {isAuthenticated ? (
            <div className="mt-4 space-y-2">
              <button
                onClick={handleAgentWorkbenchClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Agent Workbench
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <Button
                variant="secondary"
                size="small"
                className="w-full rounded-[18px] px-6 py-1 text-sm font-bold bg-black text-white"
                onClick={() => {
                  handleContactClick();
                  closeMenu();
                }}
              >
                Contact Us
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="w-full rounded-[18px] px-6 py-1 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
                onClick={() => {
                  const event = new CustomEvent('openSignupModal');
                  window.dispatchEvent(event);
                  closeMenu();
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;