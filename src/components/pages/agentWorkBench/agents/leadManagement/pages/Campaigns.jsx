import { Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Campaigns({ campaignStatus }) {
    return (
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
}