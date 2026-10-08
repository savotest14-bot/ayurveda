import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { blogService } from '../services/blogService.js';
import { Blog } from '../types/index.js';
import { getImageUrl } from '../utils/imageUrl.js';

export const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getBlogs();
        setBlogs(data || []);
      } catch (err) {
        console.error('Failed to fetch blogs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="bg-cream min-h-screen animate-fade-in">
      {/* Header Banner */}
      <div
        className="relative text-white py-14 md:py-20 bg-[#0c3c22] bg-cover bg-center bg-no-repeat overflow-hidden shadow-sm"
        style={{ backgroundImage: `url('/images/bannerimg.png')` }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 text-white drop-shadow-md">
            Our Wellness Blog
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-xl mx-auto font-medium drop-shadow-xs">
            Ayurvedic principles, herbal remedies, and mindful living for everyday vitality.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-50">
                  <img
                    src={getImageUrl(blog.featuredImage || '/images/blog-wellness.png')}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/blog-wellness.png';
                    }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-xs text-brand-600 font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <User size={13} /> {blog.author}
                    </span>
                  </div>

                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-2 leading-snug group-hover:text-brand-800 transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  <span className="text-brand-800 font-semibold text-sm inline-flex items-center gap-1.5 mt-auto">
                    Read Article <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
