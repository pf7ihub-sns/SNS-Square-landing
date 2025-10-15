import { Activity, Mail, MessageSquare } from 'lucide-react';

export default function EmailMonitor({ emailMonitorStatus, setEmailMonitorStatus, emailStats }) {
    return (
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
}