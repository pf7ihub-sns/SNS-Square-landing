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
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <span className="ml-1">Local Device</span>
          </label>
        <input
          type="file"
          id="local-file-upload"
          onChange={onLocalFileSelect}
          accept=".pdf,.docx,.txt"
          className="hidden"
        />
        
        {/* Google Drive Option */}
        <button
          onClick={onGoogleDriveClick}
          disabled={cloudLoading === 'google-drive'}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3 2 21h20L12 3z" />
            </svg>
          </div>
          <span className="ml-1">Google Drive</span>
          {cloudLoading === 'google-drive' && (
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-yellow-500 ml-2"></div>
          )}
        </button>
        
        {/* OneDrive Option */}
        <button
          onClick={onOneDriveClick}
          disabled={cloudLoading === 'onedrive'}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.39 18.39a5.5 5.5 0 0 0-4.26-9.65 7 7 0 0 0-13.02 2A4.5 4.5 0 0 0 6.5 20h13.89a1 1 0 0 0-.0-1.61z" />
            </svg>
          </div>
          <span className="ml-1">OneDrive</span>
          {cloudLoading === 'onedrive' && (
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-blue-600 ml-2"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUploadDropdown;