import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const GeneralChat = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!message.trim()) {
            setError('Please enter a message.');
            return;
        }

        setLoading(true);
        setError(null);

        const updatedHistory = [...chatHistory, { role: 'User', content: message }];
        setChatHistory(updatedHistory);

        try {
            const response = await fetch(
                `${API_BASE}/general-chat-bot/chat`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            const botResponse = data.response;
            setChatHistory([...updatedHistory, { role: 'AI', content: botResponse }]);
        } catch (err) {
            setError(err.message || 'Error communicating with the bot. Please try again.');
        } finally {
            setLoading(false);
            setMessage('');
        }
    };

    const handleClearChat = () => {
        if (window.confirm('Clear all chat history?')) {
            setChatHistory([]);
        }
    };

    return (
        <div className="min-h-screen p-8 mt-18" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white text-center mb-6 p-3 sm:p-4 rounded-lg mx-8 sm:mx-12 lg:mx-0" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        General Chat
                    </h1>

                    <div className="flex items-center space-x-2 text-blue-100">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-xs sm:text-sm text-gray-600">AI Online</span>
                        <button
                            onClick={() => window.location.href = '/media-entertainment'}
                            className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-4 lg:right-4 flex items-center gap-1 sm:gap-2 text-white font-medium hover:text-blue-200 transition-colors text-sm sm:text-base p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
                        >
                            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                            <span>Back</span>
                        </button>
                    </div>
                </div>

                <div className="text-center mb-4">
                    <p className="text-gray-600">
                        Chat with SNS iHub's virtual assistant. Use English only.
                    </p>
                </div>

                {/* Main Chat Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: '70vh' }}>
                    {/* Chat Messages - Fixed Height with Scroll */}
                    <div
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white"
                        style={{ height: 'calc(70vh - 120px)' }}
                    >
                        {chatHistory.length === 0 && (
                            <div className="flex justify-center items-center h-full text-gray-500">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium">Start a conversation</p>
                                    <p className="text-sm">Send a message to begin chatting with the AI assistant</p>
                                </div>
                            </div>
                        )}

                        {chatHistory.map((entry, index) => (
                            <div key={index} className={`flex ${entry.role === 'User' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${entry.role === 'User'
                                    ? 'bg-blue-500 text-white ml-12'
                                    : 'bg-white text-gray-800 border border-gray-200 mr-12'
                                    }`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${entry.role === 'User' ? 'bg-blue-400' : 'bg-gray-400'
                                            }`}>
                                            {entry.role === 'User' ? 'U' : 'AI'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm mr-12">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 animate-pulse flex items-center justify-center text-white text-sm font-medium">
                                            AI
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area - Fixed at Bottom */}
                    <div className="border-t border-gray-200 p-6 bg-white">
                        <div className="flex gap-3">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-gray-50"
                                placeholder="Type your message here... (Press Enter to send)"
                                rows={1}
                                style={{ minHeight: '44px', maxHeight: '120px' }}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !message.trim()}
                                className={`p-3 rounded-xl text-white font-medium transition-all duration-200 ${loading || !message.trim()
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 shadow-lg hover:shadow-blue-500/25'
                                    }`}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleClearChat}
                                disabled={loading || chatHistory.length === 0}
                                className={`p-3 rounded-xl text-white font-medium transition-all duration-200 ${loading || chatHistory.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-red-500 hover:bg-red-600 hover:scale-105 shadow-lg hover:shadow-red-500/25'
                                    }`}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        {error && (
                            <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralChat;