import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Save, AlertCircle } from 'lucide-react';
import { adminService } from '../services/adminApi.js';
import { getImageUrl } from '../utils/imageUrl.js';

export const AdminBlogFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: 'Varsha Ayurveda Editorial',
    published: true
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (isEdit && id) {
        try {
          const blog = await adminService.getBlogById(id);
          setFormData({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            featuredImage: blog.featuredImage || '',
            author: blog.author || 'Varsha Ayurveda Editorial',
            published: blog.published
          });
        } catch (err: any) {
          setErrorMessage('Failed to load blog post');
        }
      }
    };

    init();
  }, [id, isEdit]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const url = await adminService.uploadImage(e.target.files[0]);
      setFormData(prev => ({ ...prev, featuredImage: url }));
    } catch (err) {
      alert('Failed to upload featured image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    try {
      if (isEdit && id) {
        await adminService.updateBlog(id, formData);
      } else {
        await adminService.createBlog(formData);
      }
      navigate('/admin/blogs');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to save blog post');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={16} /> Back to Blog List
        </Link>
        <h1 className="text-xl font-serif font-bold text-slate-900">
          {isEdit ? 'Edit Article' : 'Compose New Article'}
        </h1>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Article Title *</label>
          <input
            required
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Ayurveda and Everyday Wellness"
            className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Custom URL Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated-if-empty"
              className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Author Name *</label>
            <input
              required
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Featured Header Image</label>
          <div className="flex items-center gap-4">
            {formData.featuredImage && (
              <img
                src={getImageUrl(formData.featuredImage)}
                alt=""
                className="w-24 h-16 object-cover rounded-xl border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold">
              <Upload size={14} /> {uploadingImage ? 'Uploading...' : 'Upload Header Image'}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Excerpt / Summary *</label>
          <textarea
            required
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Brief 1-2 sentence overview of the article"
            className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Article Content *</label>
          <textarea
            required
            rows={10}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write the complete article content..."
            className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-4 h-4 text-brand-800 rounded"
          />
          <label htmlFor="published" className="font-bold text-slate-800 text-xs cursor-pointer">
            Publish this article immediately on the website
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/admin/blogs"
            className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-2.5 bg-brand-800 text-white rounded-xl text-xs font-bold hover:bg-brand-900 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save size={15} /> {saving ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
};
