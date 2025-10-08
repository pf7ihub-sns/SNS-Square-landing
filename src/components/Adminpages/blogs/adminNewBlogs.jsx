// Adminpages/blogs/addNewPost.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FreeRichTextEditor from '../../common/FreeRichTextEditor'
import BlogSEOAnalyzer from '../../common/BlogSEOAnalyzer'
import BlogSidebar from '../../common/BlogSidebar'
import MediaLibrary from '../../common/MediaLibrary'
import { Upload, AlertCircle, CheckCircle, Image, FileText, Film, ArrowLeft } from 'lucide-react'
import { useBlogContext } from '../../../contexts/BlogContext'

const AddNewPost = () => {
  const { addBlog, updateBlog, getBlogById } = useBlogContext()
  const navigate = useNavigate()
  const { blogId } = useParams() // For edit mode
  const isEditMode = !!blogId
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    seoData: {
      primaryKeyword: '',
      secondaryKeywords: [],
      metaTitle: '',
      metaDescription: '',
      metaUrl: ''
    },
    featuredImage: null,
    categories: ['Uncategorized'],
    tags: [],
    publishSettings: {
      visibility: 'public',
      publishDate: 'immediately',
      status: 'draft'
    },
    author: 'SNS (admin)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [notification, setNotification] = useState({ show: false, type: '', message: '' })
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [mediaLibrary, setMediaLibrary] = useState([])
  const editorRef = useRef(null)

  // Load existing blog for edit mode
  useEffect(() => {
    if (isEditMode && blogId) {
      // Load existing blog for editing
      const existingBlog = getBlogById(blogId)
      if (existingBlog) {
        setFormData(existingBlog)
        showNotification('info', 'Blog loaded for editing')
      } else {
        showNotification('error', 'Blog not found')
        navigate('/admin/blog/all')
      }
    }
  }, [isEditMode, blogId, getBlogById, navigate])

  // Remove auto-save functionality since we're not using session storage

  const updateFormData = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
      updatedAt: new Date().toISOString()
    }))
  }

  const updateSEOData = (seoUpdates) => {
    setFormData(prev => ({
      ...prev,
      seoData: { ...prev.seoData, ...seoUpdates },
      updatedAt: new Date().toISOString()
    }))
  }

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000)
  }

  const saveDraft = (silent = false) => {
    try {
      const draftData = {
        ...formData,
        publishSettings: { ...formData.publishSettings, status: 'draft' },
        updatedAt: new Date().toISOString()
      }
      
      if (isEditMode) {
        // Update existing blog
        updateBlog(blogId, draftData)
        if (!silent) {
          showNotification('success', 'Blog updated successfully!')
        }
      } else {
        // For new blogs, we'll implement backend integration later
        if (!silent) {
          showNotification('success', 'Draft will be saved when backend is integrated!')
        }
      }
      
      console.log('Draft data:', draftData)
    } catch (error) {
      console.error('Error saving draft:', error)
      if (!silent) {
        showNotification('error', 'Failed to save draft')
      }
    }
  }

  const previewPost = () => {
    if (!formData.title) {
      showNotification('error', 'Please add a title before previewing')
      return
    }
    
    const previewData = {
      ...formData,
      publishSettings: { ...formData.publishSettings, status: 'preview' },
      previewedAt: new Date().toISOString()
    }
    
    showNotification('info', 'Preview functionality will be implemented with backend integration!')
    
    console.log('Preview data:', previewData)
  }

  const publishPost = () => {
    // Validation
    const validationErrors = []
    
    if (!formData.title.trim()) validationErrors.push('Title is required')
    if (!formData.content.trim()) validationErrors.push('Content is required')
    if (formData.categories.length === 0) validationErrors.push('At least one category is required')
    if (!formData.seoData.primaryKeyword) validationErrors.push('Primary SEO keyword is recommended')
    
    if (validationErrors.length > 0) {
      showNotification('error', `Please fix: ${validationErrors.join(', ')}`)
      return
    }

    try {
      const publishData = {
        ...formData,
        publishSettings: {
          ...formData.publishSettings,
          status: 'published',
          publishedAt: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      }

      if (isEditMode) {
        // Update existing blog
        updateBlog(blogId, publishData)
        showNotification('success', 'Blog updated and published successfully!')
      } else {
        // Add new blog
        const newBlog = addBlog(publishData)
        showNotification('success', 'Blog published successfully!')
      }
      
      console.log('Published blog data:', publishData)
      
      // Navigate back to all blogs after a delay
      setTimeout(() => {
        navigate('/admin/blog/all')
      }, 2000)
      
    } catch (error) {
      console.error('Error publishing blog:', error)
      showNotification('error', 'Failed to publish blog')
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Enhanced Media Upload Function
  const handleMediaUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,video/*,.pdf,.doc,.docx,.txt'
    input.multiple = true
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files)
      
      if (files.length === 0) return
      
      showNotification('info', `Processing ${files.length} file(s)...`)
      
      const uploadPromises = files.map(file => processMediaFile(file))
      
      try {
        const processedFiles = await Promise.all(uploadPromises)
        const validFiles = processedFiles.filter(file => file !== null)
        
        if (validFiles.length > 0) {
          // Add to media library (will be integrated with backend later)
          const updatedMediaLibrary = [...mediaLibrary, ...validFiles]
          setMediaLibrary(updatedMediaLibrary)
          
          showNotification('success', `${validFiles.length} file(s) uploaded successfully!`)
          
          // Auto-insert first image if it's an image
          if (validFiles[0]?.type.startsWith('image/')) {
            insertMediaIntoEditor(validFiles[0])
          }
        }
        
      } catch (error) {
        console.error('Error processing files:', error)
        showNotification('error', 'Error uploading files')
      }
    }
    
    input.click()
  }

  // Process individual media file
  const processMediaFile = (file) => {
    return new Promise((resolve, reject) => {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        showNotification('error', `${file.name} is too large (max 10MB)`)
        resolve(null)
        return
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm',
        'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]

      if (!allowedTypes.includes(file.type)) {
        showNotification('error', `${file.name} is not a supported file type`)
        resolve(null)
        return
      }

      const reader = new FileReader()
      
      reader.onload = (e) => {
        const mediaFile = {
          id: generateId(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: e.target.result,
          uploadedAt: new Date().toISOString(),
          alt: '',
          caption: ''
        }
        
        resolve(mediaFile)
      }
      
      reader.onerror = () => {
        showNotification('error', `Error reading ${file.name}`)
        resolve(null)
      }
      
      reader.readAsDataURL(file)
    })
  }

  // Insert media into Tiptap editor
  const insertMediaIntoEditor = (mediaFile) => {
    if (!editorRef.current) return

    const editor = editorRef.current.getEditor()
    if (!editor) return

    if (mediaFile.type.startsWith('image/')) {
      // Insert image
      editor.chain().focus().setImage({ 
        src: mediaFile.url,
        alt: mediaFile.alt || mediaFile.name,
        title: mediaFile.caption || mediaFile.name
      }).run()
    } else if (mediaFile.type.startsWith('video/')) {
      // Insert video (as HTML)
      const videoHTML = `<video controls width="100%" style="max-width: 600px;">
        <source src="${mediaFile.url}" type="${mediaFile.type}">
        Your browser does not support the video tag.
      </video>`
      
      editor.chain().focus().insertContent(videoHTML).run()
    } else {
      // Insert as link for documents
      const linkHTML = `<p><a href="${mediaFile.url}" target="_blank" download="${mediaFile.name}">📁 ${mediaFile.name}</a></p>`
      editor.chain().focus().insertContent(linkHTML).run()
    }

    showNotification('success', `${mediaFile.name} inserted into content`)
  }

  // Open media library
  const openMediaLibrary = () => {
    setShowMediaLibrary(true)
  }

  // Handle media selection from library
  const handleMediaSelect = (mediaFile) => {
    insertMediaIntoEditor(mediaFile)
    setShowMediaLibrary(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
          notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
          'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : 
           notification.type === 'error' ? <AlertCircle size={20} /> : 
           <AlertCircle size={20} />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibrary
          mediaLibrary={mediaLibrary}
          onMediaSelect={handleMediaSelect}
          onClose={() => setShowMediaLibrary(false)}
          onMediaUpdate={setMediaLibrary}
          onNotification={showNotification}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>Admin</span>
            <span className="mx-2">/</span>
            <span>Blog Management</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">
              {isEditMode ? 'Edit Blog Post' : 'Add New Blog Post'}
            </span>
          </div>
          
          {/* Header Content */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/blog/all')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to All Blogs
              </button>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Blog Post' : 'Add New Blog Post'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Status: <span className="font-medium">{formData.publishSettings.status === 'draft' ? 'Draft' : 'Published'}</span> • 
                  Last updated: {new Date(formData.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => saveDraft()}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                {isEditMode ? 'Save Changes' : 'Save Draft'}
              </button>
              <button
                onClick={previewPost}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Preview
              </button>
              <button
                onClick={publishPost}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                {isEditMode ? 'Update & Publish' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                placeholder="Enter your blog title here..."
                className="w-full p-4 text-xl font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                autoFocus
              />
              {formData.title && (
                <p className="mt-3 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                  <span className="font-medium">URL Slug:</span> /{generateSlug(formData.title)}
                </p>
              )}
            </div>

            {/* Media Upload Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Media & Assets</h3>
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={handleMediaUpload}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Upload size={16} />
                  <span>Upload Media</span>
                </button>
                
                <button 
                  onClick={openMediaLibrary}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <Image size={16} />
                  <span>Media Library ({mediaLibrary.length})</span>
                </button>

                {mediaLibrary.length > 0 && (
                  <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                    <FileText size={14} className="inline mr-1" />
                    Latest: {mediaLibrary.slice(-3).map(file => file.name.split('.')[0]).join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Blog Content *</h3>
                <p className="text-sm text-gray-500 mt-1">Write your blog content using the rich text editor below</p>
              </div>
              <div className="p-6">
                <FreeRichTextEditor
                  ref={editorRef}
                  content={formData.content}
                  onChange={(content) => updateFormData('content', content)}
                  placeholder="Start writing your blog content here..."
                />
              </div>
            </div>

            {/* SEO Analyzer */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">SEO Optimization</h3>
                <p className="text-sm text-gray-500 mt-1">Optimize your blog for search engines</p>
              </div>
              <div className="p-6">
                <BlogSEOAnalyzer
                  content={formData.content}
                  title={formData.title}
                  onTitleChange={(title) => updateFormData('title', title)}
                  onSEODataChange={updateSEOData}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <BlogSidebar
            formData={formData}
            onPublish={publishPost}
            onSaveDraft={saveDraft}
            onPreview={previewPost}
            onFormDataChange={updateFormData}
            onNotification={showNotification}
          />
        </div>
      </div>
    </div>
  )
}

export default AddNewPost
