import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const QuizGenerator = () => {
    const [formData, setFormData] = useState({
        topic: '',
        num_questions: 5,
        question_type: 'multiple-choice',
    });
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
        setQuiz(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.topic.trim()) {
            setError('Please provide a topic for the quiz.');
            return;
        }

        setLoading(true);
        setError(null);
        setQuiz(null);

        try {
            const response = await axios.post(
                `${API_BASE}/quiz/generate-quiz`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setQuiz(response.data.quiz || []);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error generating quiz. Please try again.');
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
                        Quiz Generator
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
                    <p className="mb-2">Generate multiple-choice quizzes from any topic.</p>
                    <p className="text-sm">Enter a topic and select options to create questions with answers.</p>
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
                                    placeholder="e.g., Artificial Intelligence..."
                                />
                            </div>
                            <div>
                                <label htmlFor="num_questions" className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Questions
                                </label>
                                <input
                                    id="num_questions"
                                    name="num_questions"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={formData.num_questions}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="question_type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Question Type
                                </label>
                                <select
                                    id="question_type"
                                    name="question_type"
                                    value={formData.question_type}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="multiple-choice">Multiple Choice</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !formData.topic.trim()}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !formData.topic.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                                style={{ backgroundColor: loading || !formData.topic.trim() ? '#9CA3AF' : '#1E3A8A' }}
                            >
                                {loading ? 'Generating...' : 'Generate Quiz'}
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
                        {quiz && quiz.length > 0 ? (
                            <div className="w-full h-96 overflow-y-auto space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Generated Quiz
                                </h2>
                                <div className="space-y-4">
                                    {quiz.map((q, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-md font-medium text-blue-800 mb-2">Question {q.q_no}</h3>
                                            <p className="text-gray-700 mb-4">{q.question}</p>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                {q.options.map((option, optIndex) => (
                                                    <li key={optIndex} className="text-sm">
                                                        <span className={option === q.correct_answer ? 'font-bold text-green-600' : 'text-gray-700'}>
                                                            {String.fromCharCode(97 + optIndex)}). {option}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className="text-sm text-green-600 font-medium mt-2">
                                                Correct Answer: {q.correct_answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : !loading && !error ? (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500">
                                Your generated quiz will appear here
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizGenerator;