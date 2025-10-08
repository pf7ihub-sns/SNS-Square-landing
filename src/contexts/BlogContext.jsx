import React, { createContext, useContext, useState, useEffect } from 'react'

const BlogContext = createContext()

export const useBlogContext = () => {
  const context = useContext(BlogContext)
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider')
  }
  return context
}

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)

  // Load blogs from localStorage on mount
  useEffect(() => {
    const savedBlogs = localStorage.getItem('admin_blogs')
    if (savedBlogs) {
      try {
        const parsedBlogs = JSON.parse(savedBlogs)
        setBlogs(parsedBlogs)
      } catch (error) {
        console.error('Error loading blogs:', error)
      }
    }
  }, [])

  // Save blogs to localStorage whenever blogs change
  useEffect(() => {
    localStorage.setItem('admin_blogs', JSON.stringify(blogs))
  }, [blogs])

  const addBlog = (blogData) => {
    const newBlog = {
      ...blogData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: generateSlug(blogData.title)
    }
    setBlogs(prev => [newBlog, ...prev])
    return newBlog
  }

  const updateBlog = (blogId, updatedData) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === blogId 
        ? { ...blog, ...updatedData, updatedAt: new Date().toISOString() }
        : blog
    ))
  }

  const deleteBlog = (blogId) => {
    setBlogs(prev => prev.filter(blog => blog.id !== blogId))
  }

  const getBlogById = (blogId) => {
    return blogs.find(blog => blog.id === blogId)
  }

  const getBlogBySlug = (slug) => {
    return blogs.find(blog => blog.slug === slug)
  }

  const publishBlog = (blogId) => {
    updateBlog(blogId, {
      publishSettings: {
        status: 'published',
        publishedAt: new Date().toISOString(),
        visibility: 'public'
      }
    })
  }

  const draftBlog = (blogId) => {
    updateBlog(blogId, {
      publishSettings: {
        status: 'draft',
        visibility: 'public'
      }
    })
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

  const getStats = () => {
    const totalBlogs = blogs.length
    const publishedBlogs = blogs.filter(blog => blog.publishSettings?.status === 'published').length
    const draftBlogs = blogs.filter(blog => blog.publishSettings?.status === 'draft').length
    const recentBlogs = blogs.filter(blog => {
      const createdAt = new Date(blog.createdAt)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return createdAt > oneWeekAgo
    }).length

    return {
      total: totalBlogs,
      published: publishedBlogs,
      draft: draftBlogs,
      recent: recentBlogs
    }
  }

  const value = {
    blogs,
    loading,
    addBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    getBlogBySlug,
    publishBlog,
    draftBlog,
    getStats,
    setLoading
  }

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  )
}

export default BlogContext
