import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Check, X, BookOpen } from 'lucide-react';
import { adminService } from '../services/adminApi.js';
import { Blog } from '../types/index.js';
import { getImageUrl } from '../utils/imageUrl.js';

export const AdminBlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getBlogs();
      setBlogs(data || []);
    } catch (err) {
      console.error('Failed to load blogs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleTogglePublish = async (blog: Blog) => {
    try {
      await adminService.updateBlog(blog.id, { published: !blog.published });
      setBlogs(prev =>
        prev.map(b => (b.id === blog.id ? { ...b, published: !b.published } : b))
      );
    } catch (err) {
      alert('Failed to update published status');
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Delete article "${title}"?`)) return;
    try {
      await adminService.deleteBlog(id);
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete blog post');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Blog Management</h1>
          <p className="text-xs text-slate-500 mt-1">Publish articles, wellness guides, and Ayurvedic advice.</p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-800 text-white rounded-xl text-xs font-bold hover:bg-brand-900 transition-colors shadow-sm"
        >
          <Plus size={16} /> Write New Article
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading blog posts...</div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No blog posts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Article</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {b.featuredImage ? (
                            <img
                              src={getImageUrl(b.featuredImage)}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                                const fallback = (e.target as HTMLElement).nextElementSibling;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <span className={`text-xs ${b.featuredImage ? 'hidden' : ''}`}>📰</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-sm">{b.title}</span>
                          <span className="text-[11px] text-slate-400 font-mono">/blog/{b.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{b.author}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(b)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          b.published ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {b.published ? <Check size={10} /> : <X size={10} />}
                        {b.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/blogs/${b.id}/edit`}
                          className="p-1.5 text-slate-500 hover:text-brand-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(b.id, b.title)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
