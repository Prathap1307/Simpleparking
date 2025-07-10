'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BlogManagement = () => {
  // View states: 'table', 'create', 'edit'
  const [view, setView] = useState('table');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentBlog, setCurrentBlog] = useState(null);
  
  const [formData, setFormData] = useState({
    Blog_title: '',
    category: 'Travel Tips',
    Date: new Date().toISOString().split('T')[0],
    post_by: 'Admin',
    post_content_part_1: '',
    post_content_part_2: '',
    post_content_part_3: '',
    post_img: '',
    post_img_1: '',
    post_img_2: '',
    title_desc: ''
  });

  const categories = [
    'Travel Tips',
    'Airport Guides',
    'Parking Hacks',
    'Company News'
  ];

  // Fetch all blog posts
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/blog_post');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle API calls for create/update
  const handleApiCall = async (data, isEdit = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = '/api/blog_post';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit ? { id: currentBlog.id, ...data } : data;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error(`Failed to ${isEdit ? 'update' : 'create'} blog`);

      await fetchBlogs();
      setSuccess(`Blog ${isEdit ? 'updated' : 'created'} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      setView('table');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete blog post
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/blog_post', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!response.ok) throw new Error('Failed to delete blog');
      
      setBlogs(blogs.filter(blog => blog.id !== id));
      setSuccess('Blog post deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Set up edit form
  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setFormData({
      Blog_title: blog.Blog_title,
      category: blog.category,
      Date: blog.Date.split('T')[0],
      post_by: blog.post_by,
      post_content_part_1: blog.post_content_part_1,
      post_content_part_2: blog.post_content_part_2 || '',
      post_content_part_3: blog.post_content_part_3 || '',
      post_img: blog.post_img,
      post_img_1: blog.post_img_1 || '',
      post_img_2: blog.post_img_2 || '',
      title_desc: blog.title_desc
    });
    setView('edit');
  };

  // Set up create form
  const handleCreate = () => {
    setFormData({
      Blog_title: '',
      category: 'Travel Tips',
      Date: new Date().toISOString().split('T')[0],
      post_by: 'Admin',
      post_content_part_1: '',
      post_content_part_2: '',
      post_content_part_3: '',
      post_img: '',
      post_img_1: '',
      post_img_2: '',
      title_desc: ''
    });
    setView('create');
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleApiCall(formData, view === 'edit');
  };

  // Back to table view
  const handleBack = () => {
    setView('table');
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="space-y-8 p-4">
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 right-0 px-2 py-1">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{success}</span>
          <button onClick={() => setSuccess(null)} className="absolute top-0 right-0 px-2 py-1">
            ×
          </button>
        </div>
      )}

      {/* Conditional Rendering Based on View State */}
      {view === 'table' ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create New Blog
            </button>
          </div>

          {/* Blog Posts Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {loading && blogs.length === 0 ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {blogs.map(blog => (
                        <motion.tr
                          key={blog.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{blog.Blog_title}</div>
                            <div className="text-sm text-gray-500">{blog.title_desc}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              {blog.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(blog.Date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {blog.post_by}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(blog)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Edit"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(blog.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <motion.div 
          id="blog-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {view === 'edit' ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to List
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
                <input
                  type="text"
                  name="Blog_title"
                  value={formData.Blog_title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title Description (Excerpt)</label>
                <input
                  type="text"
                  name="title_desc"
                  value={formData.title_desc}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="Date"
                  value={formData.Date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  name="post_by"
                  value={formData.post_by}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
                <input
                  type="url"
                  name="post_img"
                  value={formData.post_img}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Part 1</label>
              <textarea
                name="post_content_part_1"
                value={formData.post_content_part_1}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image 1 URL</label>
              <input
                type="url"
                name="post_img_1"
                value={formData.post_img_1}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Part 2</label>
              <textarea
                name="post_content_part_2"
                value={formData.post_content_part_2}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image 2 URL</label>
              <input
                type="url"
                name="post_img_2"
                value={formData.post_img_2}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Part 3</label>
              <textarea
                name="post_content_part_3"
                value={formData.post_content_part_3}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {view === 'edit' ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  view === 'edit' ? 'Update Blog' : 'Create Blog'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default BlogManagement;