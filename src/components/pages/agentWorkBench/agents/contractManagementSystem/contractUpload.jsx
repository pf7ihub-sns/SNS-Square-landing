import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoCaretBack } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';

const ContractUpload = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiStatus, setApiStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    // Frontend validation before upload
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    const maxSize = 50 * 1024 * 1024;

    // Check file type
    if (!validTypes.includes(file.type)) {
      toast.error('❌ Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.');
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      toast.error(`❌ File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds 50MB limit`);
      return;
    }

    if (file.size < 1024) {
      toast.error('❌ File is too small to be a valid contract');
      return;
    }

    try {
      setApiStatus('uploading');
      setUploadProgress(0);
      setAnalysisStage('Preparing upload...');
      
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        status: 'Uploading...',
        file: file
      });

      // ===== STEP 1: Upload the file =====
      setAnalysisStage('Uploading document...');
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch(`${API_BASE_URL}/contract-management-system/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.detail || 'Failed to upload contract');
      }

      const uploadData = await uploadResponse.json();
      setUploadProgress(50);
      
      setUploadedFile(prev => ({
        ...prev,
        status: 'Uploaded ✓',
        contractId: uploadData.contract_id
      }));
      
      toast.success('✅ File uploaded successfully!');
      
      // ===== STEP 2: Start Analysis =====
      setApiStatus('analyzing');
      setAnalysisStage('Analyzing contract...');
      setUploadProgress(60);
      
      setUploadedFile(prev => ({
        ...prev,
        status: 'Analyzing contract...'
      }));
      
      const analysisResponse = await fetch(
        `${API_BASE_URL}/contract-management-system/analyze/${uploadData.contract_id}`, 
        { method: 'POST' }
      );

      if (!analysisResponse.ok) {
        const error = await analysisResponse.json();
        throw new Error(error.detail || 'Failed to analyze contract');
      }

      const analysisData = await analysisResponse.json();
      setUploadProgress(100);
      
      setUploadedFile(prev => ({
        ...prev,
        status: 'Analysis Complete ✓',
        analysis: analysisData
      }));
      
      setApiStatus('success');
      setAnalysisStage('Analysis complete!');
      
      toast.success(`✅ Contract analyzed successfully!\n📋 Type: ${analysisData.contract_type}\n⚠️ Risk: ${analysisData.risk_level}`, {
        autoClose: 5000
      });
      
    } catch (error) {
      console.error('Upload/Analysis failed:', error);
      setApiStatus('error');
      setAnalysisStage('');
      
      // Parse error message for user-friendly display
      let errorMessage = error.message || 'Failed to process contract';
      
      // Extract emoji and message if present
      const emojiMatch = errorMessage.match(/^([^\s]+)\s*-?\s*(.+)$/);
      if (emojiMatch) {
        errorMessage = emojiMatch[2];
      }
      
      setUploadedFile(prev => ({
        ...prev,
        status: 'Error ✗',
        errorMessage: errorMessage
      }));
      
      // Show detailed error toast
      toast.error(
        <div>
          <strong>Upload Failed</strong>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>{errorMessage}</p>
        </div>,
        { autoClose: 8000 }
      );
    }
  };

  const handleContinue = () => {
    if (!uploadedFile || !uploadedFile.contractId) {
      toast.error('Please upload and analyze a file first');
      return;
    }
    
    if (apiStatus === 'error') {
      toast.error('Please fix the errors before continuing');
      return;
    }
    
    if (apiStatus !== 'success') {
      toast.info('Please wait for analysis to complete');
      return;
    }
    
    setIsProcessing(true);
    navigate(`/agent-playground/agent/contract-management-system/report/${uploadedFile.contractId}`);
  };

  const handleRemoveFile = async () => {
    if (uploadedFile?.contractId && apiStatus !== 'uploading' && apiStatus !== 'analyzing') {
      try {
        await fetch(`${API_BASE_URL}/contract-management-system/contract/${uploadedFile.contractId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to delete contract:', error);
      }
    }
    setUploadedFile(null);
    setApiStatus('idle');
    setUploadProgress(0);
    setAnalysisStage('');
  };

  const handleRetry = () => {
    const file = uploadedFile?.file;
    handleRemoveFile();
    if (file) {
      setTimeout(() => handleFileUpload(file), 500);
    }
  };

  // Show loading state while processing
  if (apiStatus === 'uploading' || apiStatus === 'analyzing') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {apiStatus === 'uploading' ? 'Uploading your file...' : 'Analyzing contract...'}
          </h2>
          
          {analysisStage && (
            <p className="text-gray-600 mb-4">{analysisStage}</p>
          )}
          
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          <p className="text-gray-500 text-sm mt-4">
            {apiStatus === 'uploading' 
              ? 'Uploading and validating your document...' 
              : 'AI is analyzing your contract. This may take 30-60 seconds...'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-25 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/agent-playground/agent/contract-management-system/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <IoCaretBack />
          </button>
          <div>
            <h1 className="ml-10 text-xl font-semibold text-global-1">Upload Contract</h1>
            <p className="ml-10 text-sm text-global-2 mt-1">
              Upload your contract to get started.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-16 text-center transition-colors ${
              isDragging
                ? 'border-[#155DFC] bg-[#084FE31A]'
                : 'border-gray-300 bg-white'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              {/* Cloud Upload Icon */}
              <div className="w-16 h-16 mb-6">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M48 38C52.4183 38 56 34.4183 56 30C56 25.5817 52.4183 22 48 22C47.7348 22 47.4719 22.0119 47.2119 22.0352C46.1454 15.3444 40.3792 10 33.5 10C25.4919 10 19 16.4919 19 24.5C19 25.2821 19.0659 26.0493 19.1934 26.7969C13.8872 27.9087 10 32.6742 10 38.5C10 45.4036 15.5964 51 22.5 51H48"
                    stroke="#155DFC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M32 32V48M32 32L28 36M32 32L36 36"
                    stroke="#155DFC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-medium text-global-1 mb-2">
                Choose a file or drag & drop it here
              </h3>
              <p className="text-sm text-global-2 mb-2">
                PDF, DOCX, DOC, or TXT formats, up to 50MB
              </p>

              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                />
                <span className="inline-block px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Browse File
                </span>
              </label>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-global-1">Uploaded files</h2>
            </div>

            <div className="p-6">
              <div className={`flex items-center justify-between p-4 rounded-lg ${
                apiStatus === 'error' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-4 flex-1">
                  {/* File Icon */}
                  <div className={`w-10 h-10 rounded flex items-center justify-center ${
                    apiStatus === 'error' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <span className={`font-bold text-xs ${
                      apiStatus === 'error' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {uploadedFile.name.split('.').pop().toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-global-1">{uploadedFile.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-global-2">{uploadedFile.size}</span>
                      <span className={`text-xs flex items-center gap-1 ${
                        apiStatus === 'error' ? 'text-red-600' : 
                        apiStatus === 'success' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                          apiStatus === 'error' ? 'bg-red-600' : 
                          apiStatus === 'success' ? 'bg-green-600' : 'bg-blue-600'
                        }`}></span>
                        {uploadedFile.status}
                      </span>
                    </div>
                    
                    {/* Error Message */}
                    {apiStatus === 'error' && uploadedFile.errorMessage && (
                      <div className="mt-2 text-sm text-red-700 bg-red-50 p-2 rounded border border-red-200">
                        {uploadedFile.errorMessage}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Retry Button (only on error) */}
                  {apiStatus === 'error' && (
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Retry
                    </button>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={handleRemoveFile}
                    className="text-gray-400 hover:text-gray-600"
                    title="Remove file"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M15 5L5 15M5 5L15 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {apiStatus === 'success' && (
                  <span className="text-green-600 font-medium">
                    ✓ Ready to view analysis report
                  </span>
                )}
                {apiStatus === 'error' && (
                  <span className="text-red-600 font-medium">
                    ✗ Please fix the error or upload a different file
                  </span>
                )}
              </div>
              
              <button
                onClick={handleContinue}
                disabled={isProcessing || apiStatus !== 'success'}
                className="px-6 py-2.5 bg-[#155DFC] text-white rounded-lg font-medium hover:bg-[#0d4ad4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'View Report'}
              </button>
            </div>
          </div>
        )}

        {/* Help Text */}
        {/* <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">📝 Upload Guidelines:</h3>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Only Real Estate contracts are supported (Lease, Rental, Construction, Property Sale)</li>
            <li>Document must be text-based (not scanned images without OCR)</li>
            <li>File size should be between 1KB and 50MB</li>
            <li>Minimum 50 words required for analysis</li>
            <li>Supported formats: PDF, DOCX, DOC, TXT</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default ContractUpload;