import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

// Inline LoadingSpinner Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="relative">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      <span className="ml-2 text-blue-700">Generating Images...</span>
    </div>
  );
}

// Main ImageGenerator Component
export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [imageType, setImageType] = useState('avatar');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('generator');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/generate', {
        prompt: prompt.trim(),
        style,
        type: imageType,
      });

      const result = response.data;

      if (result.success) {
        const images = result.images.map((url, index) => ({
          url,
          id: `img-${Date.now()}-${index}`,
        }));

        setGeneratedImages(images);
        setEnhancedPrompt(result.enhanced_prompt);
        setSuggestions(result.suggestions || []);
      } else {
        setError(result.error || 'Failed to generate images');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to connect to the image generation service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (imageUrl) => {
    try {
      if (imageUrl.startsWith('data:image')) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `ai-generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `generated-image-${Date.now()}.png`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download error:', error);
      window.open(imageUrl, '_blank');
    }
  };

  const handleImagePreview = (image) => {
    setSelectedImage(image);
    setCurrentView('preview');
  };

  const handleBackToGenerator = () => {
    setCurrentView('generator');
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-5xl mt-18">
        {/* Header */}
        <div className="relative">
          <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            AI Image Generation
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
          <p className="mb-2">Generate realistic images from your prompts using AI power.</p>
          <p className="text-sm">Enter a prompt and select style/type to create images.</p>
        </div>

        {/* Main Content */}
        {currentView === 'preview' && selectedImage && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Image Preview</h2>
              <p className="text-gray-600">Full resolution view</p>
            </div>
            <div className="flex justify-center mb-6">
              <div className="relative max-w-2xl">
                <img
                  src={selectedImage.url}
                  alt="Generated image preview"
                  className="w-full rounded-lg shadow-lg"
                />
                <button
                  onClick={() => handleDownload(selectedImage.url)}
                  className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
            {enhancedPrompt && (
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">Enhanced Prompt Used:</h4>
                <p className="text-blue-800 text-sm">{enhancedPrompt}</p>
              </div>
            )}
            <div className="text-center">
              <button
                onClick={handleBackToGenerator}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Images
              </button>
            </div>
          </div>
        )}

        {currentView === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your image
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Professional headshot of a business person, Beautiful portrait of a woman with natural lighting..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Type
                    </label>
                    <select
                      value={imageType}
                      onChange={(e) => setImageType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="avatar">Avatar/Profile</option>
                      <option value="illustration">Illustration</option>
                      <option value="photo">Photo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Style
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="realistic">Realistic</option>
                      <option value="professional">Professional</option>
                      <option value="artistic">Artistic</option>
                      <option value="portrait">Portrait</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isLoading}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${!prompt.trim() || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                  style={{ backgroundColor: !prompt.trim() || isLoading ? '#9CA3AF' : '#1E3A8A' }}
                >
                  {isLoading ? <LoadingSpinner /> : 'Generate Realistic Images'}
                </button>
                {error && (
                  <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error} <button onClick={() => setError(null)} className="ml-2 text-red-600 underline text-xs">Try again</button>
                  </div>
                )}
              </div>
            </div>

            {/* Output Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              {generatedImages.length > 0 ? (
                <div className="w-full h-96 overflow-y-auto space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Generated Realistic Images
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedImages.map((image) => (
                      <div key={image.id} className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer">
                        <img
                          src={image.url}
                          alt="Generated image"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onClick={() => handleImagePreview(image)}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImagePreview(image);
                              }}
                              className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                              title="View fullscreen"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(image.url);
                              }}
                              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                              title="Download image"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          HD
                        </div>
                      </div>
                    ))}
                  </div>
                  {enhancedPrompt && (
                    <div className="bg-blue-50 rounded-xl p-4 mt-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Enhanced Prompt Used:</h4>
                      <p className="text-blue-800 text-sm">{enhancedPrompt}</p>
                    </div>
                  )}
                </div>
              ) : !isLoading && !error ? (
                <div className="w-full h-96 flex items-center justify-center text-gray-500">
                  Your generated images will appear here
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}