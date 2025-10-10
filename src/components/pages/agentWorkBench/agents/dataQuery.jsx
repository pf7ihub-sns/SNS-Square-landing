
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const DataQuery = () => {
    const [question, setQuestion] = useState('');
    const [topK, setTopK] = useState(10);
    const [useLLM, setUseLLM] = useState(false);
    const [answer, setAnswer] = useState('');
    const [sources, setSources] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const { docs = [] } = await (await fetch('http://127.0.0.1:8000/rag/docs')).json();
                if (isMounted) setDocuments(docs);
            } catch (error) {
                if (isMounted) console.error('Error fetching documents:', error);
            }
        };
        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);

    const fetchDocuments = async () => {
        try {
            const { docs = [] } = await (await fetch('http://127.0.0.1:8000/rag/docs')).json();
            setDocuments(docs);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const { message } = await (await fetch('http://127.0.0.1:8000/rag/upload', { method: 'POST', body: formData })).json();
            setUploadMessage(message);
            fetchDocuments();
        } catch {
            setUploadMessage('Error uploading file');
        } finally {
            setIsLoading(false);
            setFile(null);
        }
    };

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAnswer('');
        setSources([]);

        try {
            const { answer, sources } = await (await fetch('http://127.0.0.1:8000/rag/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, top_k: topK, use_llm: useLLM }),
            })).json();
            setAnswer(answer);
            setSources(sources);
        } catch {
            setAnswer('Error querying data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearStore = async () => {
        if (!window.confirm('Are you sure you want to clear the RAG store? This action cannot be undone.')) return;
        setIsLoading(true);
        try {
            const { message } = await (await fetch('http://127.0.0.1:8000/rag/clear', { method: 'DELETE' })).json();
            setUploadMessage(message);
            fetchDocuments();
        } catch {
            setUploadMessage('Error clearing store');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full max-w-5xl mt-22">
                {/* Header */}
                <div className="relative">
                    <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        RAG Data Query
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
                    <p className="mb-2">Upload files, query data, and manage your RAG store.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload File */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-lg shadow-md p-4"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload File</h2>
                        <form onSubmit={handleFileUpload} className="space-y-4">
                            <div>
                                <input
                                    type="file"
                                    accept=".csv,.json"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !file}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isLoading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: isLoading || !file ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {isLoading ? 'Uploading...' : 'Upload'}
                            </button>
                        </form>
                        {uploadMessage && <p className="mt-2 text-sm text-gray-600">{uploadMessage}</p>}
                    </motion.div>

                    {/* Query Data */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white rounded-lg shadow-md p-4"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Query Data</h2>
                        <form onSubmit={handleQuerySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Enter your question"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                                    required
                                />
                            </div>
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Top K Results</label>
                                <input
                                    type="number"
                                    value={topK}
                                    onChange={(e) => setTopK(Math.max(1, parseInt(e.target.value) || 10))}
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                                />
                            </div> */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={useLLM}
                                    onChange={(e) => setUseLLM(e.target.checked)}
                                    className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded h-4 w-4"
                                />
                                <label className="ml-2 text-sm text-gray-700">save</label>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !question}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isLoading || !question ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: isLoading || !question ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {isLoading ? 'Querying...' : 'Submit'}
                            </button>
                        </form>
                        {answer && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 h-96 overflow-y-auto">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Answer</h3>
                                <p className="text-gray-700 whitespace-pre-wrap text-sm">{answer}</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Stored Documents */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-white rounded-lg shadow-md p-6 col-span-1 lg:col-span-2"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-0">Stored Documents</h2>
                            <button
                                onClick={handleClearStore}
                                disabled={isLoading || !documents.length}
                                className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${isLoading || !documents.length ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                                style={{ backgroundColor: isLoading || !documents.length ? '#9CA3AF' : '#DC2626' }}
                            >
                                {isLoading ? 'Clearing...' : 'Clear Store'}
                            </button>
                        </div>
                        {documents.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2">
                                {documents.map((doc, index) => (
                                    <li key={index} className="text-sm text-gray-600">
                                        Source: {doc.source}, Chunks: {doc.chunks}, Rows: {doc.rows}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-600">No documents stored yet.</p>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DataQuery;