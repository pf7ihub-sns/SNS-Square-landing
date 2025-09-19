import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const MomGenerator = () => {
    const [inputMode, setInputMode] = useState('text');
    const [formData, setFormData] = useState({ raw_text: '', file: null });
    const [notes, setNotes] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setNotes(null);
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
        setError(null);
        setNotes(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.raw_text.trim() && !formData.file) {
            setError('Please enter text or upload a file (TXT, DOCX, or PDF).');
            return;
        }

        setLoading(true);
        setError(null);
        setNotes(null);

        try {
            let response;
            const data = new FormData();
            if (inputMode === 'text' && formData.raw_text.trim()) {
                data.append('raw_text', formData.raw_text);
                response = await axios.post(`${API_BASE}/note_agent/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else if (inputMode === 'file' && formData.file) {
                data.append('file', formData.file);
                response = await axios.post(`${API_BASE}/note_agent/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            if (response.data.notes) {
                setNotes(response.data.notes);
            } else if (response.data.error) {
                setError(response.data.error);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Error generating meeting notes. Please try again.');
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
                        Meeting Notes Generator
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
                    <p className="mb-2">Generate structured meeting notes from transcripts.</p>
                    <p className="text-sm">Enter text or upload a TXT, DOCX, or PDF file to create detailed notes.</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Input Mode
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="inputMode"
                                        value="text"
                                        checked={inputMode === 'text'}
                                        onChange={() => setInputMode('text')}
                                        className="mr-2"
                                    />
                                    Text
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="inputMode"
                                        value="file"
                                        checked={inputMode === 'file'}
                                        onChange={() => setInputMode('file')}
                                        className="mr-2"
                                    />
                                    File
                                </label>
                            </div>
                        </div>
                        {inputMode === 'text' ? (
                            <div>
                                <label htmlFor="raw_text" className="block text-sm font-medium text-gray-700 mb-1">
                                    Transcript Text
                                </label>
                                <textarea
                                    id="raw_text"
                                    name="raw_text"
                                    value={formData.raw_text}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y h-32 text-sm"
                                    placeholder="Enter meeting transcript here..."
                                />
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload File (TXT, DOCX, or PDF)
                                </label>
                                <input
                                    id="file"
                                    type="file"
                                    accept=".txt,.docx,.pdf"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || (!formData.raw_text.trim() && !formData.file)}
                            className={`w-full py-2 px-4 rounded-md mt-5 text-white font-medium transition-colors ${loading || (!formData.raw_text.trim() && !formData.file) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                            style={{ backgroundColor: loading || (!formData.raw_text.trim() && !formData.file) ? '#9CA3AF' : '#1E3A8A' }}
                        >
                            {loading ? 'Generating...' : 'Generate Notes'}
                        </button>
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
                        {notes && (
                            <div className="w-full h-96 overflow-y-auto space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    Meeting Notes
                                </h2>
                                {notes.meeting_title && notes.meeting_title !== "Not Found" && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Meeting Title</h3>
                                        <p className="text-gray-700 text-sm">{notes.meeting_title}</p>
                                    </div>
                                )}
                                {notes.date && notes.date !== "Not Found" && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Date</h3>
                                        <p className="text-gray-700 text-sm">{notes.date}</p>
                                    </div>
                                )}
                                {notes.participants.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Participants</h3>
                                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                            {notes.participants.map((participant, index) => (
                                                <li key={index}>{participant}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {notes.agenda_points.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Agenda Points</h3>
                                        <ul className="list-decimal list-inside text-gray-700 text-sm space-y-1">
                                            {notes.agenda_points.map((point, index) => (
                                                <li key={index}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {(notes.discussion_summary.yesterday.length > 0 || notes.discussion_summary.today.length > 0) && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Discussion Summary</h3>
                                        {notes.discussion_summary.yesterday.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-blue-600">Yesterday</h4>
                                                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                                    {notes.discussion_summary.yesterday.map((item, index) => (
                                                        <li key={index}>{`${item.task} (Assignee: ${item.assignee}, Status: ${item.status}, Blockers: ${item.blockers || 'None'}, Deadline: ${item.deadline || 'N/A'})`}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {notes.discussion_summary.today.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-blue-600">Today</h4>
                                                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                                    {notes.discussion_summary.today.map((item, index) => (
                                                        <li key={index}>{`${item.task} (Assignee: ${item.assignee}, Status: ${item.status}, Blockers: ${item.blockers || 'None'}, Deadline: ${item.deadline || 'N/A'})`}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {notes.decisions.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Decisions</h3>
                                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                            {notes.decisions.map((decision, index) => (
                                                <li key={index}>{decision}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {notes.action_items.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Action Items</h3>
                                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                            {notes.action_items.map((item, index) => (
                                                <li key={index}>{`${item.task} (Owner: ${item.owner}, Deadline: ${item.deadline || 'N/A'})`}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {notes.metadata && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-md font-medium text-blue-800 mb-2">Metadata</h3>
                                        <p className="text-gray-700 text-sm">Meeting Name: {notes.metadata.meeting_name}</p>
                                        <p className="text-gray-700 text-sm">Duration: {notes.metadata.duration}</p>
                                        <p className="text-gray-700 text-sm">Number of Speakers: {notes.metadata.number_of_speakers}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {!loading && !error && !notes && (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500">
                                Your meeting notes will appear here
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MomGenerator;