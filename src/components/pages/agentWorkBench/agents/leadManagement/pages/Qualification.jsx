import { useState, useEffect } from 'react';
import { Target, Loader, CheckCircle, Users, Star, List, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Qualification({ projects }) {
    const [qualifyingAll, setQualifyingAll] = useState(false);
    const [allLeads, setAllLeads] = useState([]);
    const [loadingAllLeads, setLoadingAllLeads] = useState(false);
    const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const leadsPerPage = 10;

    const API_BASE_URL = 'http://localhost:8000/lead-generation';

    const loadAllProjectLeads = async () => {
        if (loadingAllLeads) return;
        setLoadingAllLeads(true);
        setCurrentPage(1);
        try {
            const allProjectLeads = [];
            for (const project of projects) {
                try {
                    const response = await fetch(`${API_BASE_URL}/leads/project/${project.project_id}?limit=1000`);
                    const data = await response.json();
                    if (data.status === 'success' && data.leads) {
                        const leadsWithProject = data.leads.map(lead => ({
                            ...lead,
                            project_name: project.project_name,
                            project_id: project.project_id
                        }));
                        allProjectLeads.push(...leadsWithProject);
                    }
                } catch (error) {
                    console.error(`Failed to load leads for project ${project.project_id}:`, error);
                }
            }
            setAllLeads(allProjectLeads);
        } catch (error) {
            console.error('Failed to load leads from all projects:', error);
        } finally {
            setLoadingAllLeads(false);
        }
    };

    const getFilteredLeads = () => {
        let filtered = allLeads;
        if (selectedProjectFilter !== 'all') filtered = filtered.filter(lead => lead.project_id === selectedProjectFilter);
        if (selectedStatusFilter === 'approved') filtered = filtered.filter(lead => lead.approved === true);
        else if (selectedStatusFilter === 'qualified') filtered = filtered.filter(lead => lead.qualification_score);
        else if (selectedStatusFilter === 'hot') filtered = filtered.filter(lead => lead.qualification_grade === 'hot');
        return filtered;
    };

    const filteredLeads = getFilteredLeads();
    const sortedLeads = [...filteredLeads].sort((a, b) => {
        const scoreA = a.qualification_score || 0;
        const scoreB = b.qualification_score || 0;
        if (scoreB !== scoreA) return scoreB - scoreA;
        if (a.approved === true && b.approved !== true) return -1;
        if (b.approved === true && a.approved !== true) return 1;
        return 0;
    });

    const totalPages = Math.ceil(sortedLeads.length / leadsPerPage);
    const startIndex = (currentPage - 1) * leadsPerPage;
    const paginatedLeads = sortedLeads.slice(startIndex, startIndex + leadsPerPage);

    const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    useEffect(() => {
        if (projects.length > 0) loadAllProjectLeads();
    }, [projects]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Lead Qualification</h2>
                    <p className="text-gray-500 text-sm mt-1">Score and qualify your leads across all projects</p>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                        <select
                            value={selectedProjectFilter}
                            onChange={(e) => { setSelectedProjectFilter(e.target.value); setCurrentPage(1); }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Projects</option>
                            {projects.map(project => (
                                <option key={project.project_id} value={project.project_id}>
                                    {project.project_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lead Status</label>
                        <select
                            value={selectedStatusFilter}
                            onChange={(e) => { setSelectedStatusFilter(e.target.value); setCurrentPage(1); }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Leads</option>
                            <option value="approved">Approved Only</option>
                            <option value="qualified">Qualified Only</option>
                            <option value="hot">Hot Leads Only</option>
                        </select>
                    </div>

                    <div className="text-sm text-gray-500">
                        Showing {filteredLeads.length} of {allLeads.length} leads
                    </div>
                </div>
            </div>

            {/* Main Section - Paginated Leads */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">All Leads</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {selectedProjectFilter === 'all' ? 'All Projects' : projects.find(p => p.project_id === selectedProjectFilter)?.project_name} • 
                        {selectedStatusFilter === 'all' ? ' All Status' : ' ' + selectedStatusFilter.charAt(0).toUpperCase() + selectedStatusFilter.slice(1)}
                    </p>
                </div>

                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                    {loadingAllLeads ? (
                        <div className="p-6 text-center">
                            <Loader className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-4" />
                            <p className="text-gray-500">Loading leads...</p>
                        </div>
                    ) : paginatedLeads.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p>No leads found matching your filters</p>
                        </div>
                    ) : (
                        paginatedLeads.map(lead => (
                            <div key={lead._id} className="p-3 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            lead.approved === true ? 'bg-green-100' :
                                            lead.qualification_grade === 'hot' ? 'bg-red-100' :
                                            lead.qualification_grade === 'warm' ? 'bg-orange-100' :
                                            lead.qualification_grade === 'lukewarm' ? 'bg-yellow-100' : 'bg-gray-100'
                                        }`}>
                                            {lead.approved === true ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : lead.qualification_score ? (
                                                <Star className={`w-5 h-5 ${
                                                    lead.qualification_grade === 'hot' ? 'text-red-600' :
                                                    lead.qualification_grade === 'warm' ? 'text-orange-600' :
                                                    lead.qualification_grade === 'lukewarm' ? 'text-yellow-600' : 'text-gray-600'
                                                }`} />
                                            ) : (
                                                <Users className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="font-semibold text-gray-900 text-sm truncate">{lead.name}</p>
                                                {lead.approved === true && (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium whitespace-nowrap">
                                                        APPROVED
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 mb-0.5 truncate">{lead.company}</p>
                                            <p className="text-[10px] text-gray-500 truncate">{lead.project_name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right ml-2">
                                        {lead.qualification_score ? (
                                            <div>
                                                <p className="text-lg font-bold text-gray-900">{lead.qualification_score}</p>
                                                <p className="text-xs text-gray-500 uppercase">{lead.qualification_grade}</p>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">Not qualified</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination Controls */}
                {sortedLeads.length > 0 && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(startIndex + leadsPerPage, sortedLeads.length)} of {sortedLeads.length} leads
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) pageNum = i + 1;
                                    else if (currentPage <= 3) pageNum = i + 1;
                                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                    else pageNum = currentPage - 2 + i;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-9 h-9 rounded-lg font-medium text-sm ${
                                                currentPage === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <List className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Found</h3>
                    <p className="text-gray-500">Create a project first to start qualifying leads.</p>
                </div>
            )}
        </div>
    );
}
