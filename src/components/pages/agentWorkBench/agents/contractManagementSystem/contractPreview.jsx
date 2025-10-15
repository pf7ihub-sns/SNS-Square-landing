import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContractPreview = () => {
  const navigate = useNavigate();
  const [contractData, setContractData] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('generatedContract');
    if (data) {
      setContractData(JSON.parse(data));
    } else {
      navigate('/agent-playground/agent/contract-management-system/build');
    }
  }, [navigate]);

  const handleExport = (format) => {
    if (format === 'pdf') {
      alert('Contract exported as PDF successfully!');
      // After export, navigate back to dashboard
      navigate('/agent-playground/agent/contract-management-system/');
    } else if (format === 'docx') {
      alert('Contract exported as DOCX successfully!');
      // After export, navigate back to dashboard
      navigate('/agent-playground/agent/contract-management-system/');
    }
  };

  const handleBackToDashboard = () => {
    sessionStorage.removeItem('generatedContract');
    navigate('/agent-playground/agent/contract-management-system/');
  };

  if (!contractData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#155DFC] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contract...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/agent-playground/agent/contract-management-system/build')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 
            </button>
            <div>
              <h1 className="text-xl font-semibold text-global-1">Contract Preview</h1>
              <p className="text-sm text-global-2">Review and export your generated contract</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport('pdf')}
              className="px-5 py-2.5 bg-white border border-[#155DFC] text-[#155DFC] rounded-lg font-medium hover:bg-[#F0F5FF] transition-colors flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5M5.83333 8.33333L10 12.5M10 12.5L14.1667 8.33333M10 12.5V2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export as PDF
            </button>
            <button
              onClick={() => handleExport('docx')}
              className="px-5 py-2.5 bg-[#155DFC] text-white rounded-lg font-medium hover:bg-[#0d4ad4] transition-colors flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5M5.83333 8.33333L10 12.5M10 12.5L14.1667 8.33333M10 12.5V2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export as DOCX
            </button>
          </div>
        </div>
      </div>

      {/* Contract Preview */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Contract Header */}
          <div className="border-b border-gray-200 px-8 py-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-center text-global-1 mb-2">
              {contractData.contractType.toUpperCase()}
            </h2>
            <div className="text-center text-sm text-global-2">
              <p>Generated on: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Contract Body */}
          <div className="px-8 py-6 space-y-6">
            {/* Parties Section */}
            <div>
              <h3 className="text-lg font-semibold text-global-1 mb-3">PARTIES</h3>
              <div className="space-y-2 text-sm text-global-3">
                <p><strong>Party Name:</strong> {contractData.partyName}</p>
                {contractData.partyAddress && (
                  <p><strong>Address:</strong> {contractData.partyAddress}</p>
                )}
              </div>
            </div>

            {/* Contract Period */}
            <div>
              <h3 className="text-lg font-semibold text-global-1 mb-3">CONTRACT PERIOD</h3>
              <div className="space-y-2 text-sm text-global-3">
                <p><strong>Effective Date:</strong> {new Date(contractData.effectiveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                {contractData.expirationDate && (
                  <p><strong>Expiration Date:</strong> {new Date(contractData.expirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            {contractData.terms && (
              <div>
                <h3 className="text-lg font-semibold text-global-1 mb-3">TERMS AND CONDITIONS</h3>
                <div className="text-sm text-global-3 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {contractData.terms}
                </div>
              </div>
            )}

            {/* Payment Details */}
            {(contractData.paymentAmount || contractData.paymentSchedule) && (
              <div>
                <h3 className="text-lg font-semibold text-global-1 mb-3">PAYMENT TERMS</h3>
                <div className="space-y-2 text-sm text-global-3">
                  {contractData.paymentAmount && (
                    <p><strong>Amount:</strong> {contractData.paymentAmount}</p>
                  )}
                  {contractData.paymentSchedule && (
                    <p><strong>Payment Schedule:</strong> {contractData.paymentSchedule}</p>
                  )}
                </div>
              </div>
            )}

            {/* Special Conditions */}
            {contractData.specialConditions && (
              <div>
                <h3 className="text-lg font-semibold text-global-1 mb-3">SPECIAL CONDITIONS</h3>
                <div className="text-sm text-global-3 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {contractData.specialConditions}
                </div>
              </div>
            )}

            {/* Signatures Section */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-global-1 mb-6">SIGNATURES</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="border-t border-gray-400 pt-2">
                    <p className="text-sm text-global-3">Party Signature</p>
                    <p className="text-xs text-global-2 mt-1">Date: _______________</p>
                  </div>
                </div>
                <div>
                  <div className="border-t border-gray-400 pt-2">
                    <p className="text-sm text-global-3">Authorized Signature</p>
                    <p className="text-xs text-global-2 mt-1">Date: _______________</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleBackToDashboard}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractPreview;