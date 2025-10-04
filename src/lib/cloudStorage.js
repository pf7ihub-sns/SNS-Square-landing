import { CLOUD_CONFIG } from '../config/cloudStorage';

// Google Drive Integration
export class GoogleDriveService {
  static async loadAPI() {
    return new Promise((resolve, reject) => {
      if (window.google && window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2:picker', () => {
          window.gapi.client.init({
            apiKey: CLOUD_CONFIG.googleDrive.apiKey,
            clientId: CLOUD_CONFIG.googleDrive.clientId,
            scope: CLOUD_CONFIG.googleDrive.scope
          }).then(resolve).catch(reject);
        });
      };
      script.onerror = () => reject(new Error('Failed to load Google APIs'));
      document.head.appendChild(script);
    });
  }

  static async authenticate() {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }
    return authInstance.currentUser.get().getAuthResponse().access_token;
  }

  static async pickFile() {
    return new Promise((resolve, reject) => {
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .setOAuthToken(window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token)
        .setCallback((data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            resolve(data.docs[0]);
          } else if (data.action === window.google.picker.Action.CANCEL) {
            reject(new Error('User cancelled file selection'));
          }
        })
        .build();

      picker.setVisible(true);
    });
  }

  static async downloadFile(fileId, fileName) {
    const response = await window.gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });
    
    const blob = new Blob([response.body], { type: 'application/octet-stream' });
    return new File([blob], fileName);
  }
}


// Utility function to determine file type
export const getFileType = (fileName) => {
  const extension = fileName.toLowerCase().split('.').pop();
  const typeMap = {
    'pdf': 'application/pdf',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xls': 'application/vnd.ms-excel',
    'csv': 'text/csv',
    'json': 'application/json'
  };
  return typeMap[extension] || 'application/octet-stream';
};