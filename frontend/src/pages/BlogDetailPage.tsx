import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { blogService } from '../services/blogService.js';
import { Blog } from '../types/index.js';
import { getImageUrl } from '../utils/imageUrl.js';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      try {
        const data = await blogService.getBlogBySlug(slug);
        setBlog(data);
      } catch (err) {
        console.error('Failed to load blog post', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading wellness article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Article Not Found</h2>
        <p className="text-gray-500 mb-6">The blog post you requested could not be located.</p>
        <Link to="/blog" className="px-6 py-3 bg-brand-800 text-white rounded-xl font-bold hover:bg-brand-900 transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-cream min-h-screen py-10 animate-fade-in">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-brand-900 mb-8"
        >
          <ArrowLeft size={16} /> Back to all articles
        </Link>

        {/* Main Article Container */}
        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1.5 text-brand-700 font-semibold">
              <Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <User size={14} /> {blog.author}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <p className="text-lg text-gray-600 font-medium mb-8 leading-relaxed italic border-l-4 border-brand-700 pl-4 bg-brand-50/50 py-2 rounded-r-lg">
            "{blog.excerpt}"
          </p>

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
              <img
                src={getImageUrl(blog.featuredImage)}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/blog-wellness.png';
                }}
              />
            </div>
          )}

          {/* Content Body */}
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-base md:text-lg whitespace-pre-line font-sans">
            {blog.content}
          </div>

          {/* Author Footnote & Share */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Written by</p>
              <p className="text-base font-bold text-gray-900">{blog.author}</p>
            </div>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: blog.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Article link copied to clipboard!');
                }
              }}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand-800 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Share2 size={16} /> Share Article
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
