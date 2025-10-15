import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoCaretBack } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';

// ==================== SIDEBAR COMPONENT ====================

// Placeholder data structure for the sidebar content
// In a real application, this would come from reportData
const ContractSidebar = ({ reportData }) => {
    // Mapping of reportData keys to display labels
    const contractDetails = [
        { label: 'Contract Name', value: reportData?.contract_name || 'N/A' },
        { label: 'Contract ID', value: reportData?.contract_id || 'N/A' },
        { label: 'Type', value: reportData?.contract_type || 'N/A' },
        { label: 'Domain', value: reportData?.domain || 'N/A' },
        { label: 'Review Date', value: reportData?.review_date || 'N/A' },
        { label: 'Owner', value: reportData?.owner || 'N/A' },
        { label: 'Parties', value: reportData?.parties || 'N/A' },
        { label: 'Effective Date', value: reportData?.effective_date || 'N/A' },
    ];

    return (
        <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md sticky top-[100px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Contract Details</h3>
                <dl className="space-y-3">
                    {contractDetails.map(({ label, value }) => (
                        <div key={label} className="text-sm">
                            <dt className="font-medium text-gray-500">{label}:</dt>
                            <dd className="text-gray-900 break-words">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
};

// ==================== MAIN PAGE COMPONENT ====================

const ReportPage = ({ reportId }) => {
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/';

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                console.log('Fetching report for ID:', reportId);

                if (!reportId) {
                    throw new Error('No report ID provided');
                }

                // Call backend report endpoint
                const response = await fetch(
                    `${API_BASE_URL}/contract-management-system/report/${reportId}`
                );

                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    console.error('Error response:', error);
                    throw new Error(error.detail || 'Failed to get contract report');
                }

                const data = await response.json();
                console.log('Received report data:', data);

                // --- Mocking Data Structure for Demo Purposes (REMOVE IN PROD) ---
                // Since the original code had the contract details in the header, 
                // we'll mock the data structure to populate the new sidebar
                const mockedData = {
                    ...data,
                    contract_name: data.contract_name || 'Contract_CA-20251012-256A585D (1).docx',
                    contract_id: data.contract_id || 'CA-20251012-D0EE1389',
                    contract_type: data.contract_type || 'Rental Agreement',
                    domain: data.domain || 'Real Estate',
                    review_date: data.review_date || 'October 12, 2025',
                    owner: data.owner || 'Legal Team',
                    parties: data.parties || '[OWNER NAME] & [TENANT NAME]',
                    effective_date: data.effective_date || '[START DATE]',
                };
                // --- End Mocking (REMOVE IN PROD) ---

                setReportData(mockedData);
            } catch (err) {
                console.error('Failed to fetch report:', err);
                setError(err.message);
                toast.error(`Failed to load report: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [reportId, API_BASE_URL]);

    const handleRevise = () => {
        if (reportData?.contract_id) {
            navigate(`/agent-playground/agent/contract-management-system/upload?revisionId=${reportData.contract_id}`);
        } else {
            navigate('/agent-playground/agent/contract-management-system/upload');
        }
    };

    const handleAcceptAndContinue = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/contract-management-system/contract/${reportData.contract_id}/accept`,
                { method: 'POST' }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to accept contract');
            }

            toast.success('Contract accepted successfully! 🎉');
            navigate('/agent-playground/agent/contract-management-system/');
        } catch (error) {
            console.error('Failed to accept contract:', error);
            toast.error(`Error: ${error.message || 'Failed to accept contract'}`);
        }
    };

    const handleDownloadDocx = async () => {
        try {
            toast.info('Generating DOCX file...');

            const response = await fetch(
                `${API_BASE_URL}/contract-management-system/contract/${reportData.contract_id}/export/docx`
            );

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Failed to generate DOCX');
            }

            // Get the blob from response
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Contract_${reportData.contract_id}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('Contract downloaded successfully! 💾');
        } catch (error) {
            console.error('Failed to download DOCX:', error);
            toast.error(`Error: ${error.message || 'Failed to download contract'}`);
        }
    };

    // Tab configuration
    const tabs = [
        { id: 'overview', label: 'Contract Overview', icon: '📄' },
        { id: 'clauses', label: 'Clause Identification', icon: '📋' },
        { id: 'compliance', label: 'Compliance & Risk', icon: '✓' },
        { id: 'deviations', label: 'Deviations & Risks', icon: '⚠️' },
        { id: 'negotiations', label: 'Negotiation Suggestions', icon: '💡' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#155DFC] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading report for contract {reportId}...</p>
                </div>
            </div>
        );
    }

    if (error || !reportData) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error: {error || 'No report data available'}</p>
                    <button
                        onClick={() => navigate('/agent-playground/agent/contract-management-system/')}
                        className="px-6 py-2.5 bg-[#155DFC] text-white rounded-lg font-medium hover:bg-[#0d4ad4]"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-28 min-h-screen bg-[#F8F9FD]">
            {/* Header - Fixed to the top */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-20 shadow-md">
                <div className="flex items-center justify-between">
                    {/* Title and Back Button */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/agent-playground/agent/contract-management-system/')}
                            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Back to dashboard"
                        >
                            <IoCaretBack size={24} />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Contract Summary & Analysis Report</h1>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-3 items-center">
                        {/* <button
                            onClick={handleDownloadDocx}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5M5.83333 8.33333L10 12.5M10 12.5L14.1667 8.33333M10 12.5V2.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Download DOCX
                        </button> */}
                        <button
                            onClick={handleRevise}
                            className="px-4 py-2 bg-white border border-[#155DFC] text-[#155DFC] rounded-lg font-medium hover:bg-[#F0F5FF] transition-colors text-sm"
                        >
                            Revise
                        </button>
                        <button
                            onClick={handleAcceptAndContinue}
                            className="px-4 py-2 bg-[#155DFC] text-white rounded-lg font-medium hover:bg-[#0d4ad4] transition-colors text-sm"
                        >
                            Accept & Continue
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-6 p-8 max-w-7xl mx-auto">
                {/* Left Side: Tabs and Content */}
                <div className="flex-1">
                    {/* Tabs Bar */}
                    <div className="bg-white border-b border-gray-200 sticky top-[80px] z-10 shadow-sm">
                        <div className="flex gap-1 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-3 font-medium transition-colors relative whitespace-nowrap text-sm ${
                                        activeTab === tab.id
                                            ? 'text-[#155DFC] border-b-2 border-[#155DFC]'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="mr-1">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="py-6">
                        {activeTab === 'overview' && <OverviewTab data={reportData.overview} />}
                        {activeTab === 'clauses' && <ClausesTab data={reportData.clause_identification} />}
                        {activeTab === 'compliance' && <ComplianceTab data={reportData.compliance_validation} />}
                        {activeTab === 'deviations' && <DeviationsTab data={reportData.deviation_reporting} />}
                        {activeTab === 'negotiations' && <NegotiationsTab data={reportData.negotiation_suggestions} />}
                    </div>
                </div>

                {/* Right Side: Sidebar/Contract Details */}
                <ContractSidebar reportData={reportData} />
            </div>
        </div>
    );
};

// ==================== TAB COMPONENTS (Unchanged) ====================

const OverviewTab = ({ data }) => {
    if (!data) return <EmptyState message="No overview data available" />;

    const { contract_type, description, key_points } = data;

    return (
        <div className="">
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-md">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">1. Contract Overview</h2>

                <div className="space-y-6">
                    {/* Contract Type */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Contract Type</h3>
                        <p className="text-gray-700">{contract_type}</p>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{description}</p>
                    </div>

                    {/* Key Points */}
                    {key_points && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Key Points</h3>

                            {/* Obligations */}
                            {key_points.obligations && key_points.obligations.length > 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Obligations
                                    </h4>
                                    <div className="space-y-2">
                                        {key_points.obligations.map((obligation, idx) => (
                                            <div key={idx} className="text-gray-700 pl-4">
                                                <span className="font-medium">{obligation}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Deadlines */}
                            {key_points.deadlines && Object.keys(key_points.deadlines).length > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                                        Important Dates
                                    </h4>
                                    <div className="space-y-2">
                                        {Object.entries(key_points.deadlines).map(([key, value], idx) => (
                                            <div key={idx} className="text-gray-700 pl-4">
                                                <span className="font-medium capitalize">{key.replace('_', ' ')}:</span> {value}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Penalties */}
                            {key_points.penalties && key_points.penalties.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                        Penalties
                                    </h4>
                                    <div className="space-y-2">
                                        {key_points.penalties.map((penalty, idx) => (
                                            <div key={idx} className="text-gray-700 pl-4">
                                                <span className="font-medium">{penalty}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Clauses */}
                            {key_points.additional_clauses && key_points.additional_clauses.length > 0 && (
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                        Additional Clauses
                                    </h4>
                                    <div className="space-y-2">
                                        {key_points.additional_clauses.map((clause, idx) => (
                                            <div key={idx} className="text-gray-700 pl-4">
                                                <span className="font-medium">{clause}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ClausesTab = ({ data }) => {
    if (!data) return <EmptyState message="No clause data available" />;

    const { identified_clauses, summary } = data;

    // Format key details with bullet points and clean JSON-like strings
    const formatKeyDetails = (details) => {
        if (!details) return null;

        // First clean up any JSON-like strings
        const cleanDetails = details
            .replace(/[{}'"\[\]]/g, '')    // Remove JSON syntax characters
            .replace(/,/g, ' • ')          // Replace commas with bullet points
            .replace(/:/g, ': ')           // Add space after colons
            .split('•')                    // Split by bullet points
            .map(item => item.trim())      // Trim whitespace
            .filter(item => item !== '');  // Remove empty items

        return (
            <ul className="list-disc pl-5 space-y-1">
                {cleanDetails.map((point, i) => (
                    <li key={i} className="text-gray-700">{point}</li>
                ))}
            </ul>
        );
    };

    return (
        <div className="">
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-md">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">2. Clause Identification</h2>

                {/* Table */}
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                    Clause Category
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                    Detected Clauses
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">
                                    Key Details / Notes
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {identified_clauses && identified_clauses.length > 0 ? (
                                identified_clauses.map((clause, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                                            {clause.clause_category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                                            {clause.detected_clauses}
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                                            {formatKeyDetails(clause.key_details)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No clauses identified
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                {summary && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Summary</h3>
                        <p className="text-sm text-gray-700">{summary}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ComplianceTab = ({ data }) => {
    if (!data) return <EmptyState message="No compliance data available" />;

    const { compliance_checks, summary, overall_score } = data;

    return (
        <div className="">
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-md">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">3. Compliance & Risk Validation</h2>

                {/* Score Badge */}
                {overall_score !== undefined && (
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
                            Overall Compliance Score: {overall_score}%
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b-2 border-gray-300">
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Compliance Area</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Risk Level</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {compliance_checks && compliance_checks.length > 0 ? (
                                compliance_checks.map((check, idx) => (
                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">{check.compliance_area}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                check.status === 'Pass' || check.status === 'Compliant'
                                                    ? 'bg-green-100 text-green-800'
                                                    : check.status === 'Warning' || check.status === 'Partial Compliance'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                {check.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                check.risk_level === 'Low'
                                                    ? 'bg-green-100 text-green-800'
                                                    : check.risk_level === 'Medium'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                {check.risk_level}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">{check.notes}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                                        No compliance checks available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-800">
                        <strong>Summary:</strong> {summary}
                    </p>
                </div>
            </div>
        </div>
    );
};

const DeviationsTab = ({ data }) => {
    if (!data) return <EmptyState message="No deviation data available" />;

    const { deviations, summary } = data;

    return (
        <div className="">
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-md">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">4. Deviation & Risk Reporting</h2>

                {/* Table */}
                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b-2 border-gray-300">
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Clause</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Expected / Standard Term</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Deviation Detected</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Risk Impact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deviations && deviations.length > 0 ? (
                                deviations.map((deviation, idx) => (
                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">{deviation.clause}</td>
                                        <td className="py-3 px-4 text-gray-700">{deviation.expected_term}</td>
                                        <td className="py-3 px-4 text-gray-700">{deviation.deviation_detected}</td>
                                        <td className="py-3 px-4">
                                            <span className={`${
                                                deviation.risk_impact.includes('High')
                                                    ? 'text-red-700 font-semibold'
                                                    : deviation.risk_impact.includes('Medium')
                                                        ? 'text-yellow-700 font-semibold'
                                                        : 'text-gray-700'
                                                }`}>
                                                {deviation.risk_impact}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                                        No deviations identified
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-gray-800">
                        <strong>Summary:</strong> {summary}
                    </p>
                </div>
            </div>
        </div>
    );
};

const NegotiationsTab = ({ data }) => {
    if (!data) return <EmptyState message="No negotiation data available" />;

    const { suggestions, summary, negotiation_strategy } = data;

    return (
        <div className="">
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-md">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">5. Negotiation Suggestions</h2>

                {/* Table */}
                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b-2 border-gray-300">
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Clause</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Suggested Action</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Rationale</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suggestions && suggestions.length > 0 ? (
                                suggestions.map((suggestion, idx) => (
                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">{suggestion.clause}</td>
                                        <td className="py-3 px-4 text-gray-700">{suggestion.suggested_action}</td>
                                        <td className="py-3 px-4 text-gray-700">{suggestion.rationale}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                                        No negotiation suggestions available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-gray-800">
                        <strong>Summary:</strong> {summary}
                    </p>
                </div>

                {/* Negotiation Strategy */}
                {negotiation_strategy && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-gray-800">
                            <strong>Negotiation Strategy:</strong> {negotiation_strategy}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const EmptyState = ({ message }) => (
    <div className="">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-md">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <p className="text-gray-500 text-lg font-medium">{message}</p>
                    <p className="text-gray-400 text-sm mt-2">The analysis may still be processing or the contract may not contain this type of information.</p>
                </div>
            </div>
        </div>
    </div>
);


export default ReportPage;