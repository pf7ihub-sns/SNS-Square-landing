import { Home, List, Users, Mail, MessageSquare, Star, Database, Plus, Activity } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, selectedProject }) {
    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Lead Management</h1>
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

                {/* <button
                    onClick={() => setCurrentView('salesforce')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                        currentView === 'salesforce' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <Database className="w-5 h-5" />
                    <span>Salesforce Sync</span>
                </button> */}
            </nav>
        </div>
    );
}