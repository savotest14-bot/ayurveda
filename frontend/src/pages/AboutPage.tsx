import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, CheckCircle, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen animate-fade-in">
      {/* Header Banner */}
      <div
        className="relative text-white py-14 md:py-20 bg-[#0c3c22] bg-cover bg-center bg-no-repeat overflow-hidden shadow-sm"
        style={{ backgroundImage: `url('/images/bannerimg.png')` }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 text-white drop-shadow-md">
            About Varsha Ayurveda
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-xl mx-auto font-medium drop-shadow-xs">
            Bringing the pure, untouched goodness of Ayurveda to your modern lifestyle.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-brand-50 rounded-3xl transform -rotate-3 z-0" />
            <img
              src="/images/wellness-banner.png"
              alt="Ayurvedic Herbs"
              className="relative z-10 w-full h-auto rounded-2xl shadow-xl object-cover aspect-[4/3]"
            />
          </div>

          <div className="space-y-8 text-base text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Leaf className="text-brand-600" size={28} /> Our Philosophy
              </h2>
              <p>
                At Varsha Ayurveda, we believe that nature holds the key to profound health and vitality. Rooted in the ancient science of Ayurveda, our mission is to provide you with natural, authentic, and highly effective wellness solutions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                <CheckCircle className="text-brand-600" size={28} /> Commitment to Quality
              </h2>
              <p>
                We carefully source the finest herbs and natural ingredients, ensuring that every product we create honors traditional methods while meeting modern quality standards. Our formulations are free from harmful chemicals, prioritizing pure herbal goodness.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-brand-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-900 transition-colors shadow-md"
            >
              Explore Our Range <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
