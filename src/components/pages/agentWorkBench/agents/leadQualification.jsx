import { useState, useEffect } from 'react';
import { Search, Filter, Download, ThumbsUp, ThumbsDown, X, AlertCircle, CheckCircle, ExternalLink, RefreshCw, Loader, Home, BarChart3, FileText, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LeadQualification() {
    const API_BASE_URL = 'http://localhost:8000/lead_qualification';

    // State management
    const [leads, setLeads] = useState([]);
    const [feedbackList, setFeedbackList] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [currentView, setCurrentView] = useState('home');
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [stats, setStats] = useState(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterSource, setFilterSource] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    
    // Feedback form state
    const [feedbackType, setFeedbackType] = useState('Good');
    const [feedbackComment, setFeedbackComment] = useState('');
    
    // Export state
    const [exportFormat, setExportFormat] = useState('pdf');
    const [exportMessage, setExportMessage] = useState(null);
    const [selectedLeads, setSelectedLeads] = useState([]);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const leadsPerPage = 10;

    // Fetch leads on mount
    useEffect(() => {
        fetchLeads();
        fetchStatistics();
        fetchFeedbackHistory();
    }, []);

    // API Calls
    const fetchLeads = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/leads?limit=500`);
            const data = await response.json();
            setLeads(data.leads || []);
        } catch (error) {
            showMessage('error', 'Failed to fetch leads: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/statistics`);
            const data = await response.json();
            setStats(data.statistics);
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        }
    };

    const fetchFeedbackHistory = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/feedback-history`);
            const data = await response.json();
            setFeedbackList(data.feedback || []);
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
        }
    };

    const syncSalesforce = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/sync-salesforce`, {
                method: 'POST'
            });
            const data = await response.json();
            showMessage('success', 'Salesforce sync completed successfully!');
            await fetchLeads();
            await fetchStatistics();
        } catch (error) {
            showMessage('error', 'Sync failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const processAllLeads = async () => {
        setProcessing(true);
        try {
            const response = await fetch(`${API_BASE_URL}/process-batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ limit: 100, filter_status: 'new' })
            });
            const data = await response.json();
            showMessage('success', `Processed ${data.successful} leads successfully!`);
            await fetchLeads();
            await fetchStatistics();
        } catch (error) {
            showMessage('error', 'Processing failed: ' + error.message);
        } finally {
            setProcessing(false);
        }
    };

    const processSingleLead = async (leadId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/process-lead`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead_id: leadId })
            });
            const data = await response.json();
            
            if (data.status === 'completed') {
                showMessage('success', 'Lead processed successfully!');
                await fetchLeads();
            } else if (data.status === 'spam_detected') {
                showMessage('warning', 'Lead marked as spam');
                await fetchLeads();
            } else {
                showMessage('error', 'Processing failed: ' + (data.errors?.join(', ') || 'Unknown error'));
            }
        } catch (error) {
            showMessage('error', 'Failed to process lead: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeadDetails = async (leadId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/lead-score/${leadId}`);
            const data = await response.json();
            setSelectedLead(data);
            setShowDetailModal(true);
        } catch (error) {
            showMessage('error', 'Failed to fetch lead details: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const submitFeedback = async () => {
        if (!selectedLead) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead_id: selectedLead.lead_id,
                    feedback_type: feedbackType.toLowerCase().replace(' ', '_'),
                    comments: feedbackComment
                })
            });
            const data = await response.json();
            
            showMessage('success', 'Feedback submitted successfully!');
            setFeedbackType('Good');
            setFeedbackComment('');
            setShowFeedbackModal(false);
            await fetchFeedbackHistory();
        } catch (error) {
            showMessage('error', 'Failed to submit feedback: ' + error.message);
        }
    };

    const downloadReport = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/report?format=${exportFormat}&priority_filter=${filterPriority === 'all' ? '' : filterPriority}`);
            
            if (!response.ok) throw new Error('Export failed');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `lead_report_${new Date().toISOString().split('T')[0]}.${exportFormat === 'excel' ? 'xlsx' : exportFormat}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showMessage('success', `Report exported successfully as ${exportFormat.toUpperCase()}!`);
        } catch (error) {
            showMessage('error', 'Export failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setExportMessage({ type, text });
        setTimeout(() => setExportMessage(null), 5000);
    };

    const toggleLeadSelection = (leadId) => {
        setSelectedLeads(prev => 
            prev.includes(leadId) 
                ? prev.filter(id => id !== leadId)
                : [...prev, leadId]
        );
    };

    // Filter and search leads
    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === 'all' || lead.priority?.toLowerCase() === filterPriority.toLowerCase();
        const matchesStatus = filterStatus === 'all' || lead.processing_status === filterStatus;
        const matchesSource = filterSource === 'all' || lead.lead_source === filterSource;
        
        return matchesSearch && matchesPriority && matchesStatus && matchesSource;
    });

    // Pagination
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

    const getPriorityColor = (priority) => {
        if (!priority) return 'bg-gray-100 text-gray-700';
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-green-100 text-green-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'low': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityIcon = (priority) => {
        if (!priority) return '●';
        return '●';
    };

    const getFeedbackColor = (feedback) => {
        if (!feedback) return 'bg-gray-100 text-gray-700';
        switch (feedback.toLowerCase()) {
            case 'good': return 'bg-green-100 text-green-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'bad': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Sidebar
    const Sidebar = () => (
        <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col pt-20">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Lead</h1>
                </div>
            </div>
            
            <nav className="flex-1 p-4">
                <button
                    onClick={() => setCurrentView('home')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                        currentView === 'home'
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                </button>
                
                <button
                    onClick={() => setCurrentView('leads')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                        currentView === 'leads'
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <BarChart3 className="w-5 h-5" />
                    <span>Leads</span>
                </button>
                
                <button
                    onClick={() => setCurrentView('reports')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                        currentView === 'reports'
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <FileText className="w-5 h-5" />
                    <span>Reports</span>
                </button>
                
                <button
                    onClick={() => setCurrentView('feedback')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                        currentView === 'feedback'
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <MessageSquare className="w-5 h-5" />
                    <span>Feedback</span>
                </button>
            </nav>
        </div>
    );

    // Home/Dashboard View
    const renderHome = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-gray-500 text-sm mt-1">Enter a simple prompt to generate stunning UIs.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Leads</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.total_leads?.toLocaleString() || '40,689'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Verified</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.verification?.verified?.toLocaleString() || '40,689'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Not Verified</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.verification?.unverified?.toLocaleString() || '40,689'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Spam</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.verification?.spam?.toLocaleString() || '40,689'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leads Section */}
            <div className="bg-white rounded-2xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Leads</h3>
                            <p className="text-blue-600 text-sm mt-1">Total: {filteredLeads.length.toLocaleString()}</p>
                            <p className="text-gray-500 text-sm mt-1">A descriptive body text comes here</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                                <span className="text-green-600 text-xl">↑</span>
                                <span className="text-sm text-gray-600">High Priority:</span>
                                <span className="font-semibold text-gray-900">{stats?.priority_distribution?.high?.toLocaleString() || '10293'}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                                <span className="text-yellow-600 text-xl">−</span>
                                <span className="text-sm text-gray-600">Medium Priority:</span>
                                <span className="font-semibold text-gray-900">{stats?.priority_distribution?.medium?.toLocaleString() || '89,000'}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                                <span className="text-red-600 text-xl">↓</span>
                                <span className="text-sm text-gray-600">Low Priority:</span>
                                <span className="font-semibold text-gray-900">{stats?.priority_distribution?.low?.toLocaleString() || '2040'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leads Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentLeads.map((lead) => (
                                <tr key={lead.lead_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phone || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.company || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.domain || lead.company || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {lead.lead_score ? lead.lead_score.toFixed(0) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                                            <span>{getPriorityIcon(lead.priority)}</span>
                                            {lead.priority || 'Unscored'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => fetchLeadDetails(lead.lead_id)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            View Lead
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Reports View
    const renderReports = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Report</h2>
                    <p className="text-gray-500 text-sm mt-1">Enter a simple prompt to generate stunning UIs.</p>
                </div>
                <button
                    onClick={downloadReport}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <ExternalLink className="w-5 h-5" />}
                    Export Lead
                </button>
            </div>

            {/* Report Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <tbody className="bg-white">
                            {currentLeads.map((lead) => (
                                <tr key={lead.lead_id} className="border-b border-gray-200">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedLeads.includes(lead.lead_id)}
                                            onChange={() => toggleLeadSelection(lead.lead_id)}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="flex gap-8">
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 mb-1">Name</p>
                                                    <p className="text-sm font-medium text-gray-900">{lead.name || 'N/A'}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                                    <p className="text-sm text-gray-900">{lead.email || 'N/A'}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 mb-1">Company</p>
                                                    <p className="text-sm text-gray-900">{lead.company || 'N/A'}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 mb-1">Score</p>
                                                    <p className="text-sm font-semibold text-gray-900">{lead.lead_score ? lead.lead_score.toFixed(0) : 'N/A'}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                                                        <span>{getPriorityIcon(lead.priority)}</span>
                                                        {lead.priority || 'Unscored'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Feedback History View
    const renderFeedback = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Feedback History</h2>
                    <p className="text-gray-500 text-sm mt-1">Enter a simple prompt to generate stunning UIs.</p>
                </div>
                <button
                    onClick={() => {
                        if (leads.length > 0) {
                            setSelectedLead(leads[0]);
                            setShowFeedbackModal(true);
                        }
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                    Provide Feedback
                </button>
            </div>

            {/* Feedback Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {feedbackList.map((feedback, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feedback.lead_name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getFeedbackColor(feedback.feedback_type)}`}>
                                            <span>{getPriorityIcon(feedback.feedback_type)}</span>
                                            {feedback.feedback_type || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{feedback.comments || 'Great Lead very responsive'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.user || 'Sales 1'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.date || feedback.company || 'TechSpark Solutions'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded disabled:opacity-50"
                    >
                        ← Back
                    </button>
                    {[1, 2, 3, 4, 5].map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm rounded ${
                                currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 5))}
                        disabled={currentPage === (totalPages || 5)}
                        className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded disabled:opacity-50"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );

    // Lead Detail Modal
    const renderDetailModal = () => {
        if (!selectedLead) return null;

        const scoreBreakdown = selectedLead.score_breakdown?.rule_based?.breakdown || {};
        const designationScore = scoreBreakdown.designation_score || 0;
        const companyScore = scoreBreakdown.company_score || 0;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowDetailModal(false)} className="text-blue-600 hover:text-blue-800">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    // Mark as verified logic
                                    showMessage('success', 'Lead marked as verified!');
                                }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                Mark as Verified
                            </button>
                            <button
                                onClick={() => {
                                    // Flag as spam logic
                                    showMessage('warning', 'Lead flagged as spam!');
                                }}
                                className="px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium"
                            >
                                Flag as Spam
                            </button>
                            <button
                                onClick={() => {
                                    setShowFeedbackModal(true);
                                    setShowDetailModal(false);
                                }}
                                className="px-6 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
                            >
                                Provide Feedback
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-3 gap-6">
                            {/* Left Column - Personal Info */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-center">
                                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-4xl font-bold text-blue-600">
                                            {selectedLead.name?.charAt(0) || 'H'}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-blue-600 mb-4">Personal Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Full Name:</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Email:</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Phone:</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Status:</p>
                                            <p className="text-sm font-medium text-green-600">{selectedLead.status || 'Verified'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Date Added:</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.date_added || '20/06/2020'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Source:</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.source || 'Form'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-blue-600 mb-4">Company Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Company Name:</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.company || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Contact Info & Score */}
                            <div className="col-span-2 space-y-6">
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-blue-600 mb-4">Contact Information</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Contact Name:</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.contact_name || 'John doe'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Title:</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.title || 'CTO'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Title:</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedLead.years || '5 Years'}</p>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="text-sm text-gray-500 mb-1">LinkedIn:</p>
                                            <a href={selectedLead.linkedin || '#'} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                                                View Profile <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-blue-600 mb-4">Lead Score Breakdown</h3>
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Total Score:</p>
                                            <p className="text-3xl font-bold text-gray-900">{selectedLead.lead_score?.toFixed(0) || '85'}/100</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Priority Level:</p>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedLead.priority)}`}>
                                                <span>{getPriorityIcon(selectedLead.priority)}</span>
                                                {selectedLead.priority || 'High'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="text-center">
                                            <h4 className="text-sm font-medium text-gray-900 mb-4">Designation Score</h4>
                                            <div className="relative w-48 h-48 mx-auto">
                                                <svg className="transform -rotate-90 w-48 h-48">
                                                    <circle
                                                        cx="96"
                                                        cy="96"
                                                        r="80"
                                                        stroke="#EAECF0"
                                                        strokeWidth="16"
                                                        fill="none"
                                                    />
                                                    <circle
                                                        cx="96"
                                                        cy="96"
                                                        r="80"
                                                        stroke="#155DFC"
                                                        strokeWidth="16"
                                                        fill="none"
                                                        strokeDasharray={`${(designationScore / 30) * 502.4} 502.4`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-3xl font-bold text-gray-900">{designationScore.toFixed(0)}/30</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <h4 className="text-sm font-medium text-gray-900 mb-4">Company Score</h4>
                                            <div className="relative w-48 h-48 mx-auto">
                                                <svg className="transform -rotate-90 w-48 h-48">
                                                    <circle
                                                        cx="96"
                                                        cy="96"
                                                        r="80"
                                                        stroke="#EAECF0"
                                                        strokeWidth="16"
                                                        fill="none"
                                                    />
                                                    <circle
                                                        cx="96"
                                                        cy="96"
                                                        r="80"
                                                        stroke="#155DFC"
                                                        strokeWidth="16"
                                                        fill="none"
                                                        strokeDasharray={`${(companyScore / 30) * 502.4} 502.4`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-3xl font-bold text-gray-900">{companyScore.toFixed(0)}/30</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Feedback Modal
    const renderFeedbackModal = () => {
        if (!selectedLead) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="bg-blue-600 text-white p-6 rounded-t-2xl">
                        <h2 className="text-xl font-bold">Provide Feedback</h2>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Lead</p>
                            <p className="text-base font-semibold text-gray-900">{selectedLead.name} - {selectedLead.company}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
                            <select
                                value={feedbackType}
                                onChange={(e) => setFeedbackType(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Good">Good</option>
                                <option value="Medium">Medium</option>
                                <option value="Bad">Bad</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Comment (Optional)</label>
                            <textarea
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                placeholder="Add any additional comments"
                                rows="4"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitFeedback}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                Export Lead
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Leads Table View
    const renderLeadsTable = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
                    <p className="text-blue-600 text-sm mt-1">Total: {filteredLeads.length.toLocaleString()}</p>
                    <p className="text-gray-500 text-sm mt-1">Enter a simple prompt to generate stunning UIs.</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Filters Dropdown */}
            {showFilters && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All</option>
                                <option value="completed">Completed</option>
                                <option value="new">New</option>
                                <option value="spam">Spam</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                            <select
                                value={filterSource}
                                onChange={(e) => setFilterSource(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All</option>
                                <option value="Web Form">Web Form</option>
                                <option value="CRM">CRM</option>
                                <option value="Email">Email</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Leads Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentLeads.map((lead) => (
                                <tr key={lead.lead_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phone || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.company || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.domain || lead.company || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {lead.lead_score ? lead.lead_score.toFixed(0) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                                            <span>{getPriorityIcon(lead.priority)}</span>
                                            {lead.priority || 'Unscored'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => fetchLeadDetails(lead.lead_id)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            View Lead
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex ">
            <Sidebar />
            
            <div className="flex-1 ml-64 pt-20">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {/* Alert Messages */}
                    {exportMessage && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                            exportMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
                            exportMessage.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                            'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                            {exportMessage.type === 'success' ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <AlertCircle className="w-5 h-5" />
                            )}
                            <span className="font-medium">{exportMessage.text}</span>
                        </div>
                    )}

                    {/* Render Current View */}
                    {currentView === 'home' && renderHome()}
                    {currentView === 'leads' && renderLeadsTable()}
                    {currentView === 'reports' && renderReports()}
                    {currentView === 'feedback' && renderFeedback()}
                </div>
            </div>

            {/* Modals */}
            {showDetailModal && renderDetailModal()}
            {showFeedbackModal && renderFeedbackModal()}
        </div>
    );
}