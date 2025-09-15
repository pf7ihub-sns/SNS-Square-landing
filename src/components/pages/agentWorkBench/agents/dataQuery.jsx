import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-6 sm:mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">RAG Data Query</h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Upload files, query data, and manage your RAG store.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                >
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Upload File</h2>
                    <form onSubmit={handleFileUpload} className="space-y-3 sm:space-y-4">
                        <div>
                            <input
                                type="file"
                                accept=".csv,.json"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !file}
                            className="w-full px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 text-sm sm:text-base"
                        >
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </button>
                    </form>
                    {uploadMessage && <p className="mt-2 text-sm text-gray-600">{uploadMessage}</p>}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                >
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Query Data</h2>
                    <form onSubmit={handleQuerySubmit} className="space-y-3 sm:space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Enter your question"
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Top K Results</label>
                            <input
                                type="number"
                                value={topK}
                                onChange={(e) => setTopK(Math.max(1, parseInt(e.target.value) || 10))}
                                min="1"
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={useLLM}
                                onChange={(e) => setUseLLM(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">Use LLM</label>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !question}
                            className="w-full px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 text-sm sm:text-base"
                        >
                            {isLoading ? 'Querying...' : 'Submit'}
                        </button>
                    </form>
                    {answer && (
                        <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-md sm:text-lg font-medium text-gray-900">Answer</h3>
                            <p className="text-gray-700 mt-1 sm:mt-2 whitespace-pre-wrap text-sm sm:text-base">{answer}</p>
                            {sources.length > 0 && (
                                <div className="mt-3 sm:mt-4">
                                    <h4 className="text-sm sm:text-md font-medium text-gray-900">Sources</h4>
                                    <ul className="list-disc pl-5 mt-1 sm:mt-2">
                                        {sources.map((source, index) => (
                                            <li key={index} className="text-sm text-gray-600">
                                                <strong>Metadata:</strong> {JSON.stringify(source.metadata)}<br />
                                                <strong>Preview:</strong> {source.preview}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-4 sm:mt-6"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Stored Documents</h2>
                    <button
                        onClick={handleClearStore}
                        disabled={isLoading || !documents.length}
                        className="mt-3 sm:mt-0 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50 text-sm sm:text-base"
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
    );
};

export default DataQuery;