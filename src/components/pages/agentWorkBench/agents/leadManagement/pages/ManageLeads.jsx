import { Mail, Search, Award, Target, Loader, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import LeadDetailModal from '../components/LeadDetailModal';

export default function ManageLeads({ 
    leads, 
    selectedLeads, 
    setSelectedLeads, 
    leadFilter, 
    setLeadFilter, 
    searchTerm, 
    setSearchTerm, 
    handleGenerateOutreach,
    toggleLeadSelection,
    selectAllLeads
}) {
    const [showLeadDetail, setShowLeadDetail] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [scoreFilter, setScoreFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(false); // ✅ loader state

    const ITEMS_PER_PAGE = 3;

    const filteredLeads = leads.filter(lead => {
        if (leadFilter === 'test' && !lead.is_test_lead) return false;
        if (leadFilter === 'real' && lead.is_test_lead) return false;
        if (leadFilter === 'approved' && lead.approved !== true) return false;

        if (scoreFilter !== 'all') {
            if (scoreFilter === 'high' && (!lead.qualification_score || lead.qualification_score < 80)) return false;
            if (scoreFilter === 'medium' && (!lead.qualification_score || lead.qualification_score < 50 || lead.qualification_score >= 80)) return false;
            if (scoreFilter === 'low' && (!lead.qualification_score || lead.qualification_score >= 50)) return false;
        }

        if (priorityFilter !== 'all') {
            if (priorityFilter !== lead.qualification_grade) return false;
        }

        if (statusFilter !== 'all') {
            if (statusFilter === 'processed' && !lead.qualification_score) return false;
            if (statusFilter === 'unprocessed' && lead.qualification_score) return false;
        }

        if (searchTerm) {
            return lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    });

    const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedLeads = filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleFilterChange = (filterSetter, value) => {
        filterSetter(value);
        setCurrentPage(1);
    };

    // ✅ Wrapped outreach with loader
    const handleOutreachClick = async () => {
        try {
            setLoading(true);
            await handleGenerateOutreach();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Leads Management</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {filteredLeads.length} leads found
                        {leadFilter !== 'all' && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium capitalize">
                                {leadFilter.replace('_', ' ')} leads only
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={selectAllLeads}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                    >
                        {selectedLeads.length === leads.length ? 'Deselect All' : 'Select All'}
                    </button>

                    <button
                        onClick={handleOutreachClick}
                        disabled={selectedLeads.length === 0 || loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Mail className="w-5 h-5" />
                                Generate Outreach ({selectedLeads.length})
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={leadFilter}
                        onChange={(e) => handleFilterChange(setLeadFilter, e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Leads</option>
                        <option value="approved">Approved Leads</option>
                        <option value="test">Test Leads</option>
                        <option value="real">Real Leads</option>
                    </select>
                    <select
                        value={scoreFilter}
                        onChange={(e) => handleFilterChange(setScoreFilter, e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Scores</option>
                        <option value="high">High (80+)</option>
                        <option value="medium">Medium (50-79)</option>
                        <option value="low">Low (0-49)</option>
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e) => handleFilterChange(setPriorityFilter, e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Priorities</option>
                        <option value="hot">Hot</option>
                        <option value="warm">Warm</option>
                        <option value="lukewarm">Lukewarm</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="processed">Processed</option>
                        <option value="unprocessed">Unprocessed</option>
                    </select>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {paginatedLeads.map((lead) => (
                        <div key={lead._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setShowLeadDetail(lead)}>
                            <div className="flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    checked={selectedLeads.includes(lead._id)}
                                    onChange={() => toggleLeadSelection(lead._id)}
                                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                                                {lead.is_test_lead && (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                                                        TEST
                                                    </span>
                                                )}
                                                {lead.approved === true && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                                        ✅ APPROVED
                                                    </span>
                                                )}
                                                {lead.qualification_grade && (
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                        lead.qualification_grade === 'hot' ? 'bg-red-100 text-red-700' :
                                                        lead.qualification_grade === 'warm' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {lead.qualification_grade.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600">{lead.title} at {lead.company}</p>
                                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                {lead.email && <span>📧 {lead.email}</span>}
                                                {lead.phone && <span>📱 {lead.phone}</span>}
                                                {lead.location && <span>📍 {lead.location}</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Award className="w-5 h-5 text-blue-600" />
                                            <span className="text-sm text-gray-500">Score:</span>
                                            <span className="text-lg font-bold text-blue-600">
                                                {lead.qualification_score || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    {lead.industry && (
                                        <div className="mt-3">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                                {lead.industry}
                                            </span>
                                            {lead.company_size && (
                                                <span className="ml-2 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                                                    {lead.company_size} employees
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                                        <div
                                            className="h-2 bg-blue-600 rounded-full"
                                            style={{ width: `${lead.qualification_score || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredLeads.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages} ({filteredLeads.length} total leads)
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded-lg font-medium ${
                                        page === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showLeadDetail && (
                <LeadDetailModal lead={showLeadDetail} onClose={() => setShowLeadDetail(null)} />
            )}
        </div>
    );
}
