# Google Drive Integration Setup

This guide explains how to set up Google Drive integration for file imports in the AI Docs chat.

## 🚀 Quick Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Google Drive API keys in `.env.local`:**
   - Add your Google Client ID
   - Add your Google API Key

## 📋 API Setup Instructions

### Google Drive Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services > Library**
4. Enable **Google Drive API** and **Google Picker API**
5. Go to **APIs & Services > Credentials**
6. Create **API Key** (for public access)
7. Create **OAuth 2.0 Client ID** (for authentication)
8. Add your domain to authorized origins

**Environment Variables:**
```
VITE_GOOGLE_DRIVE_API_KEY=your_api_key
VITE_GOOGLE_CLIENT_ID=your_client_id
```

### Dropbox Setup

1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Click **Create app**
3. Choose **Scoped access** and **App folder** or **Full Dropbox**
4. Name your app
5. Copy the **App key** from app settings

**Environment Variables:**
```
VITE_DROPBOX_APP_KEY=your_app_key
```

### OneDrive Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **App registrations**
3. Click **New registration**
4. Set redirect URI to your app domain + `/auth/onedrive`
5. Copy **Application (client) ID**
6. Add Microsoft Graph permissions: `Files.Read`

**Environment Variables:**
```
VITE_ONEDRIVE_CLIENT_ID=your_client_id
VITE_ONEDRIVE_REDIRECT_URI=http://localhost:5173/auth/onedrive
```

## 🔧 Features

### Local File Upload
- Browse and select files from local device
- Supports: PDF, DOCX, TXT, XLSX, XLS, CSV, JSON

### Cloud Storage Integration
- **Google Drive**: Browse and import files directly from Google Drive
- **Dropbox**: Select files from Dropbox with native file picker
- **OneDrive**: Access files from OneDrive via Microsoft Graph API

### File Processing
- All imported files are processed the same way as local uploads
- Automatic file type detection
- Error handling for unsupported formats
- Progress indicators during import

## 🎯 Usage

1. Click the upload button in the chat interface
2. Choose upload source:
   - **Local Device**: Traditional file browser
   - **Google Drive**: Authenticate and browse Google Drive files
   - **Dropbox**: Use Dropbox file picker
   - **OneDrive**: Browse OneDrive files
3. Select your file
4. File is automatically imported and ready to use

## 🔒 Security Notes

- API keys are stored in environment variables using Vite's `import.meta.env`
- OAuth flows handle authentication securely
- Files are processed client-side when possible
- No files are permanently stored on external servers

## 🐛 Troubleshooting

### "Failed to connect to [Service]"
- Check if API keys are correctly configured in `.env.local`
- Verify domain is authorized in service settings
- Check browser console for detailed errors

### "Authentication cancelled"
- User closed authentication popup
- Check redirect URIs match configuration

### "Unsupported file format"
- File type not supported by the AI processing backend
- Only PDF, DOCX, TXT, XLSX, XLS, CSV, JSON are supported

## 📱 Browser Support

- **Google Drive**: Chrome, Firefox, Safari, Edge
- **Dropbox**: All modern browsers with JavaScript enabled
- **OneDrive**: Modern browsers with popup support

## 🔄 Development

To test cloud storage locally:

1. Start the development server: `npm run dev`
2. Configure at least one cloud storage service in `.env.local`
3. Test file import functionality
4. Check browser console for API-related errors

## ⚠️ Important Notes

- **Vite Environment Variables**: Use `VITE_` prefix instead of `REACT_APP_`
- **Runtime Access**: Variables are accessed via `import.meta.env` in Vite
- **Security**: Never commit `.env.local` to version control

For production deployment, ensure all environment variables are properly configured in your hosting platform with the `VITE_` prefix.