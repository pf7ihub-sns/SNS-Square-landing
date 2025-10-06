import React from 'react';

const FileUploadDropdown = ({ 
  isOpen, 
  onClose, 
  onLocalFileSelect,
  onGoogleDriveClick,
  onOneDriveClick,
  onDropboxClick,
  cloudLoading,
  loading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-64">
      <div className="py-2">
        <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
          Upload from
        </div>
        
        {/* Local File Upload */}
        <label
          htmlFor="local-file-upload"
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 cursor-pointer"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M20 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Local Device</span>
        </label>
        <input
          type="file"
          id="local-file-upload"
          onChange={onLocalFileSelect}
          accept=".pdf,.docx,.txt,.xlsx,.xls,.csv,.json"
          className="hidden"
        />
        
        {/* Google Drive Option */}
        <button
          onClick={onGoogleDriveClick}
          disabled={cloudLoading === 'google-drive'}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.28 3L3.28 8.5L6.28 14h4.44L13.72 8.5L10.72 3H6.28zM14.5 6.5L12 11h8l2.5-4.5H14.5zM16 13L12 20.5L8 13h8z"/>
          </svg>
          <span>Google Drive</span>
          {cloudLoading === 'google-drive' && (
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-blue-500"></div>
          )}
        </button>
        
        {/* OneDrive Option */}
        <button
          onClick={onOneDriveClick}
          disabled={cloudLoading === 'onedrive'}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 11.2A5.09 5.09 0 0 0 14 7.5a6.12 6.12 0 0 0-6 5.1 3.5 3.5 0 0 0 .5 6.9h9.5a2.5 2.5 0 0 0 1.21-4.7z"/>
          </svg>
          <span>OneDrive</span>
          {cloudLoading === 'onedrive' && (
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-blue-600"></div>
          )}
        </button>
        
        {/* Dropbox Option */}
        {/* <button
          onClick={onDropboxClick}
          disabled={cloudLoading === 'dropbox'}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.004 3.5L0 7.5l7.004 4L7.004 7.5zm9.992 0L24 7.5l-7.004 4V7.5zM0 16.5l7.004 4L7.004 16.5l7.004-4L24 16.5l-7.004 4-2.004-1.25L12 20.5z"/>
          </svg>
          <span>Dropbox</span>
          {cloudLoading === 'dropbox' && (
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-blue-700"></div>
          )}
        </button> */}
      </div>
    </div>
  );
};

export default FileUploadDropdown;