import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReportPage = ({ reportId }) => {
  const navigate = useNavigate();
  const id = reportId;

  // Sample contract analysis data
  const reportData = {
    contractId: id === 'uploaded' ? 'UPLOADED-001' : `C${id?.padStart(3, '0')}`,
    contractName: 'Service Agreement - TechCorp Solutions',
    contractAnalysis: [
      {
        type: 'Risk Assessment',
        description: 'Low risk contract with standard terms. No unusual clauses or high-risk provisions identified.'
      },
      {
        type: 'Compliance Check',
        description: 'Contract complies with standard legal requirements. All necessary clauses are present and properly structured.'
      },
      {
        type: 'Key Terms Extraction',
        description: 'Successfully extracted all key terms including payment terms, deliverables, timelines, and termination clauses.'
      },
      {
        type: 'Legal Clause Analysis',
        description: 'All legal clauses are properly structured and comply with industry standards. No ambiguous language detected.'
      },
      {
        type: 'Financial Terms Review',
        description: 'Payment terms are clearly defined with appropriate milestones and penalty clauses for non-compliance.'
      }
    ],
    keyTerms: [
      {
        sno: 1,
        term: 'Payment Terms',
        value: '$10,000 per month',
        importance: 'High',
        description: 'Monthly payment schedule clearly defined'
      },
      {
        sno: 2,
        term: 'Contract Duration',
        value: '12 months',
        importance: 'High',
        description: 'Clear start and end dates specified'
      },
      {
        sno: 3,
        term: 'Termination Clause',
        value: '30 days notice',
        importance: 'Medium',
        description: 'Standard termination notice period'
      },
      {
        sno: 4,
        term: 'Liability Limit',
        value: '$50,000',
        importance: 'High',
        description: 'Maximum liability cap clearly stated'
      },
      {
        sno: 5,
        term: 'Force Majeure',
        value: 'Included',
        importance: 'Medium',
        description: 'Standard force majeure clause present'
      }
    ],
    recommendations: [
      {
        type: 'Legal Review',
        description: 'Contract should be reviewed by legal counsel before signing to ensure compliance with local laws.'
      },
      {
        type: 'Risk Mitigation',
        description: 'Consider adding insurance requirements and indemnification clauses for better risk management.'
      },
      {
        type: 'Performance Metrics',
        description: 'Include specific performance metrics and KPIs to measure contract success.'
      },
      {
        type: 'Dispute Resolution',
        description: 'Add arbitration clause for faster and cost-effective dispute resolution.'
      },
      {
        type: 'Data Protection',
        description: 'Include GDPR compliance clauses if handling personal data.'
      }
    ],
    complianceChecks: [
      {
        type: 'Legal Compliance',
        description: 'Contract meets all standard legal requirements and industry best practices.'
      },
      {
        type: 'Regulatory Compliance',
        description: 'All necessary regulatory clauses are included and properly structured.'
      },
      {
        type: 'Industry Standards',
        description: 'Contract follows industry-standard terms and conditions.'
      },
      {
        type: 'Data Protection',
        description: 'Appropriate data protection and privacy clauses are included.'
      },
      {
        type: 'Intellectual Property',
        description: 'IP rights and ownership clauses are clearly defined.'
      }
    ]
  };

  const handleRevise = () => {
    // Handle revision logic
    alert('Revision functionality will be implemented');
  };

  const handleAcceptAndContinue = () => {
    navigate('/agent-playground/agent/contract-management-system/');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/agent-playground/agent/contract-management-system/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <div>
               <h1 className="text-xl font-semibold text-global-1">Contract Analysis Report</h1>
               <p className="text-sm text-global-2">
                 {reportData.contractName} - Contract ID: {reportData.contractId}
               </p>
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
               Accept & Continue to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Clinical Suggestions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#155DFC]">
                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
               <h2 className="text-lg font-semibold text-[#155DFC]">Contract Analysis</h2>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {reportData.contractAnalysis.map((analysis, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-gray-400 text-sm mt-0.5">•</span>
                  <div>
                    <span className="font-semibold text-global-1">{analysis.type}:</span>{' '}
                    <span className="text-global-3">{analysis.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prescription Recommendations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#155DFC]">
                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
               <h2 className="text-lg font-semibold text-[#155DFC]">Key Terms Extracted</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 text-global-3 font-medium">S.no</th>
                    <th className="text-left py-2 text-global-3 font-medium">Term</th>
                    <th className="text-left py-2 text-global-3 font-medium">Value</th>
                    <th className="text-left py-2 text-global-3 font-medium">Importance</th>
                    <th className="text-left py-2 text-global-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.keyTerms.map((term) => (
                    <tr key={term.sno} className="border-b border-gray-100">
                      <td className="py-3 text-global-1">{term.sno}</td>
                      <td className="py-3 text-global-1">{term.term}</td>
                      <td className="py-3 text-global-1">{term.value}</td>
                      <td className="py-3 text-global-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          term.importance === 'High' ? 'bg-red-100 text-red-800' :
                          term.importance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {term.importance}
                        </span>
                      </td>
                      <td className="py-3 text-global-1">{term.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Diet Plan */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#155DFC]">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
               <h2 className="text-lg font-semibold text-[#155DFC]">Recommendations</h2>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {reportData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-gray-400 text-sm mt-0.5">•</span>
                  <div>
                    <span className="font-semibold text-global-1">{recommendation.type}:</span>{' '}
                    <span className="text-global-3">{recommendation.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lab Test Recommendation */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#155DFC]">
                <path d="M19.5 14.25V11.625C19.5 9.76104 17.989 8.25 16.125 8.25H14.625C14.0037 8.25 13.5 7.74632 13.5 7.125V5.625C13.5 3.76104 11.989 2.25 10.125 2.25H8.25M8.25 15H15.75M8.25 18H12M10.5 21.75H6.375C5.33947 21.75 4.5 20.9105 4.5 19.875V4.125C4.5 3.08947 5.33947 2.25 6.375 2.25H9.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
               <h2 className="text-lg font-semibold text-[#155DFC]">Compliance Checks</h2>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {reportData.complianceChecks.map((check, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-gray-400 text-sm mt-0.5">•</span>
                  <div>
                    <span className="font-semibold text-global-1">{check.type}:</span>{' '}
                    <span className="text-global-3">{check.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;