import { useState, useEffect } from 'react';
import { Search, Filter, Download, ThumbsUp, ThumbsDown, X, AlertCircle, CheckCircle, ExternalLink, RefreshCw, Loader } from 'lucide-react';

export default function LeadQualification() {
    const API_BASE_URL = 'http://localhost:8000/lead_qualification';

    // State management
    const [leads, setLeads] = useState([]);
    const [feedbackList, setFeedbackList] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [stats, setStats] = useState(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterSource, setFilterSource] = useState('all');
    
    // Feedback form state
    const [feedbackType, setFeedbackType] = useState('good_lead');
    const [feedbackComment, setFeedbackComment] = useState('');
    
    // Export state
    const [exportFormat, setExportFormat] = useState('pdf');
    const [exportMessage, setExportMessage] = useState(null);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const leadsPerPage = 10;

    // Fetch leads on mount
    useEffect(() => {
        fetchLeads();
        fetchStatistics();
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
                    feedback_type: feedbackType,
                    comments: feedbackComment
                })
            });
            const data = await response.json();
            
            showMessage('success', 'Feedback submitted successfully!');
            setFeedbackType('good_lead');
            setFeedbackComment('');
            setShowFeedbackModal(false);
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
        if (!priority) return 'bg-gray-100 text-gray-800 border-gray-200';
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'spam': return 'bg-red-100 text-red-800';
            case 'failed': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Dashboard View
    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={syncSalesforce}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 font-medium flex items-center gap-2 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Sync Salesforce
                </button>
                <button
                    onClick={processAllLeads}
                    disabled={processing}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium flex items-center gap-2 disabled:opacity-50"
                >
                    {processing ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Process All Leads
                </button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Leads</h3>
                            <p className="text-3xl font-bold text-blue-900">{stats.total_leads || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-gray-600 text-sm font-medium mb-2">Verified</h3>
                            <p className="text-3xl font-bold text-green-600">{stats.verification?.verified || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-gray-600 text-sm font-medium mb-2">Unverified</h3>
                            <p className="text-3xl font-bold text-yellow-600">{stats.verification?.unverified || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-gray-600 text-sm font-medium mb-2">Spam</h3>
                            <p className="text-3xl font-bold text-red-600">{stats.verification?.spam || 0}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                            <h3 className="text-gray-600 text-sm font-medium mb-2">High Priority</h3>
                            <p className="text-3xl font-bold text-red-600">{stats.priority_distribution?.high || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                            <h3 className="text-gray-600 text-sm font-medium mb-2">Medium Priority</h3>
                            <p className="text-3xl font-bold text-yellow-600">{stats.priority_distribution?.medium || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                            <h3 className="text-gray-600 text-sm font-medium mb-2">Low Priority</h3>
                            <p className="text-3xl font-bold text-green-600">{stats.priority_distribution?.low || 0}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Score Statistics</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Average Score</p>
                                <p className="text-2xl font-bold text-blue-900">{stats.score_statistics?.average || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Highest Score</p>
                                <p className="text-2xl font-bold text-green-600">{stats.score_statistics?.maximum || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Lowest Score</p>
                                <p className="text-2xl font-bold text-red-600">{stats.score_statistics?.minimum || 0}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="Web Form">Web Form</option>
                            <option value="CRM">CRM</option>
                            <option value="Email">Email</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, company, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );

    // Leads Table View
    const renderLeadsTable = () => (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentLeads.map((lead) => (
                            <tr key={lead.lead_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.company || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    {lead.lead_score ? lead.lead_score.toFixed(1) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(lead.priority)}`}>
                                        {lead.priority || 'Unscored'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.processing_status)}`}>
                                        {lead.processing_status || 'New'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                    <button
                                        onClick={() => fetchLeadDetails(lead.lead_id)}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View
                                    </button>
                                    {lead.processing_status === 'new' && (
                                        <button
                                            onClick={() => processSingleLead(lead.lead_id)}
                                            className="text-green-600 hover:text-green-800 font-medium"
                                        >
                                            Process
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                    Showing {indexOfFirstLead + 1} to {Math.min(indexOfLastLead, filteredLeads.length)} of {filteredLeads.length} leads
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 bg-blue-900 text-white rounded-md text-sm font-medium">
                        {currentPage} / {totalPages || 1}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );

    // Reports/Export View
    const renderReports = () => (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Export Lead Reports</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Priority</label>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High Priority Only</option>
                            <option value="medium">Medium Priority Only</option>
                            <option value="low">Low Priority Only</option>
                        </select>
                    </div>

                    <button
                        onClick={downloadReport}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 font-medium disabled:opacity-50"
                    >
                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                        Download Report
                    </button>
                </div>
            </div>
        </div>
    );

    // Lead Detail Modal
    const renderDetailModal = () => {
        if (!selectedLead) return null;

        const scoreBreakdown = selectedLead.score_breakdown?.rule_based?.breakdown || {};

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Lead Details</h2>
                        <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Lead Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedLead.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedLead.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Company</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedLead.company || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedLead.processing_status)}`}>
                                        {selectedLead.processing_status || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Lead Score</h3>
                            <div className="space-y-3">
                                {Object.entries(scoreBreakdown).map(([key, value]) => (
                                    <div key={key}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-600">{key.replace('_', ' ').toUpperCase()}</span>
                                            <span className="text-sm font-medium text-gray-900">{value.toFixed(1)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(value / 25) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="border-t border-gray-300 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-semibold text-gray-800">Total Score</span>
                                        <span className={`text-2xl font-bold ${selectedLead.lead_score >= 70 ? 'text-green-600' : selectedLead.lead_score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {selectedLead.lead_score?.toFixed(1) || 0}/100
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm text-gray-600">Priority Level</span>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(selectedLead.priority)}`}>
                                            {selectedLead.priority || 'Unscored'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowFeedbackModal(true);
                                    setShowDetailModal(false);
                                }}
                                className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 font-medium"
                            >
                                Provide Feedback
                            </button>
                            {selectedLead.processing_status === 'new' && (
                                <button
                                    onClick={() => {
                                        processSingleLead(selectedLead.lead_id);
                                        setShowDetailModal(false);
                                    }}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                                >
                                    Process Lead
                                </button>
                            )}
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
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div className="bg-blue-900 text-white p-6 rounded-t-lg flex justify-between items-center">
                        <h2 className="text-xl font-bold">Provide Feedback</h2>
                        <button onClick={() => setShowFeedbackModal(false)} className="text-white hover:text-gray-200">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Lead</p>
                            <p className="text-base font-semibold text-gray-900">{selectedLead.name} - {selectedLead.company}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
                            <select
                                value={feedbackType}
                                onChange={(e) => setFeedbackType(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="good_lead">Good Lead</option>
                                <option value="bad_lead">Bad Lead</option>
                                <option value="incorrect_score">Incorrect Score</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Comment (Optional)</label>
                            <textarea
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                placeholder="Add any additional comments..."
                                rows="4"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitFeedback}
                                className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 font-medium"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-blue-900 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold">Lead Qualification System</h1>
                    <p className="text-blue-200 mt-1">Manage and qualify your leads efficiently</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm ${
                                currentView === 'dashboard'
                                    ? 'border-blue-900 text-blue-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setCurrentView('leads')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm ${
                                currentView === 'leads'
                                    ? 'border-blue-900 text-blue-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Leads
                        </button>
                        <button
                            onClick={() => setCurrentView('reports')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm ${
                                currentView === 'reports'
                                    ? 'border-blue-900 text-blue-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Reports
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                {/* Loading Overlay */}
                {loading && (
                    <div className="mb-6 p-4 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-3">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span className="font-medium">Loading...</span>
                    </div>
                )}

                {/* Render Current View */}
                {currentView === 'dashboard' && renderDashboard()}
                {currentView === 'leads' && renderLeadsTable()}
                {currentView === 'reports' && renderReports()}
            </div>

            {/* Modals */}
            {showDetailModal && renderDetailModal()}
            {showFeedbackModal && renderFeedbackModal()}
        </div>
    );
}