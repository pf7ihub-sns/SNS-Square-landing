import { List, Users, CheckCircle, Mail, Star, TrendingUp, Plus, Activity, Briefcase, ChevronRight } from 'lucide-react';

export default function Dashboard({ statistics, setCurrentView, projects, setSelectedProject, loadProjectDetails }) {
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
                            onClick={() => setCurrentView('leads')}
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
}