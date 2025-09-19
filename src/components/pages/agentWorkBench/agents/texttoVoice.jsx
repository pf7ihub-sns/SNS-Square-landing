import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ArrowLeft, AlertCircle, Play, Download } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 text-center text-red-600">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">Something Went Wrong</h2>
                    <p className="text-sm">{this.state.error?.message}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const API_BASE = "http://127.0.0.1:8000";

const TexttoVoice = () => {
    const [text, setText] = useState('');
    const [audioUrl, setAudioUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const audioRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) {
            setError('Please enter text to convert to speech.');
            return;
        }

        setLoading(true);
        setError(null);
        setAudioUrl(null);

        try {
            const response = await axios.post(
                `${API_BASE}/text-to-voice/`,
                { text: text.trim() },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000,
                }
            );

            let audioPath = response.data.audio_file;
            // Normalize path to use forward slashes
            audioPath = audioPath.replace(/\\/g, '/');
            if (!audioPath.startsWith('temp_audio/')) {
                throw new Error('Invalid audio file path received from server.');
            }
            const fullUrl = `${API_BASE}/${audioPath}`;
            setAudioUrl(fullUrl);

            // Auto-play the audio after setting the URL
            if (audioRef.current) {
                audioRef.current.load(); // Reload audio element with new source
                audioRef.current.play().catch((err) => {
                    setError('Failed to auto-play audio: ' + err.message);
                });
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.audio_file ||
                err.message ||
                'Error generating audio. Please try again.';
            setError(errorMessage);
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.play().catch((err) => {
                setError('Failed to play audio: ' + err.message);
            });
        }
    };

    const handleDownload = () => {
        if (audioUrl) {
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = `speech_${Date.now()}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="w-full max-w-5xl mt-22">
                    {/* Header */}
                    <div className="relative">
                        <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            Text-to-Voice
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
                        <p className="text-sm">Enter text to generate audio with the default voice.</p>
                    </div>

                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                                    Text
                                </label>
                                <textarea
                                    id="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y h-32 text-sm"
                                    placeholder="Enter text to convert to speech..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !text.trim()}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !text.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: loading || !text.trim() ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {loading ? 'Generating...' : 'Generate Audio'}
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
                        {audioUrl && (
                            <div className="w-full h-96 overflow-y-auto space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Audio Result
                                </h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-md font-medium text-blue-800 mb-2">Audio</h3>
                                    <audio ref={audioRef} controls className="w-full">
                                        <source src={audioUrl} type="audio/mp3" />
                                        Your browser does not support the audio element.
                                    </audio>
                                    <div className="mt-2 flex gap-4">
                                        <button
                                            onClick={handlePlay}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            <Play className="w-4 h-4" /> Play
                                        </button>
                                        <button
                                            onClick={handleDownload}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <Download className="w-4 h-4" /> Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!loading && !error && !audioUrl && (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500">
                                Your audio will appear here after generation
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default TexttoVoice;