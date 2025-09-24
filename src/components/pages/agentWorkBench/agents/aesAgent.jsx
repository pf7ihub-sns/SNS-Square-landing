import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, AlertCircle } from 'lucide-react';

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

const AesAgent = () => {
    const [mode, setMode] = useState('encrypt');
    const [input, setInput] = useState('');
    const [key, setKey] = useState(''); // For decryption
    const [iv, setIv] = useState('');   // For decryption
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) {
            setError('Please enter data to process.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        let message = '';
        if (mode === 'encrypt') {
            message = `encrypt this: ${input.trim()}`;
        } else {
            if (!key.trim() || !iv.trim()) {
                setError('Please provide both key and IV for decryption.');
                setLoading(false);
                return;
            }
            message = `decrypt this: ${input.trim()}:${key.trim()}:${iv.trim()}`;
        }

        try {
            const response = await axios.post(`${API_BASE}/aes/chat`, { message }, {
                headers: { 'Content-Type': 'application/json' },
            });
            const { response: resultText, status } = response.data;

            if (status === 'success') {
                if (resultText.includes(':')) {
                    // Encryption output (encrypted_data:key:iv)
                    const [encryptedData, keyPart, ivPart] = resultText.split(':');
                    setResult({ encryptedData, key: keyPart, iv: ivPart, status });
                } else {
                    // Decryption output (plain text)
                    setResult({ decryptedData: resultText, status });
                }
            } else {
                setError(resultText); // Error message from agent
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Error processing request. Please check your input or backend logs.');
            console.error('API Error:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="w-full max-w-5xl mt-25">
                    {/* Header */}
                    <div className="relative">
                        <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            AES Agent
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
                        <p className="mb-2">Encrypt or decrypt text using AES encryption.</p>
                        <p className="text-sm">Select mode and provide data (key and IV required for decryption).</p>
                    </div>

                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mode
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="encrypt"
                                            checked={mode === 'encrypt'}
                                            onChange={() => setMode('encrypt')}
                                            className="mr-2"
                                        />
                                        Encrypt
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="decrypt"
                                            checked={mode === 'decrypt'}
                                            onChange={() => setMode('decrypt')}
                                            className="mr-2"
                                        />
                                        Decrypt
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-1">
                                    {mode === 'encrypt' ? 'Data to Encrypt' : 'Encrypted Data (Base64)'}
                                </label>
                                <textarea
                                    id="input"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y h-32 text-sm"
                                    placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter base64 encoded encrypted data...'}
                                />
                            </div>
                            {mode === 'decrypt' && (
                                <>
                                    <div>
                                        <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
                                            Key (Base64 Encoded 256-bit)
                                        </label>
                                        <input
                                            id="key"
                                            value={key}
                                            onChange={(e) => setKey(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="Enter base64 encoded key..."
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="iv" className="block text-sm font-medium text-gray-700 mb-1">
                                            IV (Base64 Encoded 16-byte)
                                        </label>
                                        <input
                                            id="iv"
                                            value={iv}
                                            onChange={(e) => setIv(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="Enter base64 encoded IV..."
                                        />
                                    </div>
                                </>
                            )}
                            <button
                                type="submit"
                                disabled={loading || !input.trim() || (mode === 'decrypt' && (!key.trim() || !iv.trim()))}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !input.trim() || (mode === 'decrypt' && (!key.trim() || !iv.trim())) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: loading || !input.trim() || (mode === 'decrypt' && (!key.trim() || !iv.trim())) ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {loading ? `${mode === 'encrypt' ? 'Encrypting' : 'Decrypting'}...` : `${mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}`}
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
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        {result && (
                            <div className="w-full h-96 overflow-y-auto space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    {mode === 'encrypt' ? 'Encryption Result' : 'Decryption Result'}
                                </h2>
                                {result.encryptedData && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Encrypted Data</h3>
                                        <p className="text-gray-700 text-sm break-all">{result.encryptedData}</p>
                                    </div>
                                )}
                                {result.decryptedData && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Decrypted Data</h3>
                                        <p className="text-gray-700 text-sm">{result.decryptedData}</p>
                                    </div>
                                )}
                                {result.key && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Key</h3>
                                        <p className="text-gray-700 text-sm break-all">{result.key}</p>
                                    </div>
                                )}
                                {result.iv && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">IV</h3>
                                        <p className="text-gray-700 text-sm break-all">{result.iv}</p>
                                    </div>
                                )}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-md font-medium text-blue-800 mb-2">Status</h3>
                                    <p className="text-gray-700 text-sm">{result.status}</p>
                                </div>
                            </div>
                        )}
                        {!loading && !error && !result && (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500">
                                Your result will appear here
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default AesAgent;