import { useState } from 'react';
import { RefreshCw, Loader, CheckCircle } from 'lucide-react';

export default function SalesforceSync({ selectedProject }) {
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState(null);

    const API_BASE_URL = 'http://localhost:8000/lead-generation';

    const handleSync = async () => {
        if (!selectedProject) return;

        setSyncing(true);
        try {
            const response = await fetch(`${API_BASE_URL}/salesforce/sync-qualified-leads/${selectedProject}`, {
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
                    <p className="text-center text-gray-500 py-8">No qualified leads to sync</p>
                </div>
            </div>
        </div>
    );
}