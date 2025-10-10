// Cloud storage service functions
export class CloudStorageService {
  
  // Google Drive functions
  static checkGoogleDriveConfig() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    return clientId && apiKey && 
           clientId !== 'YOUR_GOOGLE_CLIENT_ID' && 
           apiKey !== 'YOUR_GOOGLE_API_KEY';
  }

  static showGoogleDriveSetupModal() {
    const setupInstructions = `
🔧 Google Drive Setup Required

To enable Google Drive integration:

1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google Drive API & Google Picker API
4. Create credentials (API Key + OAuth Client ID)
5. Add your domain to authorized origins

Environment Variables:
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_API_KEY=your_api_key

For detailed setup instructions, see:
https://developers.google.com/drive/api/quickstart/js
    `;
    
    console.log(setupInstructions);
    
    if (confirm("Open Google Drive API setup documentation?")) {
      window.open('https://developers.google.com/drive/api/quickstart/js', '_blank');
    }
  }

  static loadGoogleAPIs() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.accounts && window.google.picker) {
        resolve();
        return;
      }

      const gisScript = document.createElement('script');
      gisScript.src = 'https://accounts.google.com/gsi/client';
      gisScript.onload = () => {
        const pickerScript = document.createElement('script');
        pickerScript.src = 'https://apis.google.com/js/api.js';
        pickerScript.onload = () => {
          window.gapi.load('picker', () => {
            const pickerApiScript = document.createElement('script');
            pickerApiScript.src = 'https://apis.google.com/js/picker.js';
            pickerApiScript.onload = () => resolve();
            pickerApiScript.onerror = () => reject(new Error('Failed to load Google Picker API'));
            document.head.appendChild(pickerApiScript);
          });
        };
        pickerScript.onerror = () => reject(new Error('Failed to load Google APIs'));
        document.head.appendChild(pickerScript);
      };
      gisScript.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(gisScript);
    });
  }

  static async initializeGoogleDrive() {
    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    
    if (!CLIENT_ID || !API_KEY || CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID' || API_KEY === 'YOUR_GOOGLE_API_KEY') {
      throw new Error('Google Drive API not configured');
    }
    
    try {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
      });

      return new Promise((resolve, reject) => {
        window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.readonly',
          callback: (response) => {
            if (response.error) {
              reject(new Error(`OAuth error: ${response.error}`));
              return;
            }
            window.googleAccessToken = response.access_token;
            resolve(response);
          },
          error_callback: (error) => {
            reject(new Error(`OAuth initialization error: ${error}`));
          }
        }).requestAccessToken();
      });
    } catch (error) {
      console.error('Google Drive initialization error:', error);
      throw new Error('Failed to initialize Google Drive access');
    }
  }

  static showGoogleDrivePicker() {
    return new Promise((resolve, reject) => {
      if (!window.googleAccessToken) {
        reject(new Error('No access token available'));
        return;
      }
      
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .setOAuthToken(window.googleAccessToken)
        .setDeveloperKey(import.meta.env.VITE_GOOGLE_API_KEY)
        .setCallback(async (data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const file = data.docs[0];
            try {
              const fileData = await CloudStorageService.downloadGoogleDriveFile(file.id, file.name);
              resolve(fileData);
            } catch (error) {
              reject(error);
            }
          } else if (data.action === window.google.picker.Action.CANCEL) {
            resolve(null);
          }
        })
        .build();
      
      picker.setVisible(true);
    });
  }

  static async downloadGoogleDriveFile(fileId, fileName) {
    try {
      if (!window.googleAccessToken) {
        throw new Error('No access token available');
      }

      const metadataResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,name`, {
        headers: {
          'Authorization': `Bearer ${window.googleAccessToken}`
        }
      });

      if (!metadataResponse.ok) {
        throw new Error(`Failed to get file metadata: ${metadataResponse.status}`);
      }

      const metadata = await metadataResponse.json();
      const mimeType = metadata.mimeType;
      
      let downloadUrl;
      let exportMimeType;
      let exportFileName = fileName;

      if (mimeType === 'application/vnd.google-apps.document') {
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/vnd.openxmlformats-officedocument.wordprocessingml.document`;
        exportMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        exportFileName = fileName.replace(/\.[^/.]+$/, '') + '.docx';
      } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`;
        exportMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        exportFileName = fileName.replace(/\.[^/.]+$/, '') + '.xlsx';
      } else if (mimeType === 'application/vnd.google-apps.presentation') {
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/vnd.openxmlformats-officedocument.presentationml.presentation`;
        exportMimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        exportFileName = fileName.replace(/\.[^/.]+$/, '') + '.pptx';
      } else {
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
        exportMimeType = mimeType;
      }
      
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${window.googleAccessToken}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Download error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const file = new File([blob], exportFileName, { type: exportMimeType });
      
      return { file, fileName: exportFileName };
    } catch (error) {
      console.error("Google Drive download error:", error);
      throw error;
    }
  }

  // OneDrive functions
  static checkOneDriveConfig() {
    const clientId = import.meta.env.VITE_ONEDRIVE_CLIENT_ID;
    return clientId && clientId !== 'YOUR_ONEDRIVE_CLIENT_ID';
  }

  static showOneDriveSetupModal() {
    const setupInstructions = `
🔧 OneDrive Setup Required

To enable OneDrive integration:

1. Go to Azure Portal (portal.azure.com)
2. Register a new application in Azure AD
3. Add Microsoft Graph API permissions
4. Get your Application (client) ID
5. Add redirect URI for your domain

Environment Variables:
VITE_ONEDRIVE_CLIENT_ID=your_client_id

For detailed setup instructions, see:
https://docs.microsoft.com/en-us/graph/auth-register-app-v2
    `;
    
    console.log(setupInstructions);
    
    if (confirm("Open OneDrive API setup documentation?")) {
      window.open('https://docs.microsoft.com/en-us/graph/auth-register-app-v2', '_blank');
    }
  }

  static loadMicrosoftGraph() {
    return new Promise((resolve, reject) => {
      if (window.msal) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://alcdn.msauth.net/browser/2.32.2/js/msal-browser.min.js';
      script.onload = () => {
        window.msalInstance = new window.msal.PublicClientApplication({
          auth: {
            clientId: import.meta.env.VITE_ONEDRIVE_CLIENT_ID,
            authority: 'https://login.microsoftonline.com/common',
            redirectUri: window.location.origin
          }
        });
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Microsoft Graph SDK'));
      document.head.appendChild(script);
    });
  }

  static async initializeOneDrive() {
    const CLIENT_ID = import.meta.env.VITE_ONEDRIVE_CLIENT_ID;
    
    if (!CLIENT_ID || CLIENT_ID === 'YOUR_ONEDRIVE_CLIENT_ID') {
      throw new Error('OneDrive API not configured');
    }
    
    try {
      const loginRequest = {
        scopes: ['Files.Read', 'Files.Read.All']
      };
      
      const response = await window.msalInstance.loginPopup(loginRequest);
      window.oneDriveAccessToken = response.accessToken;
      return response;
    } catch (error) {
      console.error('OneDrive initialization error:', error);
      throw new Error('Failed to initialize OneDrive access');
    }
  }

  static async downloadOneDriveFile(fileId, fileName) {
    try {
      if (!window.oneDriveAccessToken) {
        throw new Error('No OneDrive access token available');
      }

      const downloadUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`;
      
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${window.oneDriveAccessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: blob.type });
      
      return { file, fileName };
    } catch (error) {
      console.error("OneDrive download error:", error);
      throw error;
    }
  }

}