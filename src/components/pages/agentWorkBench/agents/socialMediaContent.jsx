import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const SocialMediaContent = () => {
    const [formData, setFormData] = useState({
        topic: "",
        platform: "LinkedIn",
        audience: "General Public",
        purpose: "Engagement",
    });
    const [contentData, setContentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
        setContentData(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.topic.trim() || !formData.platform) {
            setError('Please provide a topic and select a platform.');
            return;
        }

        setLoading(true);
        setError(null);
        setContentData(null);

        try {
            const response = await axios.post(`${API_BASE}/social-media/generate`, formData);
            setContentData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error generating content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-5xl mt-18">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Social Media Content Generator
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
                    <p className="mb-2">Generate social media content tailored to your platform, audience, and purpose.</p>
                    <p className="text-sm">Enter a topic and select options to create content with hashtags and strategy.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                                    Topic
                                </label>
                                <input
                                    id="topic"
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="e.g., AI advancements in 2025..."
                                />
                            </div>
                            <div>
                                <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                                    Platform
                                </label>
                                <select
                                    id="platform"
                                    name="platform"
                                    value={formData.platform}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Twitter">Twitter</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Facebook">Facebook</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
                                    Audience
                                </label>
                                <select
                                    id="audience"
                                    name="audience"
                                    value={formData.audience}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="Healthcare Managers">Healthcare Managers</option>
                                    <option value="Students">Students</option>
                                    <option value="Developers">Developers</option>
                                    <option value="General Public">General Public</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                                    Purpose
                                </label>
                                <select
                                    id="purpose"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="Engagement">Engagement</option>
                                    <option value="Awareness">Awareness</option>
                                    <option value="Conversion">Conversion</option>
                                    <option value="Education">Education</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !formData.topic.trim() || !formData.platform}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !formData.topic.trim() || !formData.platform ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: loading || !formData.topic.trim() || !formData.platform ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {loading ? 'Generating...' : 'Generate Content'}
                            </button>
                        </form>
                        {loading && (
                            <div className="mt-4 text-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: '50%' }}></div>
                                </div>
                                <p className="text-xs text-gray-500">Processing...</p>
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
                        {contentData && contentData.content ? (
                            <div className="w-full h-96 overflow-y-auto space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Generated Content
                                </h2>
                                {contentData.content.match(/1\..*Main content/) ? (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Main Content</h3>
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                            {contentData.content.split('2. Suggested hashtags')[0].replace('1. Main content (well-written text)', '').trim()}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Main Content</h3>
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{contentData.content}</p>
                                    </div>
                                )}
                                {contentData.content.match(/2\..*Suggested hashtags/) ? (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Suggested Hashtags</h3>
                                        <p className="text-gray-700 text-sm">
                                            {contentData.content.split('2. Suggested hashtags')[1].split('3. Step-by-step strategy')[0].trim().replace(/^\s*-/, '').trim()}
                                        </p>
                                    </div>
                                ) : null}
                                {contentData.content.match(/3\..*Step-by-step strategy/) ? (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Step-by-Step Strategy</h3>
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                            {contentData.content.split('3. Step-by-step strategy')[1].trim()}
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        ) : !loading && !error ? (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500">
                                Your content will appear here
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialMediaContent;