import React, { useState } from "react";
import { ArrowLeft } from 'lucide-react';

const IdeaRefinementUI = () => {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [refinedIdea, setRefinedIdea] = useState(null);
  const [error, setError] = useState(null);

  // Function to clean and format the refined idea text
  const formatRefinedText = (text) => {
    if (!text) return "";

    return text
      // Remove markdown headers (##, ###, etc.)
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold markdown (**text** or __text__)
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      // Remove italic markdown (*text* or _text_)
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // Remove bullet points and format as paragraphs
      .replace(/^\s*[-*+]\s+/gm, '• ')
      // Remove numbered lists formatting
      .replace(/^\s*\d+\.\s+/gm, '• ')
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  };

  const handleRefine = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    setError(null);
    setRefinedIdea(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/idea-refinement/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) {
        throw new Error("Failed to refine idea. Try again.");
      }

      const data = await response.json();
      setRefinedIdea(data.refined_idea);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="relative">
          <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            💡 Idea Refinement Agent
          </h1>
          <button
            onClick={() => window.location.href = '/media-entertainment'}
            className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md z-10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6 text-gray-700">
          <p className="mb-2">Refine your raw ideas into polished concepts.</p>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Input Section (Left) */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full md:w-1/2">
            <label className="block mb-2 text-gray-700 font-medium" htmlFor="idea-input">
              Enter your raw idea:
            </label>
            <textarea
              id="idea-input"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Type your idea here..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none text-lg"
              rows={4}
            />

            <button
              onClick={handleRefine}
              disabled={loading || !idea.trim()}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || (!idea.trim()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
              style={{ backgroundColor: loading || (!idea.trim()) ? '#9CA3AF' : '#1E3A8A' }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refining...
                </span>
              ) : (
                "Refine Idea"
              )}
            </button>
          </div>

          {/* Output Section (Right) */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full md:w-1/2">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center font-medium">
                {error}
              </div>
            )}

            {!refinedIdea && !error && !loading && (
              <div className="h-96 flex items-center justify-center text-gray-500 text-center">
                <div>
                  <div className="text-4xl mb-4">💭</div>
                  <p className="text-lg">Your refined idea will appear here</p>
                  <p className="text-sm mt-2">Enter your idea and click "Refine Idea" to get started</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 text-lg">Processing your idea...</p>
                </div>
              </div>
            )}

            {refinedIdea && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-md min-h-96">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">✨</span>
                  <h2 className="font-bold text-blue-800 text-xl">Refined Idea</h2>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                  <div
                    className="text-gray-800 leading-relaxed text-base"
                    style={{
                      lineHeight: '1.7',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  >
                    {formatRefinedText(refinedIdea).split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph.split('\n').map((line, lineIndex) => (
                          <span key={lineIndex}>
                            {line}
                            {lineIndex < paragraph.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaRefinementUI;