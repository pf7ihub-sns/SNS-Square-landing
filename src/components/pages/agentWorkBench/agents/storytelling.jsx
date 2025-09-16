
import { useState } from "react";
import axios from "axios";

function StorylineGenerator() {
  const [storyIdea, setStoryIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Function to format markdown-like text
  const formatStoryline = (text) => {
    if (!text) return "";

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
      setLoadingProgress(prev => {
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
      const response = await axios.post('http://127.0.0.1:8000/storyline_generator/storyline', {
        text: storyIdea
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
      console.error('Storyline generation error:', err);
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
    setStoryIdea("");
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Compact Hero Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8 mt-17">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            AI Storyline Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your creative ideas into compelling storylines with AI power.
          </p>
        </div>

        {/* Main Content Container */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Input Section */}
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                {/* Compact Active Agent Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                    Active Agent
                  </span>
                  <span className="text-xs text-gray-500">AI Powered</span>
                </div>

                {/* Compact Input Field */}
                <div className="mb-6">
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    What's your story idea? ✨
                  </label>
                  <div className="relative">
                    <textarea
                      value={storyIdea}
                      onChange={(e) => setStoryIdea(e.target.value)}
                      placeholder="A mysterious time traveler gets stuck in medieval times and must find a way home..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all resize-none text-sm"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {storyIdea.length}/1000
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !storyIdea.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="text-sm">Crafting Story...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm">Generate Storyline</span>
                      <span>✨</span>
                    </div>
                  )}
                </button>
              </form>
            </div>

            {/* Compact Output Section */}
            <div className="space-y-4">

              {/* Compact Loading State */}
              {loading && (
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-20"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-xl animate-bounce">🎭</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-1">Creating Storyline</h3>
                    <p className="text-sm text-gray-600 mb-4">AI is crafting your narrative...</p>

                    {/* Compact Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${loadingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">{Math.round(loadingProgress)}% Complete</p>

                    {/* Compact Loading Steps */}
                    <div className="space-y-1">
                      <div className={`flex items-center justify-center text-xs ${loadingProgress > 30 ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className="mr-1">{loadingProgress > 30 ? '✅' : '⏳'}</span>
                        Analyzing elements
                      </div>
                      <div className={`flex items-center justify-center text-xs ${loadingProgress > 60 ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className="mr-1">{loadingProgress > 60 ? '✅' : '⏳'}</span>
                        Building structure
                      </div>
                      <div className={`flex items-center justify-center text-xs ${loadingProgress > 85 ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className="mr-1">{loadingProgress > 85 ? '✅' : '⏳'}</span>
                        Finalizing storyline
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Compact Error State */}
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-start">
                    <span className="text-xl mr-2">😔</span>
                    <div>
                      <h3 className="text-sm font-semibold text-red-800">Something went wrong</h3>
                      <p className="text-xs text-red-700 mt-1">{error}</p>
                      <button
                        onClick={() => setError(null)}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Compact Result Display */}
              {result && result.storyline && (
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">📚</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Your Storyline</h3>
                        <p className="text-xs text-gray-600">Ready to use!</p>
                      </div>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                      title="Copy"
                    >
                      📋
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200/50 max-h-96 overflow-y-auto">
                    <div
                      className="prose prose-sm max-w-none text-gray-800"
                      dangerouslySetInnerHTML={{ __html: formatStoryline(result.storyline) }}
                    />
                  </div>

                  {/* Compact Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                    <button
                      onClick={generateAnother}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                    >
                      New Story
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                      Refine
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                      Share
                    </button>
                  </div>
                </div>
              )}

              {/* Compact Placeholder */}
              {!loading && !error && !result && (
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border-2 border-dashed border-gray-300 text-center">
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Storyline Output</h3>
                  <p className="text-sm text-gray-500">Your generated story will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StorylineGenerator;