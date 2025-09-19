import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <div className="">
    <footer className="bg-white max-w-7xl mx-auto  p-8 rounded-lg shadow">
<div className=" px-6 pb-10 grid grid-cols-1 md:grid-cols-5 gap-10  ">
  {/* Logo */}
  <div>
    <img
      src="/images/square_logo_black.png"
      alt="SNS Square"
      className="w-46 mb-6"
    />
  </div>

  {/* Agentic Workbench */}
  <div className="">
    <h6 className="text-black mb-8">Agentic Workbench</h6>
    <ul className="space-y-2 text-gray-600 mt-4">
      <li>
        <Link
          to="/agent-workbench/foundation-agents"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hover:text-blue-400 transition-colors text-small"
        >
          Foundation Agent
        </Link>
      </li>
      <li>
        <Link
          to="/agent-workbench/industry-specific-agents"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hover:text-blue-400 transition-colors text-small"
        >
          Industrial Solutions
        </Link>
      </li>
      <li>
        <Link
          to="/agent-workbench?type=customer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hover:text-blue-400 transition-colors text-small"
        >
          Customer Solutions
        </Link>
      </li>
    </ul>
  </div>

  {/* Use Cases */}
  <div>
    <h6 className="text-black mb-8">Use Case</h6>
    <ul className="space-y-2 text-gray-600 mt-4">
      {[
        { path: "supply-chain", label: "Supply Chain" },
        { path: "information-technology", label: "Information Technology" },
        { path: "healthcare", label: "Healthcare" },
        { path: "human-resource", label: "Human Resources" },
        { path: "insurance", label: "Insurance" }
      ].map((item) => (
        <li key={item.path}>
          <Link
            to={`/usecase?category=${item.path}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-blue-400 transition-colors text-small"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>

  <div>
    <h6 className="text-black mb-8">Company</h6>
    <ul className="space-y-2 text-gray-600 mt-4">
      {[
        { path: "/about-us", label: "About Us" },
        { path: "/life-at-sns", label: "Life at SNS Square" },
        { path: "/resources", label: "Resources" },
        { path: "/contact-us", label: "Contact Us" },
        { path: "/privacy-policy", label: "Privacy policy" },
        { path: "/terms-of-service", label: "Terms of Service" }
      ].map((item) => (
        <li key={item.path}>
          <Link
            to={item.path}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-blue-400 transition-colors text-small"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>

  {/* Contact */}
  <div>
    <h6 className="text-black mb-8">Address</h6>
    <p className="text-gray-600 text-small mt-4 mb-8">
      BLOCK-L, Embassy Tech Village, Outer Ring Rd, Devarabisanahalli,
      Bellandur, Bengaluru, Karnataka 560103
    </p>

    <h6 className="text-black mb-2">Email</h6>
    <p className="text-gray-600 text-small mt-4">
      info@snssquare.com
    </p>
  </div>
</div>

{/* Bottom copyright */}
<div className="max-w-7xl mx-auto border-t border-gray-200 px-6 py-6 flex flex-col md:flex-row justify-between items-center">
  <p className="text-gray-500 text-small">
    © 2025 SNS Square. All rights reserved.
  </p>
  <div className="flex space-x-4 mt-4 md:mt-0">
    <a href="https://www.linkedin.com/company/snssquare/"
      target="_blank"
      className="text-gray-500 hover:text-blue-600 transition-colors"
    >
      <Linkedin size={20} />
    </a>
    <a href="https://www.youtube.com/@snssquare"
      target="_blank"
      className="text-gray-500 hover:text-red-500 transition-colors"
    >
      <Youtube size={20} />
    </a>
  </div>
</div>
    </footer>
    </div>
  );
};

export default Footer;