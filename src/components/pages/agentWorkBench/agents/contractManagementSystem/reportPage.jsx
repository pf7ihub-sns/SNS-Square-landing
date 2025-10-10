import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReportPage = ({ reportId }) => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/';
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // Tab state

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
        
        setReportData(data);
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

      toast.success('Contract accepted successfully!');
      navigate('/agent-playground/agent/contract-management-system/');
    } catch (error) {
      console.error('Failed to accept contract:', error);
      toast.error(`Error: ${error.message || 'Failed to accept contract'}`);
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

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
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

  if (!reportData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No report data available</p>
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
    <div className="min-h-screen bg-[#F8F9FD]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/agent-playground/agent/contract-management-system/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Contract Summary & Analysis Report</h1>
              <div className="flex gap-4 text-sm text-gray-600 mt-1">
                <span><strong>Contract Name:</strong> {reportData.contract_name}</span>
                <span><strong>Contract ID:</strong> {reportData.contract_id}</span>
                <span><strong>Type:</strong> {reportData.contract_type}</span>
              </div>
              <div className="flex gap-4 text-sm text-gray-600 mt-1">
                {reportData.parties?.parties && reportData.parties.parties.length > 0 && (
                  <span><strong>Parties:</strong> {reportData.parties.parties.map(p => p.name).join(' & ')}</span>
                )}
                {reportData.effective_date && (
                  <span><strong>Effective Date:</strong> {reportData.effective_date}</span>
                )}
                <span><strong>Review Date:</strong> {reportData.review_date}</span>
                <span><strong>Owner:</strong> {reportData.owner}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRevise}
              className="px-5 py-2.5 bg-white border border-[#155DFC] text-[#155DFC] rounded-lg font-medium hover:bg-[#F0F5FF] transition-colors"
            >
              Revise
            </button>
            <button
              onClick={handleAcceptAndContinue}
              className="px-5 py-2.5 bg-[#155DFC] text-white rounded-lg font-medium hover:bg-[#0d4ad4] transition-colors"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-8">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-[#155DFC] border-b-2 border-[#155DFC]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-8 py-6">
        {activeTab === 'overview' && <OverviewTab data={reportData.overview} />}
        {activeTab === 'clauses' && <ClausesTab data={reportData.clause_identification} />}
        {activeTab === 'compliance' && <ComplianceTab data={reportData.compliance_validation} />}
        {activeTab === 'deviations' && <DeviationsTab data={reportData.deviation_reporting} />}
        {activeTab === 'negotiations' && <NegotiationsTab data={reportData.negotiation_suggestions} />}
      </div>
    </div>
  );
};

// ==================== TAB COMPONENTS ====================

const OverviewTab = ({ data }) => {
  if (!data) return <EmptyState message="No overview data available" />;

  const { summary, key_points } = data;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Contract Overview</h2>
        
        <p className="text-gray-700 mb-6 leading-relaxed">{summary}</p>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Points:</h3>

        {/* Obligations */}
        {key_points?.obligations && key_points.obligations.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">● Obligations:</h4>
            <div className="ml-6 space-y-2">
              {key_points.obligations.map((obligation, idx) => (
                <div key={idx} className="text-gray-700">
                  <span className="font-medium">{obligation.party}:</span> {obligation.obligation}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deadlines */}
        {key_points?.deadlines && key_points.deadlines.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">● Deadlines:</h4>
            <div className="ml-6 space-y-1">
              {key_points.deadlines.map((deadline, idx) => (
                <div key={idx} className="text-gray-700">
                  <span className="font-medium">{deadline.type}:</span> {deadline.date}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Penalties */}
        {key_points?.penalties && key_points.penalties.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">● Penalties:</h4>
            <div className="ml-6 space-y-2">
              {key_points.penalties.map((penalty, idx) => (
                <div key={idx} className="text-gray-700">
                  <span className="font-medium">{penalty.type}:</span> {penalty.description}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Clauses */}
        {key_points?.additional_clauses && key_points.additional_clauses.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">● Additional Clauses:</h4>
            <div className="ml-6 space-y-2">
              {key_points.additional_clauses.map((clause, idx) => (
                <div key={idx} className="text-gray-700">
                  <span className="font-medium">{clause.type}:</span> {clause.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ClausesTab = ({ data }) => {
  if (!data) return <EmptyState message="No clause data available" />;

  const { identified_clauses, summary } = data;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">2. Clause Identification</h2>

        {/* Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Clause Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Detected Clauses</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Key Details / Notes</th>
              </tr>
            </thead>
            <tbody>
              {identified_clauses && identified_clauses.length > 0 ? (
                identified_clauses.map((clause, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{clause.clause_category}</td>
                    <td className="py-3 px-4 text-gray-700">{clause.detected_clauses}</td>
                    <td className="py-3 px-4 text-gray-700">{clause.key_details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                    No clauses identified
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

const ComplianceTab = ({ data }) => {
  if (!data) return <EmptyState message="No compliance data available" />;

  const { compliance_checks, summary, overall_score } = data;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
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
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
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
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
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
  <div className="max-w-6xl mx-auto">
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  </div>
);

export default ReportPage;