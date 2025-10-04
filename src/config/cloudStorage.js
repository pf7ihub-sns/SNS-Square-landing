// Cloud Storage Configuration
// Replace these with your actual API keys and credentials

export const CLOUD_CONFIG = {
  googleDrive: {
    apiKey: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || 'YOUR_GOOGLE_DRIVE_API_KEY',
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    scope: 'https://www.googleapis.com/auth/drive.readonly'
  },
  
  dropbox: {
    appKey: import.meta.env.VITE_DROPBOX_APP_KEY || 'YOUR_DROPBOX_APP_KEY'
  },
  
  oneDrive: {
    clientId: import.meta.env.VITE_ONEDRIVE_CLIENT_ID || 'YOUR_ONEDRIVE_CLIENT_ID',
    redirectUri: import.meta.env.VITE_ONEDRIVE_REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin + '/auth/onedrive' : 'http://localhost:5173/auth/onedrive')
  }
};

// Supported file types for cloud storage
export const SUPPORTED_CLOUD_FILE_TYPES = {
  extensions: ['.pdf', '.docx', '.txt', '.xlsx', '.xls', '.csv', '.json'],
  mimeTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/json'
  ]
};