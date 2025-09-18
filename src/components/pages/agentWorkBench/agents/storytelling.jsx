
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const StorylineGenerator = () => {
  const [storyIdea, setStoryIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Function to format markdown-like text
  const formatStoryline = (text) => {
    if (!text) return '';

    return text
      .split('\n')
      .map((line, index) => {
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
        line = line.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

        if (line.trim().match(/^\*\*.*?:\*\*$/)) {
          return `<h3 class="text-base font-semibold text-blue-800 mt-4 mb-2 border-l-3 border-blue-500 pl-2">${line.replace(/\*\*/g, '')}</h3>`;
        }

        if (line.trim().startsWith('*')) {
          const content = line.trim().substring(1).trim();
          return `<li class="ml-4 mb-1 flex items-start text-sm"><span class="text-blue-500 mr-1 mt-0.5">•</span><span class="text-gray-700">${content}</span></li>`;
        }

        if (line.trim()) {
          return `<p class="mb-2 text-gray-800 leading-relaxed text-sm">${line}</p>`;
        }
        return '<div class="mb-1"></div>';
      })
      .join('');
  };

  const simulateProgress = () => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storyIdea.trim()) {
      setError('Please enter a story idea or theme');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const progressInterval = simulateProgress();

    try {
      const response = await axios.post(`${API_BASE}/storyline_generator/storyline`, {
        text: storyIdea,
      });

      clearInterval(progressInterval);
      setLoadingProgress(100);

      setTimeout(() => {
        setResult(response.data);
        setLoading(false);
        setLoadingProgress(0);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.response?.data?.detail || err.message || 'An error occurred while generating the storyline');
      setLoading(false);
      setLoadingProgress(0);
    }
  };

  const copyToClipboard = () => {
    if (result?.storyline) {
      navigator.clipboard.writeText(result.storyline);
    }
  };

  const generateAnother = () => {
    setResult(null);
    setError(null);
    setStoryIdea('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-5xl mt-17">
        {/* Header */}
        <div className="relative">
          <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            Storyline Generator
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
        <div className="text-center mb-4 text-gray-700">
          <p className="mb-2">Transform your creative ideas into compelling storylines with AI power.</p>
          <p className="text-sm">Enter a story idea or theme to generate a storyline.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <div className="mb-6">
              <label htmlFor="storyIdea" className="block text-sm font-medium text-gray-700 mb-2">
                What's your story idea? ✨
              </label>
              <textarea
                id="storyIdea"
                value={storyIdea}
                onChange={(e) => setStoryIdea(e.target.value)}
                placeholder="A mysterious time traveler gets stuck in medieval times and must find a way home..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                maxLength={1000}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{storyIdea.length}/1000</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !storyIdea.trim()}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !storyIdea.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
              style={{ backgroundColor: loading || !storyIdea.trim() ? '#9CA3AF' : '#1E3A8A' }}
            >
              {loading ? 'Crafting Story...' : 'Generate Storyline'}
            </button>
            {loading && (
              <div className="mt-4 text-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{Math.round(loadingProgress)}% Complete</p>
              </div>
            )}
            {error && (
              <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-lg text-sm">
                {error} <button onClick={() => setError(null)} className="ml-2 text-red-600 underline text-xs">Try again</button>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            {result && result.storyline ? (
              <div className="w-full h-96 overflow-y-auto space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Your Storyline
                </h2>
                <div
                  className="prose prose-sm max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: formatStoryline(result.storyline) }}
                />
                <div className="flex gap-2 mt-4 pt-2 border-t border-gray-200">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    title="Copy to Clipboard"
                  >
                    Copy
                  </button>
                  <button
                    onClick={generateAnother}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    New Story
                  </button>
                  <button
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Refine
                  </button>
                  <button
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Share
                  </button>
                </div>
              </div>
            ) : !loading && !error ? (
              <div className="w-full h-96 flex items-center justify-center text-gray-500">
                Your generated story will appear here
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorylineGenerator;