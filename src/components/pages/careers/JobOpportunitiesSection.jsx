import React from "react";

const JobOpportunitiesSection = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Software Developers",
      description: "Lorem ipsum dolor sit amet consectetur. Massa mattis sed magna sociis volutpat tristique eget.",
      icon: "💻"
    },
    {
      id: 2,
      title: "UI/UX Designers",
      description: "Lorem ipsum dolor sit amet consectetur. Massa mattis sed magna sociis volutpat tristique eget.",
      icon: "🎨"
    },
    {
      id: 3,
      title: "Data Scientists",
      description: "Lorem ipsum dolor sit amet consectetur. Massa mattis sed magna sociis volutpat tristique eget.",
      icon: "📊"
    },
    {
      id: 4,
      title: "DevOps Engineers",
      description: "Lorem ipsum dolor sit amet consectetur. Massa mattis sed magna sociis volutpat tristique eget.",
      icon: "⚙️"
    },
    {
      id: 5,
      title: "Product Managers",
      description: "Lorem ipsum dolor sit amet consectetur. Massa mattis sed magna sociis volutpat tristique eget.",
      icon: "📋"
    },
    {
      id: 6,
      title: "AI/ML Engineers",
      description: "Lorem ipsum dolor sit amet consectetur. Massa mattis sed magna sociis volutpat tristique eget.",
      icon: "🤖"
    },
    {
      id: 7,
      title: "Quality Assurance",
      description: "Lorem ipsum dolor sit amet consectetur. Massa mattis sed magna sociis volutpat tristique eget.",
      icon: "✅"
    },
    {
      id: 8,
      title: "Business Analysts",
      description: "Lorem ipsum dolor sit amet consectetur. Massa mattis sed magna sociis volutpat tristique eget.",
      icon: "📈"
    }
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Opportunities that fuel your growth
        </h2>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobOpenings.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-yellow-400 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">📄</span>
              </div>

              {/* Job Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {job.title}
              </h3>

              {/* Job Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {job.description}
              </p>

              {/* Apply Link */}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobOpportunitiesSection;
