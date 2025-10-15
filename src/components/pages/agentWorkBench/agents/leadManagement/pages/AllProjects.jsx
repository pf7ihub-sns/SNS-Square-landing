import { Plus, Briefcase } from 'lucide-react';
import { useState, useEffect  } from 'react';

export default function AllProjects({
    projects,
    setProjects,
    setCurrentView,
    setSelectedProject,
    loadProjectDetails,
}) {
    const [deletingProjectId, setDeletingProjectId] = useState(null);

    const handleRowClick = (projectId) => {
        setSelectedProject(projectId);
        loadProjectDetails(projectId);
        setCurrentView('project-details');
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            setDeletingProjectId(projectId);

            const response = await fetch(`http://localhost:8000/lead-generation/projects/${projectId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete project');

            // Remove project from local state
            setProjects((prev) => prev.filter((p) => p.project_id !== projectId));

        } catch (error) {
            console.error('Error deleting project:', error);
        } finally {
            setDeletingProjectId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
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

            {/* Projects Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Project Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Product
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Leads
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Created
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {projects.map((project) => (
                            <tr
                                key={project.project_id}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={(e) => {
                                    if (e.target.closest('button')) return;
                                    handleRowClick(project.project_id);
                                }}
                            >
                                {/* Project Info */}
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
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            project.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {project.status}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDeleteProject(project.project_id)}
                                        className={`text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1 ${
                                            deletingProjectId === project.project_id ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        disabled={deletingProjectId === project.project_id}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
