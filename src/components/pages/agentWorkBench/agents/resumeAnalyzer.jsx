import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const ResumeAnalyzer = () => {
    const [formData, setFormData] = useState({ file: null, job_role: '' });
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setAnalysis(null);
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
        setError(null);
        setAnalysis(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.file) {
            setError('Please upload a PDF resume.');
            return;
        }

        setLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('file', formData.file);
            if (formData.job_role.trim()) {
                formDataToSend.append('job_role', formData.job_role);
            }

            const response = await axios.post(
                `${API_BASE}/resume_agent/analyze-resume`,
                formDataToSend,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            setAnalysis(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error analyzing resume. Please try again.');
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
                        Resume Analyzer
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
                    <p className="mb-2">Analyze a resume and match it with a job role.</p>
                    <p className="text-sm">Upload a PDF resume and optionally specify a job role for matching.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Resume (PDF)
                                </label>
                                <input
                                    id="file"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="job_role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Role (Optional)
                                </label>
                                <input
                                    id="job_role"
                                    name="job_role"
                                    value={formData.job_role}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="e.g., Full Stack Developer..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !formData.file}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !formData.file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: loading || !formData.file ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {loading ? 'Analyzing...' : 'Analyze Resume'}
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
                        {analysis && (
                            <div className="w-full h-96 overflow-y-auto space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Resume Analysis
                                </h2>
                                {analysis.extracted_text_preview && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Extracted Text Preview</h3>
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{analysis.extracted_text_preview}</p>
                                    </div>
                                )}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-md font-medium text-blue-800 mb-2">Scores</h3>
                                    <p className="text-gray-700 text-sm">Completeness: {analysis.output?.completeness || 0}%</p>
                                    <p className="text-gray-700 text-sm">Clarity: {analysis.output?.clarity || 0}%</p>
                                    <p className="text-gray-700 text-sm">Relevance: {analysis.output?.relevance || 0}%</p>
                                    {analysis.output?.job_match_score !== undefined && (
                                        <p className="text-gray-700 text-sm">Job Match Score: {analysis.output.job_match_score}%</p>
                                    )}
                                </div>
                                {analysis.output?.skills_extracted.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Extracted Skills</h3>
                                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                            {analysis.output.skills_extracted.map((skill, index) => (
                                                <li key={index}>{skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {(analysis.output?.education.length > 0 || analysis.output?.experience.length > 0 ||
                                    analysis.output?.certifications.length > 0 || analysis.output?.achievements.length > 0) && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-md font-medium text-blue-800 mb-2">Sections</h3>
                                            {analysis.output.education.length > 0 && (
                                                <div className="mb-2">
                                                    <h4 className="text-sm font-medium text-blue-600">Education</h4>
                                                    <p className="text-gray-700 text-sm">{analysis.output.education[0] || 'N/A'}</p>
                                                </div>
                                            )}
                                            {analysis.output.experience.length > 0 && (
                                                <div className="mb-2">
                                                    <h4 className="text-sm font-medium text-blue-600">Experience</h4>
                                                    <p className="text-gray-700 text-sm">{analysis.output.experience[0] || 'N/A'}</p>
                                                </div>
                                            )}
                                            {analysis.output.certifications.length > 0 && (
                                                <div className="mb-2">
                                                    <h4 className="text-sm font-medium text-blue-600">Certifications</h4>
                                                    <p className="text-gray-700 text-sm">{analysis.output.certifications[0] || 'N/A'}</p>
                                                </div>
                                            )}
                                            {analysis.output.achievements.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-blue-600">Achievements</h4>
                                                    <p className="text-gray-700 text-sm">{analysis.output.achievements[0] || 'N/A'}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                {(analysis.output?.feedback.length > 0 || analysis.output?.job_feedback.length > 0) && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Feedback</h3>
                                        {analysis.output.feedback.length > 0 && (
                                            <div className="mb-2">
                                                <h4 className="text-sm font-medium text-blue-600">Resume Feedback</h4>
                                                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                                    {analysis.output.feedback.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {analysis.output.job_feedback.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-blue-600">Job Match Feedback</h4>
                                                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                                    {analysis.output.job_feedback.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        {!loading && !error && !analysis && (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500">
                                Your resume analysis will appear here
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeAnalyzer;