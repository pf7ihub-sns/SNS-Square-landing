import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import BlogCard from '../../components/common/BlogCard';
import BlackButton from '../../components/common/BlackButton';

// Import blog data
import supplyChainData from '../../data/Blog/supplyChain.json';
import itData from '../../data/Blog/it.json';
import healthCareData from '../../data/Blog/healthCare.json';
import insuranceData from '../../data/Blog/insuranc.json';

const BlogGrid = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [allBlogs, setAllBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const categories = [
    'All',
    'Supply Chain',
    'Information Technology', 
    'Healthcare',
    // 'Human Resource',
    'Insurance'
  ];

  const blogDataMap = {
    'Supply Chain': supplyChainData,
    'Information Technology': itData,
    'Healthcare': healthCareData,
    // 'Human Resource': itData, // Using IT data as placeholder
    'Insurance': insuranceData
  };

  // Process blog data and create blog objects
  useEffect(() => {
    const processedBlogs = [];
    
    Object.entries(blogDataMap).forEach(([category, data]) => {
      // Handle array of blog entries
      if (Array.isArray(data)) {
        data.forEach((blogEntry, index) => {
          const blog = {
            id: `${category.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
            title: blogEntry.title,
            description: blogEntry.introduction?.context || 
                         blogEntry.introduction?.overview || 
                         blogEntry.introduction?.description || 
                         "Discover the latest insights and innovations in this field.",
            category: category,
            date: "Sep 10, 2025",
            readTime: "5 min read",
            content: blogEntry,
            image: null,
            featured: index === 0 // First blog in each category is featured
          };
          processedBlogs.push(blog);
        });
      } else {
        // Handle single blog object (fallback for old structure)
        const blog = {
          id: `${category.toLowerCase().replace(/\s+/g, '-')}-main`,
          title: data.title,
          description: data.introduction?.context || data.introduction?.overview || data.introduction?.description || "Discover the latest insights and innovations in this field.",
          category: category,
          date: "Sep 10, 2025",
          readTime: "5 min read",
          content: data,
          image: null,
          featured: true
        };
        processedBlogs.push(blog);

        // Create additional blog entries based on content sections
        if (data.key_applications || data.smart_supply_chain?.capabilities) {
          const applications = data.key_applications || data.smart_supply_chain?.capabilities || [];
          applications.slice(0, 2).forEach((app, index) => {
            const appBlog = {
              id: `${category.toLowerCase().replace(/\s+/g, '-')}-app-${index + 1}`,
              title: app.application || app.name || `${data.title} - Application ${index + 1}`,
              description: app.description || app.functions?.join('. ') || "Explore practical applications and use cases.",
              category: category,
              date: "Sep 10, 2025",
              readTime: "3 min read",
              content: { ...data, focus: app },
              image: null
            };
            processedBlogs.push(appBlog);
          });
        }

        // Create blog entry for benefits/insights
        if (data.benefits || data.key_takeaways) {
          const benefits = data.benefits || data.key_takeaways || [];
          const benefitsBlog = {
            id: `${category.toLowerCase().replace(/\s+/g, '-')}-benefits`,
            title: `${data.title} - Key Benefits & Insights`,
            description: Array.isArray(benefits) ? benefits.slice(0, 3).join('. ') : benefits,
            category: category,
            date: "Sep 10, 2025",
            readTime: "4 min read",
            content: { ...data, focus: 'benefits' },
            image: null
          };
          processedBlogs.push(benefitsBlog);
        }
      }
    });

    setAllBlogs(processedBlogs);
    
    // Set initial featured and latest blogs
    if (processedBlogs.length > 0) {
      setFeaturedBlog(processedBlogs[0]);
      setLatestBlogs(processedBlogs.slice(1, 3));
    }
  }, []);

  // Filter blogs based on category and search term
  useEffect(() => {
    let filtered = allBlogs;

    // Filter by selected category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  }, [selectedCategory, searchTerm, allBlogs]);

  // Update featured and latest blogs based on selected category
  useEffect(() => {
    let categoryBlogs = allBlogs;
    
    // Filter by selected category for featured and latest
    if (selectedCategory && selectedCategory !== 'All') {
      categoryBlogs = allBlogs.filter(blog => blog.category === selectedCategory);
    }

    // Set featured blog (first blog marked as featured or first blog from the category)
    if (categoryBlogs.length > 0) {
      const featuredBlogFromCategory = categoryBlogs.find(blog => blog.featured) || categoryBlogs[0];
      setFeaturedBlog(featuredBlogFromCategory);
      
      // Set latest blogs (exclude the featured one)
      const latestBlogsFromCategory = categoryBlogs.filter(blog => blog.id !== featuredBlogFromCategory.id).slice(0, 2);
      setLatestBlogs(latestBlogsFromCategory);
    } else {
      setFeaturedBlog(null);
      setLatestBlogs([]);
    }
  }, [selectedCategory, allBlogs]);

  const handleBlogClick = (blog) => {
    navigate(`/resources/blog/${blog.id}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const displayedBlogs = showMore ? filteredBlogs : filteredBlogs.slice(0, 6);

  return (
    <div className="mt-20 bg-white">
      {/* Header Section */}
      <div className="px-4 xs:px-5 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-[1480px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <h1 className="font-manrope font-bold text-[32px] md:text-[40px] lg:text-[48px] leading-tight text-black mb-4">
                Blogs
              </h1>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search By Topic"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-80 px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <BlackButton
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'black' : 'black-outline'}
                size="medium"
                className="transition-colors duration-200"
              >
                {category}
              </BlackButton>
            ))}
          </div>

          {/* Featured and Latest Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Featured Blog */}
            <div className="lg:col-span-2">
              {featuredBlog ? (
                <BlogCard
                  title={featuredBlog.title}
                  description={featuredBlog.description}
                  image={featuredBlog.image}
                  onClick={() => handleBlogClick(featuredBlog)}
                  // badge={selectedCategory === 'All' ? 'Featured' : `Featured ${selectedCategory}`}
                  date={featuredBlog.date}
                  readTime={featuredBlog.readTime}
                  className=""
                />
              ) : (
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-gray-500">No featured blog available</p>
                </div>
              )}
            </div>

            {/* Latest Blogs */}
            <div className="space-y-6">
              {latestBlogs.length > 0 ? (
                latestBlogs.map((blog, index) => (
                  <BlogCard
                    key={blog.id}
                    title={blog.title}
                    description={blog.description}
                    image={blog.image}
                    onClick={() => handleBlogClick(blog)}
                    // badge={selectedCategory === 'All' ? 'Latest' : `Latest ${selectedCategory}`}
                    date={blog.date}
                    readTime={blog.readTime}
                    className=""
                  />
                ))
              ) : (
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-gray-500 text-sm">No latest blogs available</p>
                </div>
              )}
            </div>
          </div>

          {/* All Articles Section */}
          <div className="mb-8">
            <h2 className="font-manrope font-bold text-[28px] md:text-[32px] lg:text-[36px] leading-tight text-black mb-8">
              {selectedCategory === 'All' || !selectedCategory ? 'All Articles' : `${selectedCategory} Articles`}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {displayedBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  title={blog.title}
                  description={blog.description}
                  image={blog.image}
                  onClick={() => handleBlogClick(blog)}
                  date={blog.date}
                  readTime={blog.readTime}
                  className="h-full"
                />
              ))}
            </div>
          </div>

          {/* Show More Button */}
          {filteredBlogs.length > 6 && (
            <div className="text-center">
              <button
                onClick={() => setShowMore(!showMore)}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                {showMore ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogGrid;
