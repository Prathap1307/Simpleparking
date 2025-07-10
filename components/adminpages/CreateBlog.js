'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

const CreateBlog = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
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

  // Fetch blog data if in edit mode
  useEffect(() => {
    if (editId) {
      const fetchBlog = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/blog_post?id=${editId}`);
          if (!response.ok) throw new Error('Failed to fetch blog');
          const data = await response.json();
          setFormData({
            Blog_title: data.Blog_title,
            category: data.category,
            Date: data.Date.split('T')[0],
            post_by: data.post_by,
            post_content_part_1: data.post_content_part_1,
            post_content_part_2: data.post_content_part_2 || '',
            post_content_part_3: data.post_content_part_3 || '',
            post_img: data.post_img,
            post_img_1: data.post_img_1 || '',
            post_img_2: data.post_img_2 || '',
            title_desc: data.title_desc
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [editId]);

  const handleApiCall = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const url = '/api/blog_post';
      const method = editId ? 'PUT' : 'POST';
      const body = editId ? { id: editId, ...data } : data;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${editId ? 'update' : 'create'} blog: ${response.statusText}`);
      }

      const result = await response.json();
      setSuccess(true);
      if (!editId) {
        // Reset form if creating new post
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
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleApiCall(formData);
    } catch (err) {
      // Error already handled in handleApiCall
    }
  };

  return (
    <div className="space-y-8 p-4">
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
          <span className="block sm:inline">
            {editId ? 'Blog updated successfully!' : 'Blog created successfully!'}
          </span>
          <button onClick={() => setSuccess(false)} className="absolute top-0 right-0 px-2 py-1">
            ×
          </button>
        </div>
      )}

      <motion.div 
        id="blog-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editId ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        
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
              onClick={() => router.push('/blog-management')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to List
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
                  {editId ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                editId ? 'Update Blog' : 'Create Blog'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateBlog;