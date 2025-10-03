import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UseCaseCardNew from "../../common/UseCaseCardNew";
import { RevealOnScroll } from "../../gsap/reveal-on-scroll";

// Import blog data
import supplyChainData from "../../../data/Blog/supplyChain.json";
import itData from "../../../data/Blog/it.json";
import healthCareData from "../../../data/Blog/healthCare.json";
import insuranceData from "../../../data/Blog/insurance.json";

const IdeaSuiteSection = () => {
  const navigate = useNavigate();
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

  const blogDataMap = {
    'Supply Chain': supplyChainData,
    'Information Technology': itData,
    'Healthcare': healthCareData,
    'Insurance': insuranceData
  };

  // Process blog data and get first blog from each category
  useEffect(() => {
    const processedBlogs = [];
    
    Object.entries(blogDataMap).forEach(([category, data]) => {
      if (Array.isArray(data) && data.length > 0) {
        const blogEntry = data[0]; // Get first blog from each category
        const blog = {
          id: `${category.toLowerCase().replace(/\s+/g, '-')}-1`,
          title: blogEntry.title,
          description: blogEntry.introduction?.context || 
                       blogEntry.introduction?.overview || 
                       blogEntry.introduction?.description || 
                       "Discover the latest insights and innovations in this field.",
          category: category,
          image: blogEntry.image || null,
          content: blogEntry
        };
        processedBlogs.push(blog);
      }
    });

    // Take only the first 3 blogs
    setFeaturedBlogs(processedBlogs.slice(0, 3));
  }, []);

  const handleBlogClick = (blog) => {
    navigate(`/resources/blog/${blog.id}`);
  };

  return (
    <section className="px-4 xs:px-5 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      <div className="max-w-[1480px] mx-auto">
        <RevealOnScroll direction="up" duration={0.8} delay={0}>
          <div className="mb-8 lg:mb-12">
            <h3 className="font-manrope font-bold text-[24px] md:text-[30px] lg:text-[36px] leading-tight text-black">
              Idea Suite
            </h3>
            <p className="font-inter text-black/70 mt-3">
              Knowledge that grows smarter with agents.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredBlogs.map((blog, index) => (
            <RevealOnScroll 
              key={blog.id} 
              direction="up" 
              duration={0.8} 
              delay={0.2 + (index * 0.15)}
            >
              <div 
                className="cursor-pointer group"
                onClick={() => handleBlogClick(blog)}
              >
                <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Blog Image */}
                  {blog.image && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Blog Content */}
                  <div className="p-4 sm:p-6">
                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md mb-4">
                        {blog.category}
                      </span>
                    </div>
                    <h5 className=" text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors text-base sm:text-lg">
                      {blog.title}
                    </h5>
                    <p className="text-small text-gray-600 text-sm line-clamp-2 mt-4">
                      {blog.description}
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IdeaSuiteSection;


