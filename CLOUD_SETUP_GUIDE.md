# Cloud Storage Integration Setup Guide

This guide will help you set up OneDrive and Dropbox integration for your AI Docs application.

## 🔵 OneDrive (Microsoft) Setup

### Step 1: Register Your App in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **"New registration"**
4. Fill out the form:
   - **Name**: `AI Docs OneDrive Integration`
   - **Supported account types**: Choose "Accounts in any organizational directory and personal Microsoft accounts"
   - **Redirect URI**: `Web` → `http://localhost:5173` (for development)
5. Click **"Register"**

### Step 2: Get Your Client ID

1. After registration, copy the **Application (client) ID**
2. Add it to your `.env.local` file:
   ```bash
   VITE_ONEDRIVE_CLIENT_ID=your_client_id_here
   ```

### Step 3: Configure API Permissions

1. Go to **API permissions** in your app
2. Click **"Add a permission"** → **Microsoft Graph** → **Delegated permissions**
3. Add these permissions:
   - `Files.Read`
   - `Files.Read.All`
4. Click **"Grant admin consent"** (if you're an admin)

### Step 4: Update Redirect URIs

1. Go to **Authentication**
2. Add your production domain when you deploy:
   - `https://yourdomain.com`

---

## 🟦 Dropbox Setup

### Step 1: Create a Dropbox App

1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Click **"Create app"**
3. Choose:
   - **Scoped access**
   - **Full Dropbox** (or App folder if you prefer)
   - Give your app a name: `AI-Docs-Integration`

### Step 2: Get Your App Key

1. After creating the app, copy the **App key**
2. Add it to your `.env.local` file:
   ```bash
   VITE_DROPBOX_APP_KEY=your_app_key_here
   ```

### Step 3: Configure OAuth Settings

1. In your app settings, go to **OAuth2** section
2. Add redirect URIs:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)

### Step 4: Set Permissions

1. Go to **Permissions** tab
2. Enable:
   - `files.metadata.read`
   - `files.content.read`

---

## 🟢 Your Final .env.local File Should Look Like:

```bash
#Ai_Docs - Cloud Storage API Keys
# Google Drive (already configured)
VITE_GOOGLE_CLIENT_ID=596921787943-5q1bhsvu9hb4nf0i7t15pj2fcjdhfj9b.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyCn43qjAvUz251_sEjztKefChgJvzyHDYo

# OneDrive (Microsoft Graph API)
VITE_ONEDRIVE_CLIENT_ID=12345678-1234-1234-1234-123456789abc

# Dropbox
VITE_DROPBOX_APP_KEY=abcd1234efgh5678
```

---

## 🚀 Testing Your Integration

1. **Start your development server**: `npm run dev`
2. **Open your app** and navigate to the AI Docs chat
3. **Click the upload button** and you should see all three options:
   - Local Device ✅ (already working)
   - Google Drive ✅ (already working)
   - OneDrive ⚙️ (needs setup)
   - Dropbox ⚙️ (needs setup)

---

## 🔧 Troubleshooting

### OneDrive Issues:
- **"OneDrive not configured"**: Make sure your `VITE_ONEDRIVE_CLIENT_ID` is set correctly
- **"Access denied"**: Check your API permissions in Azure Portal
- **CORS errors**: Make sure your redirect URI matches your current domain

### Dropbox Issues:
- **"Dropbox not configured"**: Make sure your `VITE_DROPBOX_APP_KEY` is set correctly
- **"App not found"**: Check that your app key is correct
- **Permission errors**: Verify the required scopes are enabled

---

## 📋 Current Implementation Status

✅ **Google Drive**: Fully implemented with modern Google Identity Services
✅ **OneDrive**: Implemented with Microsoft Graph API and MSAL
✅ **Dropbox**: Implemented with Dropbox Chooser API
✅ **Local Files**: Working perfectly

The implementation handles:
- ✅ Authentication with each service
- ✅ File picking interface
- ✅ File download and import
- ✅ Error handling and user feedback
- ✅ Loading states and UI feedback

---

## 🎯 Next Steps for You:

1. **Set up OneDrive credentials** using the Azure Portal guide above
2. **Set up Dropbox credentials** using the Dropbox App Console guide above  
3. **Test each integration** by uploading files from each service
4. **Update redirect URIs** when you deploy to production

Need help? The app will show setup instructions in the console when you try to use a service that's not configured yet! 🚀