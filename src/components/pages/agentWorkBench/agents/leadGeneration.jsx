import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
    Home, List, Users, Mail, MessageSquare, Star, Database,
    Upload, FileText, Plus, Minus, Loader, CheckCircle, 
    AlertCircle, Edit2, Save, X, Send, Play, Pause,
    Check, Clock, TrendingUp, Building, Briefcase,
    Search, Filter, MoreVertical, Eye, Trash2, Download,
    RefreshCw, Settings, ChevronRight, ChevronDown,
    Zap, Target, Award, Activity, User
} from 'lucide-react';

// Move all view components outside the main component
const Sidebar = ({ currentView, setCurrentView, selectedProject }) => (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Lead Generation</h1>
            <p className="text-xs text-gray-500 mt-1">AI-Powered Sales System</p>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
            <button
                onClick={() => setCurrentView('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                    currentView === 'dashboard' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
            </button>

            <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-500 uppercase">Projects</div>
            
            <button
                onClick={() => setCurrentView('projects')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                    currentView === 'projects' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
                <List className="w-5 h-5" />
                <span>All Projects</span>
            </button>

            <button
                onClick={() => setCurrentView('create-project')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                    currentView === 'create-project' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
                <Plus className="w-5 h-5" />
                <span>Create Project</span>
            </button>

            <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-500 uppercase">Leads</div>

            <button
                onClick={() => selectedProject && setCurrentView('leads')}
                disabled={!selectedProject}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                    currentView === 'leads' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                } ${!selectedProject ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <Users className="w-5 h-5" />
                <span>Manage Leads</span>
            </button>

            <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-500 uppercase">Outreach</div>

            <button
                onClick={() => setCurrentView('campaigns')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                    currentView === 'campaigns' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
                <Mail className="w-5 h-5" />
                <span>Campaigns</span>
            </button>

            <button
                onClick={() => setCurrentView('conversations')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                    currentView === 'conversations' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
                <MessageSquare className="w-5 h-5" />
                <span>Conversations</span>
            </button>

            <button
                onClick={() => setCurrentView('email-monitor')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                    currentView === 'email-monitor' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
                <Activity className="w-5 h-5" />
                <span>Email Monitor</span>
            </button>

            <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-500 uppercase">Analysis</div>

            <button
                onClick={() => setCurrentView('qualification')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                    currentView === 'qualification' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
                <Star className="w-5 h-5" />
                <span>Qualification</span>
            </button>

            <button
                onClick={() => setCurrentView('salesforce')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                    currentView === 'salesforce' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
                <Database className="w-5 h-5" />
                <span>Salesforce Sync</span>
            </button>
        </nav>
    </div>
);

const CreateProjectView = ({ 
    createProjectMode, 
    setCreateProjectMode, 
    projectForm, 
    setProjectForm, 
    uploadedFile, 
    setUploadedFile, 
    loading, 
    handleCreateProject, 
    handleDocumentUpload,
    handleArrayInput,
    addArrayField,
    removeArrayField
}) => {
    // Memoize the array fields to prevent unnecessary re-renders
    const arrayFields = useMemo(() => ['target_roles', 'industries', 'locations', 'pain_points', 'value_propositions'], []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
                <p className="text-gray-500 text-sm mt-1">Start by uploading a document or filling in the form</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setCreateProjectMode('form')}
                        className={`flex-1 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 ${
                            createProjectMode === 'form'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <FileText className="w-5 h-5" />
                        Manual Form
                    </button>
                    <button
                        onClick={() => setCreateProjectMode('document')}
                        className={`flex-1 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 ${
                            createProjectMode === 'document'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <Upload className="w-5 h-5" />
                        Upload Document
                    </button>
                </div>

                {createProjectMode === 'form' ? (
                    <form onSubmit={handleCreateProject} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                                <input
                                    type="text"
                                    value={projectForm.project_name}
                                    onChange={(e) => setProjectForm(prev => ({...prev, project_name: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Lead Count</label>
                                <input
                                    type="number"
                                    value={projectForm.lead_count}
                                    onChange={(e) => setProjectForm(prev => ({...prev, lead_count: parseInt(e.target.value) || 0}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="1"
                                    max="100"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Objective</label>
                                <textarea
                                    value={projectForm.business_objective}
                                    onChange={(e) => setProjectForm(prev => ({...prev, business_objective: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    value={projectForm.product_name}
                                    onChange={(e) => setProjectForm(prev => ({...prev, product_name: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                                <input
                                    type="text"
                                    value={projectForm.product_description}
                                    onChange={(e) => setProjectForm(prev => ({...prev, product_description: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {arrayFields.map(field => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                    {field.replace(/_/g, ' ')}
                                </label>
                                {projectForm[field].map((value, index) => (
                                    <div key={`${field}-${index}`} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => handleArrayInput(field, index, e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder={`${field.replace(/_/g, ' ')} ${index + 1}`}
                                        />
                                        {projectForm[field].length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArrayField(field, index)}
                                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayField(field)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add {field.replace(/_/g, ' ')}
                                </button>
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Creating Project...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Create Project
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                            <input
                                type="text"
                                value={projectForm.project_name}
                                onChange={(e) => setProjectForm(prev => ({...prev, project_name: e.target.value}))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter project name"
                            />
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600 mb-4">Upload PRD, BRD, or any document</p>
                            <p className="text-sm text-gray-500 mb-4">Supported: .txt, .docx</p>
                            <input
                                type="file"
                                onChange={(e) => setUploadedFile(e.target.files[0])}
                                accept=".txt,.docx"
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                            >
                                Choose File
                            </label>
                            {uploadedFile && (
                                <p className="text-sm text-gray-600 mt-4 font-medium">
                                    Selected: {uploadedFile.name}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleDocumentUpload}
                            disabled={!uploadedFile || !projectForm.project_name || loading}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Analyzing Document...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Upload & Create Project
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const DashboardView = ({ statistics, setCurrentView, projects, setSelectedProject, loadProjectDetails }) => {
    console.log('DashboardView received statistics:', statistics);
    
    return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">Overview of your lead generation system</p>
        </div>

        <div className="grid grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <List className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm opacity-90">Total Projects</p>
                <p className="text-3xl font-bold mt-1">{statistics.total_projects}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm opacity-90">Total Leads</p>
                <p className="text-3xl font-bold mt-1">{statistics.total_leads}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm opacity-90">Approved Leads</p>
                <p className="text-3xl font-bold mt-1">{statistics.approved_leads}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <Mail className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm opacity-90">Outreach Sent</p>
                <p className="text-3xl font-bold mt-1">{statistics.sent_outreach}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <Star className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm opacity-90">Qualified</p>
                <p className="text-3xl font-bold mt-1">{statistics.qualified_leads}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <button
                        onClick={() => setCurrentView('create-project')}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create New Project</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('projects')}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
                    >
                        <List className="w-5 h-5" />
                        <span>View All Projects</span>
                    </button>
                    <button
                        onClick={() => {
                            // This would need to be passed as a prop
                            // setLeadFilter('approved');
                            setCurrentView('leads');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium"
                    >
                        <CheckCircle className="w-5 h-5" />
                        <span>View Approved Leads ({statistics.approved_leads})</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('email-monitor')}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
                    >
                        <Activity className="w-5 h-5" />
                        <span>Email Monitor</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Projects</h3>
                <div className="space-y-3">
                    {projects.slice(0, 3).map((project) => (
                        <div
                            key={project.project_id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                setSelectedProject(project.project_id);
                                loadProjectDetails(project.project_id);
                                setCurrentView('project-details');
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{project.project_name}</p>
                                    <p className="text-xs text-gray-500">{project.product_info?.name || 'N/A'}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
};

const ProjectsView = ({ setCurrentView, projects, setSelectedProject, loadProjectDetails }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your lead generation projects</p>
            </div>
            <button
                onClick={() => setCurrentView('create-project')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
                <Plus className="w-5 h-5" />
                New Project
            </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Project Name</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {projects.map((project) => (
                        <tr key={project.project_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{project.project_name}</p>
                                        <p className="text-xs text-gray-500">{project.project_id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {project.product_info?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-semibold text-gray-900">
                                    {project.leads_generated || 0}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {project.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(project.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => {
                                        setSelectedProject(project.project_id);
                                        loadProjectDetails(project.project_id);
                                        setCurrentView('project-details');
                                    }}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ProjectDetailsView = ({ projectDetails, selectedProject, loading, handleGenerateLeads, setCurrentView, loadProjectLeads }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => setCurrentView('projects')} className="hover:text-gray-700">Projects</button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{projectDetails?.project_name}</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{projectDetails?.project_name}</h2>
                    <p className="text-gray-500 text-sm mt-1">{projectDetails?.project_id}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleGenerateLeads}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                    >
                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                        Generate Leads
                    </button>
                    <button
                        onClick={() => {
                            loadProjectLeads(selectedProject);
                            setCurrentView('leads');
                        }}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2"
                    >
                        <Users className="w-5 h-5" />
                        View Leads
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">Target Count</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">{projectDetails?.target_count || 0}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium">Leads Generated</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">{projectDetails?.leads_generated || 0}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-600 font-medium">Status</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1 capitalize">{projectDetails?.status || 'N/A'}</p>
                </div>
            </div>

            {projectDetails?.product_info && (
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Product Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div>
                            <span className="text-sm font-medium text-gray-700">Name: </span>
                            <span className="text-sm text-gray-900">{projectDetails.product_info.name}</span>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-700">Category: </span>
                            <span className="text-sm text-gray-900">{projectDetails.product_info.category}</span>
                        </div>
                    </div>
                </div>
            )}

            {projectDetails?.lead_criteria && (
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Target Criteria</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Target Roles</p>
                            <div className="flex flex-wrap gap-2">
                                {projectDetails.lead_criteria.decision_maker_roles?.map((role, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Industries</p>
                            <div className="flex flex-wrap gap-2">
                                {projectDetails.lead_criteria.industries?.map((industry, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                        {industry}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);

const LeadsView = ({ 
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
}) => {
    const filteredLeads = leads.filter(lead => {
        if (leadFilter === 'test' && !lead.is_test_lead) return false;
        if (leadFilter === 'real' && lead.is_test_lead) return false;
        if (leadFilter === 'approved' && lead.approved !== true) return false;
        
        if (searchTerm) {
            return lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    });

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
                        onClick={handleGenerateOutreach}
                        disabled={selectedLeads.length === 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        <Mail className="w-5 h-5" />
                        Generate Outreach ({selectedLeads.length})
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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={leadFilter}
                        onChange={(e) => setLeadFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Leads</option>
                        <option value="approved">Approved Leads</option>
                        <option value="test">Test Leads</option>
                        <option value="real">Real Leads</option>
                    </select>
                </div>

                <div className="space-y-4">
                    {filteredLeads.map((lead) => (
                        <div key={lead._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    checked={selectedLeads.includes(lead._id)}
                                    onChange={() => toggleLeadSelection(lead._id)}
                                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
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
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const OutreachReviewView = ({ outreachMessages, editingMessageId, setEditingMessageId, editedMessage, setEditedMessage, handleUpdateMessage, handleStartCampaign }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Review Outreach Messages</h2>
                <p className="text-gray-500 text-sm mt-1">{outreachMessages.length} messages generated</p>
            </div>
            <button
                onClick={() => {
                    const messageIds = outreachMessages.map(m => m._id || m.message_id || m.lead_id);
                    console.log('Message IDs being sent:', messageIds);
                    handleStartCampaign(messageIds);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
                <Send className="w-5 h-5" />
                Start Campaign
            </button>
        </div>

        <div className="space-y-4">
            {outreachMessages.map((msg) => (
                <div key={msg.lead_id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{msg.lead_name}</h3>
                            <p className="text-sm text-gray-600">{msg.lead_email} • {msg.lead_company}</p>
                        </div>
                        {msg.is_test_lead && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                TEST LEAD
                            </span>
                        )}
                    </div>

                    {editingMessageId === msg.lead_id ? (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Subject:</label>
                                <input
                                    type="text"
                                    value={editedMessage.subject}
                                    onChange={(e) => setEditedMessage({...editedMessage, subject: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Message:</label>
                                <textarea
                                    value={editedMessage.message}
                                    onChange={(e) => setEditedMessage({...editedMessage, message: e.target.value})}
                                    rows="6"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateMessage(msg.lead_id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingMessageId(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                                <p className="text-sm font-semibold text-gray-900">📧 {msg.subject}</p>
                                <button
                                    onClick={() => {
                                        setEditingMessageId(msg.lead_id);
                                        setEditedMessage({ subject: msg.subject, message: msg.message });
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{msg.message}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);

const EmailMonitorView = ({ emailMonitorStatus, setEmailMonitorStatus, emailStats }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Email Monitor</h2>
            <p className="text-gray-500 text-sm mt-1">Real-time email monitoring using IMAP IDLE (push-based) - starts automatically</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                    <h4 className="font-medium text-blue-900">IMAP IDLE Technology</h4>
                    <p className="text-sm text-blue-700 mt-1">
                        Using push-based notifications instead of polling. The email server notifies us instantly when new emails arrive, eliminating continuous checking and preventing system crashes. Monitoring starts automatically when the application launches.
                    </p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-blue-600" />
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Auto-Started (IDLE)
                    </span>
                </div>
                <p className="text-sm text-gray-600">Monitor Status</p>
                <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-700 font-medium">Auto-Started (IDLE)</span>
                    </div>
                    <p className="text-xs text-gray-500">
                        Email monitoring starts automatically when the application launches. No manual intervention required.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <Mail className="w-8 h-8 text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">Email Accounts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                    {emailStats.total_accounts || 0}
                </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <MessageSquare className="w-8 h-8 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">New Replies</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                    {emailStats.new_replies || 0}
                </p>
            </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Email Accounts</h3>
            <div className="space-y-3">
                {emailStats.accounts?.map((account, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">{account.email_address}</p>
                            <p className="text-sm text-gray-500">{account.display_name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Today: {account.emails_sent_today || 0}/400</p>
                                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                                    <div
                                        className="h-2 bg-blue-600 rounded-full"
                                        style={{ width: `${((account.emails_sent_today || 0) / 400) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {account.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const CampaignsView = ({ campaignStatus }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Outreach Campaigns</h2>
            <p className="text-gray-500 text-sm mt-1">Monitor your email campaigns</p>
        </div>

        {campaignStatus && (
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <Mail className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Total Messages</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {campaignStatus.total_messages || 0}
                    </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                    <p className="text-sm text-gray-600">Sent</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {campaignStatus.sent || 0}
                    </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <Clock className="w-8 h-8 text-yellow-600 mb-2" />
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {campaignStatus.pending_approval || 0}
                    </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {campaignStatus.in_progress || 0}
                    </p>
                </div>
            </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Email Account Usage</h3>
            {campaignStatus?.email_accounts?.accounts?.map((account, idx) => (
                <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <p className="font-medium text-gray-900">{account.email_address}</p>
                            <p className="text-sm text-gray-500">{account.display_name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {account.status}
                        </span>
                    </div>
                    <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Daily Limit</span>
                            <span>{account.emails_sent_today || 0} / 400</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 bg-blue-600 rounded-full"
                                style={{ width: `${((account.emails_sent_today || 0) / 400) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ConversationsView = () => {
    const [leadReply, setLeadReply] = useState('');
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [conversationLeads, setConversationLeads] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [localConversationHistory, setLocalConversationHistory] = useState([]);

    const loadConversationLeads = async () => {
        setLoadingConversations(true);
        try {
            // Load projects first to get all project IDs
            const projectsResponse = await fetch('http://localhost:8000/lead-generation/projects/list');
            const projectsData = await projectsResponse.json();
            
            if (projectsData.status === 'success') {
                const allConversationLeads = [];
                
                for (const project of projectsData.projects || []) {
                    try {
                        const response = await fetch(`http://localhost:8000/lead-generation/leads/project/${project.project_id}?limit=1000`);
                        const data = await response.json();
                        if (data.status === 'success' && data.leads) {
                            const leadsWithProject = data.leads.map(lead => ({
                                ...lead,
                                project_name: project.project_name,
                                project_id: project.project_id
                            }));
                            allConversationLeads.push(...leadsWithProject);
                        }
                    } catch (error) {
                        console.error(`Failed to load leads for project ${project.project_id}:`, error);
                    }
                }
                
                setConversationLeads(allConversationLeads);
            }
        } catch (error) {
            console.error('Failed to load conversation leads:', error);
        } finally {
            setLoadingConversations(false);
        }
    };

    const loadConversation = async (leadId) => {
        setLocalConversationHistory([]);
        setSelectedLeadId(leadId);
        
        try {
            const response = await fetch(`http://localhost:8000/lead-generation/conversation/history/${leadId}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                setLocalConversationHistory(data.conversation_history || []);
            }
        } catch (error) {
            console.error('Failed to load conversation:', error);
        }
    };

    useEffect(() => {
        loadConversationLeads();
    }, []);

    const selectedLead = conversationLeads.find(lead => lead._id === selectedLeadId);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Conversations</h2>
                <p className="text-gray-500 text-sm mt-1">Manage lead conversations</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-bold text-gray-900 mb-4">Active Conversations</h3>
                    {loadingConversations ? (
                        <div className="text-center py-8">
                            <Loader className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Loading conversations...</p>
                        </div>
                    ) : conversationLeads.filter(l => l.conversation_history?.length > 0).length === 0 ? (
                        <div className="text-center py-8">
                            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No active conversations</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {conversationLeads
                                .filter(l => l.conversation_history?.length > 0)
                                .sort((a, b) => {
                                    const aLatest = a.conversation_history?.[a.conversation_history.length - 1]?.timestamp;
                                    const bLatest = b.conversation_history?.[b.conversation_history.length - 1]?.timestamp;
                                    return new Date(bLatest || 0) - new Date(aLatest || 0);
                                })
                                .map(lead => (
                                    <div
                                        key={lead._id}
                                        onClick={() => loadConversation(lead._id)}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                            selectedLeadId === lead._id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    >
                                        <p className="font-medium text-gray-900 text-sm truncate">{lead.name || 'Unknown Lead'}</p>
                                        <p className="text-xs text-gray-500 truncate">{lead.company || 'No Company'}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-xs text-gray-400">
                                                {lead.conversation_history?.length || 0} messages
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                    {selectedLeadId ? (
                        <>
                            <div className="border-b pb-4 mb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{selectedLead?.name || 'Unknown Lead'}</h3>
                                        <p className="text-sm text-gray-600">{selectedLead?.company || 'No Company'}</p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-900 mb-4">
                                Conversation History 
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    ({localConversationHistory.length} messages)
                                </span>
                            </h3>
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                {localConversationHistory.length === 0 ? (
                                    <div className="text-center py-8">
                                        <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No messages in this conversation yet</p>
                                    </div>
                                ) : (
                                    localConversationHistory.map((msg, idx) => {
                                        const isFromLead = msg.from === 'lead' || msg.type === 'incoming';
                                        const isOutreach = msg.type === 'outreach';
                                        const isOutgoing = msg.type === 'outgoing' || msg.from === 'system';
                                        
                                        return (
                                            <div
                                                key={idx}
                                                className={`p-4 rounded-lg ${
                                                    isFromLead ? 'bg-gray-100 ml-8' : 
                                                    isOutreach ? 'bg-purple-50 mr-8 border-l-4 border-purple-400' :
                                                    'bg-blue-50 mr-8'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm text-gray-900">
                                                            {isFromLead ? (selectedLead?.name || 'Lead') : 
                                                             isOutreach ? '📧 Outreach Email' : 
                                                             '🤖 AI Assistant'}
                                                        </span>
                                                        {isOutreach && (
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                                EMAIL
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 
                                                         msg.sent_at ? new Date(msg.sent_at).toLocaleString() : 
                                                         'Unknown time'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message || 'No message content'}</p>
                                                <div className="flex gap-2 mt-2">
                                                    {msg.sentiment && (
                                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                                            msg.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                                                            msg.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                                                            msg.sentiment === 'interested' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            Sentiment: {msg.sentiment}
                                                        </span>
                                                    )}
                                                    {msg.intent && (
                                                        <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                                            Intent: {msg.intent.replace('_', ' ')}
                                                        </span>
                                                    )}
                                                    {msg.via_email && (
                                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                            Via: {msg.via_email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Select a conversation to view</p>
                            <p className="text-sm text-gray-400 mt-2">Choose a lead from the sidebar to see their conversation history</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const QualificationView = ({ projects }) => {
    const [qualifyingAll, setQualifyingAll] = useState(false);
    const [allLeads, setAllLeads] = useState([]);
    const [loadingAllLeads, setLoadingAllLeads] = useState(false);
    const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

    const loadAllProjectLeads = async () => {
        if (loadingAllLeads) return;
        
        setLoadingAllLeads(true);
        try {
            const allProjectLeads = [];
            
            for (const project of projects) {
                try {
                    const response = await fetch(`http://localhost:8000/lead-generation/leads/project/${project.project_id}?limit=1000`);
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

    const handleQualifyAllProjects = async () => {
        setQualifyingAll(true);
        try {
            let totalQualified = 0;
            
            for (const project of projects) {
                try {
                    const response = await fetch(`http://localhost:8000/lead-generation/leads/qualify-project/${project.project_id}`, {
                        method: 'POST'
                    });
                    const data = await response.json();
                    
                    if (data.status === 'completed') {
                        totalQualified += data.qualified || 0;
                    }
                } catch (error) {
                    console.error(`Failed to qualify project ${project.project_id}:`, error);
                }
            }
            
            console.log(`Qualified ${totalQualified} leads across all projects!`);
            loadAllProjectLeads();
        } catch (error) {
            console.error('Failed to qualify leads:', error);
        } finally {
            setQualifyingAll(false);
        }
    };

    const getFilteredLeads = () => {
        let filtered = allLeads;

        if (selectedProjectFilter !== 'all') {
            filtered = filtered.filter(lead => lead.project_id === selectedProjectFilter);
        }

        if (selectedStatusFilter === 'approved') {
            filtered = filtered.filter(lead => lead.approved === true);
        } else if (selectedStatusFilter === 'qualified') {
            filtered = filtered.filter(lead => lead.qualification_score);
        } else if (selectedStatusFilter === 'hot') {
            filtered = filtered.filter(lead => lead.qualification_grade === 'hot');
        }

        return filtered;
    };

    const filteredLeads = getFilteredLeads();

    useEffect(() => {
        if (projects.length > 0) {
            loadAllProjectLeads();
        }
    }, [projects]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Lead Qualification</h2>
                    <p className="text-gray-500 text-sm mt-1">Score and qualify your leads across all projects</p>
                </div>
                <button
                    onClick={handleQualifyAllProjects}
                    disabled={qualifyingAll || projects.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
                >
                    {qualifyingAll ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Qualifying...
                        </>
                    ) : (
                        <>
                            <Target className="w-5 h-5" />
                            Qualify All Projects
                        </>
                    )}
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                        <select
                            value={selectedProjectFilter}
                            onChange={(e) => setSelectedProjectFilter(e.target.value)}
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
                            onChange={(e) => setSelectedStatusFilter(e.target.value)}
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

            <div className="grid grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <CheckCircle className="w-8 h-8 opacity-80" />
                    </div>
                    <p className="text-sm opacity-90">Approved Leads</p>
                    <p className="text-3xl font-bold mt-1">{allLeads.filter(l => l.approved === true).length}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <Users className="w-8 h-8 opacity-80" />
                    </div>
                    <p className="text-sm opacity-90">Total Leads</p>
                    <p className="text-3xl font-bold mt-1">{allLeads.length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <Star className="w-8 h-8 opacity-80" />
                    </div>
                    <p className="text-sm opacity-90">Qualified Leads</p>
                    <p className="text-3xl font-bold mt-1">{allLeads.filter(l => l.qualification_score).length}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <List className="w-8 h-8 opacity-80" />
                    </div>
                    <p className="text-sm opacity-90">Projects</p>
                    <p className="text-3xl font-bold mt-1">{projects.length}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <Target className="w-8 h-8 opacity-80" />
                    </div>
                    <p className="text-sm opacity-90">Hot Leads</p>
                    <p className="text-3xl font-bold mt-1">{allLeads.filter(l => l.qualification_grade === 'hot').length}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Leads</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {selectedProjectFilter === 'all' ? 'All Projects' : projects.find(p => p.project_id === selectedProjectFilter)?.project_name} • 
                        {selectedStatusFilter === 'all' ? 'All Status' : selectedStatusFilter.charAt(0).toUpperCase() + selectedStatusFilter.slice(1)}
                    </p>
                </div>

                <div className="divide-y divide-gray-200">
                    {loadingAllLeads ? (
                        <div className="p-8 text-center">
                            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                            <p className="text-gray-500">Loading leads...</p>
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p>No leads found matching your filters</p>
                        </div>
                    ) : (
                        filteredLeads
                            .sort((a, b) => {
                                const scoreA = a.qualification_score || 0;
                                const scoreB = b.qualification_score || 0;
                                if (scoreB !== scoreA) return scoreB - scoreA;
                                if (a.approved === true && b.approved !== true) return -1;
                                if (b.approved === true && a.approved !== true) return 1;
                                return 0;
                            })
                            .map(lead => (
                                <div key={lead._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                lead.approved === true ? 'bg-green-100' :
                                                lead.qualification_grade === 'hot' ? 'bg-red-100' :
                                                lead.qualification_grade === 'warm' ? 'bg-orange-100' :
                                                lead.qualification_grade === 'lukewarm' ? 'bg-yellow-100' : 'bg-gray-100'
                                            }`}>
                                                {lead.approved === true ? (
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                ) : lead.qualification_score ? (
                                                    <Star className={`w-6 h-6 ${
                                                        lead.qualification_grade === 'hot' ? 'text-red-600' :
                                                        lead.qualification_grade === 'warm' ? 'text-orange-600' :
                                                        lead.qualification_grade === 'lukewarm' ? 'text-yellow-600' : 'text-gray-600'
                                                    }`} />
                                                ) : (
                                                    <Users className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-semibold text-gray-900">{lead.name}</p>
                                                    {lead.approved === true && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                                            APPROVED
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">{lead.company}</p>
                                                <p className="text-xs text-gray-500">{lead.project_name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {lead.qualification_score ? (
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-900">{lead.qualification_score}</p>
                                                    <p className="text-xs text-gray-500 uppercase">{lead.qualification_grade}</p>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">Not qualified</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
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
};

const SalesforceView = ({ selectedProject }) => {
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState(null);

    const handleSync = async () => {
        if (!selectedProject) return;

        setSyncing(true);
        try {
            const response = await fetch(`http://localhost:8000/lead-generation/salesforce/sync-qualified-leads/${selectedProject}`, {
                method: 'POST'
            });
            const data = await response.json();
            setSyncResult(data);
            console.log('Sync completed:', data.message);
        } catch (error) {
            console.error('Failed to sync with Salesforce:', error);
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Salesforce Sync</h2>
                    <p className="text-gray-500 text-sm mt-1">Sync qualified leads to Salesforce CRM</p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={!selectedProject || syncing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
                >
                    {syncing ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Syncing...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="w-5 h-5" />
                            Sync to Salesforce
                        </>
                    )}
                </button>
            </div>

            {syncResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                            <p className="font-bold text-green-900">Sync Completed</p>
                            <p className="text-sm text-green-700">{syncResult.message}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600">Synced Leads: <span className="font-bold text-gray-900">{syncResult.synced_count}</span></p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Qualified Leads Ready for Sync</h3>
                <p className="text-sm text-gray-600 mb-4">Only leads with qualification score ≥60 will be synced</p>
                <div className="space-y-3">
                    {/* This would need to be populated with actual leads data */}
                    <p className="text-center text-gray-500 py-8">No qualified leads to sync</p>
                </div>
            </div>
        </div>
    );
};

// Main component
export default function LeadGeneration() {
    const API_BASE_URL = 'http://localhost:8000/lead-generation';

    // Main Navigation State
    const [currentView, setCurrentView] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Project States
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);

    // Lead States
    const [leads, setLeads] = useState([]);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [leadFilter, setLeadFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Refs to prevent duplicate API calls
    const loadingLeadsRef = useRef(false);
    const lastLoadedProjectRef = useRef(null);
    const leadsLoadedRef = useRef(false);

    // Outreach States
    const [outreachMessages, setOutreachMessages] = useState([]);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedMessage, setEditedMessage] = useState({});
    const [campaignStatus, setCampaignStatus] = useState(null);

    // Email Monitor States
    const [emailMonitorStatus, setEmailMonitorStatus] = useState(false);
    const [emailStats, setEmailStats] = useState({});

    // Form States for Project Creation
    const [createProjectMode, setCreateProjectMode] = useState('form');
    const [projectForm, setProjectForm] = useState({
        project_name: '',
        business_objective: '',
        product_name: '',
        product_description: '',
        target_roles: [''],
        industries: [''],
        locations: [''],
        lead_count: 50,
        pain_points: [''],
        value_propositions: ['']
    });
    const [uploadedFile, setUploadedFile] = useState(null);

    // Statistics
    const [statistics, setStatistics] = useState({
        total_projects: 0,
        total_leads: 0,
        approved_leads: 0,
        sent_outreach: 0,
        qualified_leads: 0
    });

    // Helper Functions
    const showMessage = useCallback((type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    }, []);

    // Load initial data
    useEffect(() => {
        loadProjects();
        loadStatistics();
        loadEmailStats();
    }, []);

    // Load leads when entering leads or qualification view
    useEffect(() => {
        if ((currentView === 'leads' || currentView === 'qualification') && selectedProject) {
            if (lastLoadedProjectRef.current !== selectedProject) {
                leadsLoadedRef.current = false;
            }
            loadProjectLeads(selectedProject);
        }
    }, [currentView, selectedProject]);

    // Reload statistics when returning to dashboard
    useEffect(() => {
        if (currentView === 'dashboard') {
            loadStatistics();
        }
    }, [currentView]);

    // Debug: Monitor statistics changes
    useEffect(() => {
        console.log('Statistics state changed:', statistics);
    }, [statistics]);

    const loadStatistics = async () => {
        console.log('loadStatistics called');
        try {
            const projectsRes = await fetch(`${API_BASE_URL}/projects/list`);
            const projectsData = await projectsRes.json();
            console.log('Projects data:', projectsData);
            
            let totalLeads = 0;
            let approvedLeads = 0;
            let qualifiedLeads = 0;
            let sentOutreach = 0;
            if (projectsData.projects) {
                for (const project of projectsData.projects) {
                    console.log(`Processing project: ${project.project_id}`);
                    const leadsRes = await fetch(`${API_BASE_URL}/leads/project/${project.project_id}?limit=1000`);
                    const leadsData = await leadsRes.json();
                    console.log(`Project ${project.project_id} leads data:`, leadsData);
                    totalLeads += leadsData.total || 0;
                    
                    if (leadsData.leads) {
                        const projectApproved = leadsData.leads.filter(lead => lead.approved === true).length;
                        const projectQualified = leadsData.leads.filter(lead => lead.qualification_grade).length;
                        const projectSent = leadsData.leads.filter(lead => lead.outreach_status === 'sent').length;
                        
                        console.log(`Project ${project.project_id}: ${projectApproved} approved, ${projectQualified} qualified, ${projectSent} sent outreach`);
                        
                        approvedLeads += projectApproved;
                        qualifiedLeads += projectQualified;
                        sentOutreach += projectSent;
                    }
                }
            }

            console.log('Final statistics:', { totalLeads, approvedLeads, qualifiedLeads, sentOutreach });

            setStatistics(prevStats => ({
                ...prevStats,
                total_projects: projectsData.projects?.length || 0,
                total_leads: totalLeads,
                approved_leads: approvedLeads,
                sent_outreach: sentOutreach,
                qualified_leads: qualifiedLeads
            }));
            
            console.log('Statistics updated:', newStatistics);
        } catch (error) {
            console.error('Failed to load statistics:', error);
        }
    };

    const loadProjects = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/list`);
            const data = await response.json();
            if (data.status === 'success') {
                setProjects(data.projects || []);
            }
        } catch (error) {
            showMessage('error', 'Failed to load projects');
        }
    };

    const loadProjectDetails = async (projectId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);
            const data = await response.json();
            if (data.status === 'success') {
                setProjectDetails(data.project);
            }
        } catch (error) {
            showMessage('error', 'Failed to load project details');
        }
    };

    const loadProjectLeads = async (projectId, force = false) => {
        if (!force && loadingLeadsRef.current || (!force && leadsLoadedRef.current && lastLoadedProjectRef.current === projectId)) {
            return;
        }

        loadingLeadsRef.current = true;
        lastLoadedProjectRef.current = projectId;
        leadsLoadedRef.current = false;

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/leads/project/${projectId}?limit=100`);
            const data = await response.json();
            if (data.status === 'success') {
                setLeads(data.leads || []);
                leadsLoadedRef.current = true;
            }
        } catch (error) {
            showMessage('error', 'Failed to load leads');
        } finally {
            setLoading(false);
            loadingLeadsRef.current = false;
        }
    };

    const loadEmailStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/email-accounts/stats`);
            const data = await response.json();
            if (data.status === 'success') {
                setEmailStats(data.stats || {});
            }
        } catch (error) {
            console.error('Failed to load email stats:', error);
        }
    };

    // Project Creation Functions
    const handleCreateProject = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/projects/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectForm)
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                showMessage('success', 'Project created successfully!');
                setSelectedProject(data.project_id);
                await loadProjects();
                setCurrentView('project-details');
                await loadProjectDetails(data.project_id);
            } else {
                showMessage('error', data.detail || 'Failed to create project');
            }
        } catch (error) {
            showMessage('error', 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentUpload = async () => {
        if (!uploadedFile || !projectForm.project_name) {
            showMessage('error', 'Please provide project name and upload a document');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('project_name', projectForm.project_name);

        try {
            const response = await fetch(`${API_BASE_URL}/projects/upload-document`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                showMessage('success', 'Document analyzed and project created!');
                setSelectedProject(data.project_id);
                await loadProjects();
                setCurrentView('project-details');
                await loadProjectDetails(data.project_id);
            } else {
                showMessage('error', data.detail || 'Failed to upload document');
            }
        } catch (error) {
            showMessage('error', 'Failed to upload document');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateLeads = async () => {
        if (!selectedProject) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/leads/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: selectedProject,
                    lead_count: 50
                })
            });

            const data = await response.json();
            
            if (data.status === 'completed') {
                showMessage('success', `Generated ${data.generated_count} leads!`);
                await loadProjectLeads(selectedProject, true);
                setCurrentView('leads');
            } else {
                showMessage('error', 'Failed to generate leads');
            }
        } catch (error) {
            showMessage('error', 'Failed to generate leads');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateOutreach = async () => {
        if (selectedLeads.length === 0) {
            showMessage('error', 'Please select leads first');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/outreach/generate-messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: selectedProject,
                    lead_ids: selectedLeads
                })
            });

            const data = await response.json();
            
            if (data.status === 'completed') {
                showMessage('success', `Generated ${data.messages_generated} messages!`);
                setOutreachMessages(data.messages || []);
                setCurrentView('outreach-review');
            }
        } catch (error) {
            showMessage('error', 'Failed to generate messages');
        } finally {
            setLoading(false);
        }
    };

    const handleStartCampaign = async (messageIds) => {
        setLoading(true);
        try {
            console.log('Starting campaign with message IDs:', messageIds);
            
            const response = await fetch(`${API_BASE_URL}/outreach/start-campaign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: selectedProject,
                    message_ids: messageIds
                })
            });

            const data = await response.json();
            
            if (data.status === 'completed') {
                showMessage('success', `Campaign started! Sent: ${data.sent}, Failed: ${data.failed}`);
                setCurrentView('campaigns');
            } else {
                showMessage('error', data.error || 'Failed to start campaign');
            }
        } catch (error) {
            showMessage('error', 'Failed to start campaign');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMessage = async (messageId) => {
        try {
            await fetch(`${API_BASE_URL}/outreach/update-message`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message_id: messageId,
                    updated_message: editedMessage.message,
                    updated_subject: editedMessage.subject
                })
            });

            showMessage('success', 'Message updated!');

            setOutreachMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.lead_id === messageId
                        ? { ...msg, message: editedMessage.message, subject: editedMessage.subject }
                        : msg
                )
            );

            setEditingMessageId(null);
        } catch (error) {
            showMessage('error', 'Failed to update message');
        }
    };

    const handleArrayInput = useCallback((field, index, value) => {
        setProjectForm(prev => {
            const newArray = [...prev[field]];
            newArray[index] = value;
            return { ...prev, [field]: newArray };
        });
    }, []);

    const addArrayField = useCallback((field) => {
        setProjectForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    }, []);

    const removeArrayField = useCallback((field, index) => {
        setProjectForm(prev => {
            const newArray = prev[field].filter((_, i) => i !== index);
            return { ...prev, [field]: newArray };
        });
    }, []);

    const toggleLeadSelection = useCallback((leadId) => {
        setSelectedLeads(prev =>
            prev.includes(leadId)
                ? prev.filter(id => id !== leadId)
                : [...prev, leadId]
        );
    }, []);

    const selectAllLeads = useCallback(() => {
        setSelectedLeads(prev =>
            prev.length === leads.length ? [] : leads.map(l => l._id)
        );
    }, [leads]);

    // Campaign status polling
    useEffect(() => {
        if (currentView === 'campaigns' && selectedProject) {
            const interval = setInterval(async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/outreach/campaign-status/${selectedProject}`);
                    const data = await response.json();
                    setCampaignStatus(data);
                } catch (error) {
                    console.error('Failed to fetch campaign status:', error);
                }
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [currentView, selectedProject]);

    return (
        <div className="min-h-screen bg-gray-50 flex pt-22">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} selectedProject={selectedProject} />
            
            <div className="flex-1 p-4">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                        message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
                        'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                {currentView === 'dashboard' && (
                    <DashboardView 
                        key={`dashboard-${statistics.approved_leads}-${statistics.total_leads}`}
                        statistics={statistics} 
                        setCurrentView={setCurrentView} 
                        projects={projects}
                        setSelectedProject={setSelectedProject}
                        loadProjectDetails={loadProjectDetails}
                    />
                )}
                {currentView === 'create-project' && (
                    <CreateProjectView 
                        createProjectMode={createProjectMode}
                        setCreateProjectMode={setCreateProjectMode}
                        projectForm={projectForm}
                        setProjectForm={setProjectForm}
                        uploadedFile={uploadedFile}
                        setUploadedFile={setUploadedFile}
                        loading={loading}
                        handleCreateProject={handleCreateProject}
                        handleDocumentUpload={handleDocumentUpload}
                        handleArrayInput={handleArrayInput}
                        addArrayField={addArrayField}
                        removeArrayField={removeArrayField}
                    />
                )}
                {currentView === 'projects' && (
                    <ProjectsView 
                        setCurrentView={setCurrentView}
                        projects={projects}
                        setSelectedProject={setSelectedProject}
                        loadProjectDetails={loadProjectDetails}
                    />
                )}
                {currentView === 'project-details' && (
                    <ProjectDetailsView 
                        projectDetails={projectDetails}
                        selectedProject={selectedProject}
                        loading={loading}
                        handleGenerateLeads={handleGenerateLeads}
                        setCurrentView={setCurrentView}
                        loadProjectLeads={loadProjectLeads}
                    />
                )}
                {currentView === 'leads' && (
                    <LeadsView 
                        leads={leads}
                        selectedLeads={selectedLeads}
                        setSelectedLeads={setSelectedLeads}
                        leadFilter={leadFilter}
                        setLeadFilter={setLeadFilter}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleGenerateOutreach={handleGenerateOutreach}
                        toggleLeadSelection={toggleLeadSelection}
                        selectAllLeads={selectAllLeads}
                    />
                )}
                {currentView === 'outreach-review' && (
                    <OutreachReviewView 
                        outreachMessages={outreachMessages}
                        editingMessageId={editingMessageId}
                        setEditingMessageId={setEditingMessageId}
                        editedMessage={editedMessage}
                        setEditedMessage={setEditedMessage}
                        handleUpdateMessage={handleUpdateMessage}
                        handleStartCampaign={handleStartCampaign}
                    />
                )}
                {currentView === 'email-monitor' && (
                    <EmailMonitorView 
                        emailMonitorStatus={emailMonitorStatus}
                        setEmailMonitorStatus={setEmailMonitorStatus}
                        emailStats={emailStats}
                    />
                )}
                {currentView === 'campaigns' && (
                    <CampaignsView campaignStatus={campaignStatus} />
                )}
                {currentView === 'conversations' && <ConversationsView />}
                {currentView === 'qualification' && <QualificationView projects={projects} />}
                {currentView === 'salesforce' && <SalesforceView selectedProject={selectedProject} />}
            </div>
        </div>
    );
}