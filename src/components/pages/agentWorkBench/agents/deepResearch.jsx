import { useState } from "react";
import axios from "axios";
import { ArrowLeft } from 'lucide-react';

function DeepResearchAgent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [depth, setDepth] = useState("small");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const formatContent = (content) => {
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return formatted.split('\n\n').map((para, index) => (
      <p key={index} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: para.replace(/\n/g, '<br />') }} />
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/research/run', {
        title,
        brief: description || null,
        length: depth
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-26" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="relative">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white text-center mb-6 p-3 sm:p-4 rounded-lg mx-8 sm:mx-12 lg:mx-0" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            Deep Research Agent
          </h1>
          <button
            onClick={() => window.location.href = '/media-entertainment'}
            className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-4 lg:right-4 flex items-center gap-1 sm:gap-2 text-white font-medium hover:text-blue-200 transition-colors text-sm sm:text-base p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span>Back</span>
          </button>
        </div>


        {/* Instructions */}
        <div className="text-center mb-6 text-gray-700">
          <p className="mb-2">Conduct advanced research with comprehensive data gathering.</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Instructions Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-32">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Enter Research Topic</p>
                    <p className="text-sm text-gray-600">Provide a clear, specific research title</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Add Context</p>
                    <p className="text-sm text-gray-600">Optional: Provide additional details or focus areas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Select Depth</p>
                    <p className="text-sm text-gray-600">Choose the level of detail for your research</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Run Research</p>
                    <p className="text-sm text-gray-600">Click to start the comprehensive analysis</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Research Capabilities</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Web-based information gathering</li>
                  <li>• Multi-source content analysis</li>
                  <li>• Structured report generation</li>
                  <li>• Source citation and verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Research Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="space-y-6">
                {/* Research Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Research Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter the topic you want to research"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Be specific and clear about what you want to research
                  </p>
                </div>

                {/* Research Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Context <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide any additional context, specific angles, or focus areas for the research"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    rows={4}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Help guide the research direction with specific requirements or questions
                  </p>
                </div>

                {/* Research Depth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Research Depth
                  </label>
                  <select
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="small">Quick Overview - Essential information and key points</option>
                    <option value="medium">Detailed Analysis - Comprehensive coverage with examples</option>
                    <option value="deep">In-depth Research - Thorough investigation with multiple perspectives</option>
                  </select>
                  <div className="mt-2">
                    {depth === "small" && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        Estimated reading time: 2-3 minutes | Quick overview of key information
                      </p>
                    )}
                    {depth === "medium" && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        Estimated reading time: 5-7 minutes | Detailed analysis with examples
                      </p>
                    )}
                    {depth === "deep" && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        Estimated reading time: 10-15 minutes | Comprehensive in-depth research
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !title.trim()}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || (!title.trim()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                    style={{ backgroundColor: loading || (!title.trim()) ? '#9CA3AF' : '#1E3A8A' }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Researching...
                      </span>
                    ) : (
                      'Start Deep Research'
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Error Display */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-red-800 font-medium">Research Error</p>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            )}

            {/* Results Section */}
            {result && (
              <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{result.title}</h2>
                      <p className="text-gray-600 mt-1">Research completed successfully</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Complete
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 h-96 overflow-y-auto">
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Research Content
                    </h3>
                    <div className="text-gray-700 space-y-4">
                      {formatContent(result.content)}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sources and References</h3>
                  <div className="grid gap-3">
                    {result.sources.map((source, index) => (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                            >
                              {source.title}
                            </a>
                            <p className="text-gray-500 text-sm mt-1 break-all">{source.url}</p>
                          </div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Research generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => window.print()}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        Print Report
                      </button>
                      <button
                        onClick={() => setResult(null)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                      >
                        New Research
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeepResearchAgent;