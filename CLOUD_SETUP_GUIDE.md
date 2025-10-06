# Cloud Storage Integration Setup Guide

Complete setup guide for Google Drive, OneDrive, and Dropbox integration in AI Docs application.

## 🎯 Quick Overview

This integration allows users to import files directly from:
- 📁 **Local Device** (already working)
- 🟢 **Google Drive** (already configured)
- 🔵 **OneDrive** (needs setup)
- 🟦 **Dropbox** (needs setup)

---

## 🟢 Google Drive Setup (Already Configured ✅)

Your Google Drive integration is already working with these credentials:
```bash
VITE_GOOGLE_CLIENT_ID=596921787943-5q1bhsvu9hb4nf0i7t15pj2fcjdhfj9b.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyCn43qjAvUz251_sEjztKefChgJvzyHDYo
```

**Features:**
- Modern Google Identity Services authentication
- Handles Google Docs/Sheets export (converts to DOCX/XLSX)
- Direct file download from Google Drive
- Proper error handling and user feedback

---

## 🔵 OneDrive (Microsoft Graph API) Setup

### Step 1: Register Your App in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **"New registration"**
4. Fill out the form:
   - **Name**: `AI Docs OneDrive Integration`
   - **Supported account types**: "Accounts in any organizational directory and personal Microsoft accounts"
   - **Redirect URI**: **"Single-page application (SPA)"** → `http://localhost:5173`
5. Click **"Register"**

### ⚠️ **CRITICAL**: Platform Configuration

After registration:
1. Go to **Authentication** section
2. Make sure you have **"Single-page application"** (NOT "Web")
3. If you see "Web", DELETE it and add "Single-page application" instead
4. **DO NOT** create any client secrets - SPAs don't need them!

### Step 2: Get Your Client ID

1. Copy the **Application (client) ID**
2. Add it to your `.env.local` file:
   ```bash
   VITE_ONEDRIVE_CLIENT_ID=your_client_id_here
   ```

### Step 3: Configure API Permissions

1. Go to **API permissions** in your app
2. Click **"Add a permission"** → **Microsoft Graph** → **Delegated permissions**
3. Add these permissions:
   - ✅ `Files.Read`
   - ✅ `Files.Read.All`
4. **DO NOT** click "Grant admin consent" - let users consent individually

### Step 4: Production Redirect URIs

When deploying to production:
1. Go to **Authentication**
2. Add your production domain under **Single-page application**:
   - `https://yourdomain.com`

---

## 🟦 Dropbox Setup

### Step 1: Create a Dropbox App

1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Click **"Create app"**
3. Choose:
   - **Scoped access**
   - **Full Dropbox** (recommended) or **App folder**
   - App name: `AI-Docs-Integration`
4. Click **"Create app"**

### Step 2: Get Your App Key

1. In your app dashboard, copy the **App key**
2. Add it to your `.env.local` file:
   ```bash
   VITE_DROPBOX_APP_KEY=your_app_key_here
   ```

### Step 3: Configure OAuth Settings

1. In app settings, scroll to **OAuth2**
2. Add redirect URIs:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)

### Step 4: Set Permissions

1. Go to **Permissions** tab
2. Enable these scopes:
   - ✅ `files.metadata.read`
   - ✅ `files.content.read`
3. Click **"Submit"**

---

## 🟢 Environment Variables Setup

Your `.env.local` file should contain:

```bash
#Ai_Docs - Cloud Storage API Keys

# Google Drive (Already Working ✅)
VITE_GOOGLE_CLIENT_ID=596921787943-5q1bhsvu9hb4nf0i7t15pj2fcjdhfj9b.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyCn43qjAvUz251_sEjztKefChgJvzyHDYo

# OneDrive (Microsoft Graph API - SPA Mode)
VITE_ONEDRIVE_CLIENT_ID=your_azure_client_id_here

# Dropbox
VITE_DROPBOX_APP_KEY=your_dropbox_app_key_here
```

**Important Notes:**
- ✅ Use `VITE_` prefix (not `REACT_APP_`)
- ✅ OneDrive does NOT need client secret (SPA mode)
- ✅ Never commit `.env.local` to git

---

## 🚀 Testing Your Integration

### Development Testing:
1. Run: `npm run dev`
2. Navigate to AI Docs chat
3. Click upload button → You should see 4 options:
   - 📱 **Local Device** ✅
   - 🟢 **Google Drive** ✅ 
   - 🔵 **OneDrive** (after setup)
   - 🟦 **Dropbox** (after setup)

### User Experience:
1. **Authentication**: Users get popup to login with their account
2. **File Selection**: Browse and select files from their cloud storage  
3. **Import**: Files automatically download and import into AI Docs
4. **Supported Types**: PDF, DOCX, TXT, XLSX, XLS, CSV, JSON

---

## 🔧 Troubleshooting

### OneDrive Issues:

**❌ "invalid_client" / "client_secret required"**
- **Fix**: Change platform to "Single-page application" in Azure Portal
- **Not**: "Web" application type

**❌ "OneDrive not set up for this account"**  
- **Fix**: User needs to activate OneDrive on their Microsoft account
- **Info**: Some accounts don't have OneDrive enabled by default

**❌ "Access denied"**
- **Fix**: Check API permissions in Azure Portal
- **Check**: Files.Read and Files.Read.All are enabled

### Dropbox Issues:

**❌ "Dropbox not configured"**
- **Fix**: Make sure `VITE_DROPBOX_APP_KEY` is set correctly
- **Check**: Environment variable has correct value

**❌ "App not found"**
- **Fix**: Verify app key is copied correctly from Dropbox console
- **Check**: App is not in development mode restrictions

### Google Drive Issues:

**❌ "403 Access blocked"**
- **Fix**: Add test user email to OAuth consent screen
- **Or**: Publish app for public use

**❌ "File download failed"**
- **Fix**: Check if file is a Google Workspace doc (auto-exports to Office format)

---

## 📋 Implementation Features

### Authentication:
- ✅ **OAuth 2.0** flows for all services
- ✅ **PKCE** (Proof Key for Code Exchange) for security
- ✅ **Token management** with refresh handling
- ✅ **User consent** flows (no admin approval needed)

### File Handling:
- ✅ **Smart file detection** (filters supported types)
- ✅ **Google Workspace export** (Docs→DOCX, Sheets→XLSX)
- ✅ **Progress indicators** during upload
- ✅ **Error recovery** with helpful messages

### User Experience:
- ✅ **Unified interface** for all cloud services
- ✅ **Loading states** with service-specific icons
- ✅ **Toast notifications** for feedback
- ✅ **Graceful fallbacks** when services unavailable

---

## 🎯 Production Deployment

When deploying to production:

1. **Update redirect URIs** in all service consoles:
   - Google: Add production domain to authorized origins
   - OneDrive: Add production URL to SPA redirect URIs
   - Dropbox: Add production domain to OAuth redirect URIs

2. **Environment variables** in hosting platform:
   - Set all `VITE_*` variables
   - Ensure they're available at build time

3. **Test all integrations** with production URLs

---

## 🔒 Security Notes

- **No secrets in frontend**: All authentication uses public client flows
- **User data privacy**: Files processed client-side when possible  
- **Scoped permissions**: Only request necessary file access
- **Secure tokens**: Access tokens stored in memory only
- **HTTPS required**: All OAuth flows require HTTPS in production

---

## 📱 Browser Compatibility

- **Google Drive**: Chrome, Firefox, Safari, Edge (modern versions)
- **OneDrive**: All browsers supporting MSAL.js 2.x
- **Dropbox**: Universal JavaScript support
- **Popups required**: All services use popup authentication

---

## ✅ Current Status

- 🟢 **Google Drive**: Fully working ✅
- 🔵 **OneDrive**: Code ready, needs Azure setup ⚙️
- 🟦 **Dropbox**: Code ready, needs app setup ⚙️
- 📱 **Local Files**: Working perfectly ✅

**Ready to use once you complete the setup steps above!** 🚀