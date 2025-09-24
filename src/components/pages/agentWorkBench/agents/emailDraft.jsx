import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const EmailDraft = () => {
    const [formData, setFormData] = useState({
        sender_name: "Your Name",
        recipient_name: "",
        recipient_email: "",
        subject: "",
        context: "",
        tone: "Professional",
        purpose: "",
        audience: "",
        max_length: 400,
        generate_follow_up: true,
    });
    const [draft, setDraft] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setError(null);
        setDraft(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.context.trim()) {
            setError('Please provide context for the email.');
            return;
        }

        setLoading(true);
        setError(null);
        setDraft(null);

        try {
            const response = await axios.post(`${API_BASE}/email_drafting/draft`, formData);
            setDraft(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error drafting email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!draft) return;

        try {
            const response = await axios.post(`${API_BASE}/email_drafting/draft/download`, formData, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'email_draft.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Error downloading PDF. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-5xl mt-25">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        Email Drafting Agent
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
                    <p className="mb-2">Draft professional emails based on context and preferences.</p>
                    <p className="text-sm">Fill in the details and generate an email with optional PDF download.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="sender_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Sender Name
                                </label>
                                <input
                                    id="sender_name"
                                    name="sender_name"
                                    value={formData.sender_name}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="recipient_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Recipient Name
                                </label>
                                <input
                                    id="recipient_name"
                                    name="recipient_name"
                                    value={formData.recipient_name}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="recipient_email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Recipient Email
                                </label>
                                <input
                                    id="recipient_email"
                                    name="recipient_email"
                                    value={formData.recipient_email}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>
                                <input
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">
                                    Context
                                </label>
                                <textarea
                                    id="context"
                                    name="context"
                                    value={formData.context}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24 text-sm"
                                    placeholder="e.g., Follow up on the project timeline discussion..."
                                />
                            </div>
                            <div>
                                <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tone
                                </label>
                                <select
                                    id="tone"
                                    name="tone"
                                    value={formData.tone}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="Professional">Professional</option>
                                    <option value="Casual">Casual</option>
                                    <option value="Persuasive">Persuasive</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                                    Purpose
                                </label>
                                <input
                                    id="purpose"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="e.g., Follow-up, Cold outreach..."
                                />
                            </div>
                            <div>
                                <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
                                    Audience
                                </label>
                                <input
                                    id="audience"
                                    name="audience"
                                    value={formData.audience}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="e.g., Manager, Customer..."
                                />
                            </div>
                            <div>
                                <label htmlFor="max_length" className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Length (words)
                                </label>
                                <input
                                    id="max_length"
                                    name="max_length"
                                    type="number"
                                    value={formData.max_length}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="generate_follow_up"
                                    name="generate_follow_up"
                                    type="checkbox"
                                    checked={formData.generate_follow_up}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label htmlFor="generate_follow_up" className="text-sm text-gray-700">
                                    Generate Follow-up
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !formData.context.trim()}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !formData.context.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: loading || !formData.context.trim() ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {loading ? 'Drafting...' : 'Generate Email Draft'}
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
                        {draft ? (
                            <div className="w-full h-96 overflow-y-auto space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Email Draft
                                </h2>
                                {draft.subject && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Subject</h3>
                                        <p className="text-gray-700 text-sm">{draft.subject}</p>
                                    </div>
                                )}
                                {draft.greeting && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Greeting</h3>
                                        <p className="text-gray-700 text-sm">{draft.greeting}</p>
                                    </div>
                                )}
                                {draft.body && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Body</h3>
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{draft.body}</p>
                                    </div>
                                )}
                                {draft.signoff && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Sign-off</h3>
                                        <p className="text-gray-700 text-sm">{draft.signoff}</p>
                                    </div>
                                )}
                                {draft.signature && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Signature</h3>
                                        <p className="text-gray-700 text-sm">{draft.signature}</p>
                                    </div>
                                )}
                                {draft.suggestions && draft.suggestions.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Suggestions</h3>
                                        <ul className="list-disc list-inside text-gray-700 text-sm">
                                            {draft.suggestions.map((suggestion, index) => (
                                                <li key={index}>{suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {draft.follow_up_template && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Follow-up Template</h3>
                                        <p className="text-gray-700 text-sm">{draft.follow_up_template}</p>
                                    </div>
                                )}
                                <button
                                    onClick={handleDownload}
                                    disabled={!draft}
                                    className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${!draft ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                                    style={{ backgroundColor: !draft ? '#9CA3AF' : '#16A34A' }}
                                >
                                    Download PDF
                                </button>
                            </div>
                        ) : !loading && !error ? (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500">
                                Your email draft will appear here
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailDraft;