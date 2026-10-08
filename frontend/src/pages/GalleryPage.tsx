import React from 'react';

export const GalleryPage: React.FC = () => {
  const galleryImages = [
    "/images/hero-bg.png",
    "/images/blog-wellness.png",
    "/images/blog-herbal.png",
    "/images/wellness-banner.png",
    "/images/blog-routine.png",
    "/images/musli-shilajit.png",
  ];

  return (
    <div className="bg-cream min-h-screen animate-fade-in">
      {/* Header Banner */}
      <div
        className="relative text-white py-14 md:py-20 bg-[#0c3c22] bg-cover bg-center bg-no-repeat overflow-hidden shadow-sm"
        style={{ backgroundImage: `url('/images/bannerimg.png')` }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 text-white drop-shadow-md">
            Our Gallery
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-xl mx-auto font-medium drop-shadow-xs">
            Pure. Natural. Authentic.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryImages.map((src, idx) => (
            <div
              key={idx}
              className="break-inside-avoid relative group overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-white"
            >
              <img
                src={src}
                alt={`Gallery image ${idx + 1}`}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/20 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
