
import React, { useState } from "react";

const IdeaRefinementUI = () => {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [refinedIdea, setRefinedIdea] = useState(null);
  const [error, setError] = useState(null);

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
        <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          💡 Idea Refinement Agent
        </h1>

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
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full md:w-1/2 h-96 overflow-y-auto">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center font-medium">
                {error}
              </div>
            )}

            {refinedIdea && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-md">
                <h2 className="font-bold text-blue-800 mb-3 text-xl flex items-center">
                  <span className="mr-2">✨</span> Refined Idea
                </h2>
                <pre className="text-gray-900 whitespace-pre-wrap text-lg font-mono">{refinedIdea}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaRefinementUI;