import { useMemo } from 'react';
import { FileText, Upload, Plus, Minus, Loader } from 'lucide-react';

export default function CreateProject({ 
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
}) {
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
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        // Validate file type
                                        const validTypes = ['.txt', '.docx', '.pdf'];
                                        const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
                                        
                                        if (!validTypes.includes(fileExt)) {
                                            alert('Please upload a valid document (.txt, .docx, or .pdf)');
                                            e.target.value = '';
                                            return;
                                        }
                                        
                                        // Validate file size (max 10MB)
                                        if (file.size > 10 * 1024 * 1024) {
                                            alert('File size must be less than 10MB');
                                            e.target.value = '';
                                            return;
                                        }
                                        
                                        setUploadedFile(file);
                                    }
                                }}
                                accept=".txt,.docx,.pdf"
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
}