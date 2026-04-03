import React, { useState, useMemo } from 'react';
import { IMAGES } from '@/src/constants';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const FEED_ITEMS = [
  { id: 1, img: IMAGES.FLUID_WAVES, category: 'Cybernetics', title: 'Neural Overdrive' },
  { id: 2, img: IMAGES.WORKSTATION, category: 'Archive', title: 'Terminal V-09' },
  { id: 3, img: IMAGES.CITY_TRAFFIC, category: 'Kinetic', title: 'Flux Flow' },
  { id: 4, img: IMAGES.CIRCUIT, category: 'Structure', title: 'Micro Logic' },
  { id: 5, img: IMAGES.ROBOT_FACE, category: 'Android', title: 'Echo Unit' },
  { id: 6, img: IMAGES.BRUTALIST, category: 'Vantage', title: 'Monolith IV' },
  { id: 7, img: IMAGES.SMOKE, category: 'Atmospheric', title: 'Plasma Fog' },
  { id: 8, img: IMAGES.MATRIX_GRID, category: 'Matrix', title: 'Array Grid' },
];

const CATEGORIES = ['All', 'Cybernetics', 'Archive', 'Kinetic', 'Structure', 'Android', 'Vantage', 'Atmospheric', 'Matrix'];

export default function Feed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const styleQuery = searchParams.get('style') || '';

  const filteredItems = useMemo(() => {
    return FEED_ITEMS.filter(item => {
      const matchesCategory = currentCategory === 'All' || item.category === currentCategory;
      const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStyle = !styleQuery || item.category.toLowerCase().includes(styleQuery.toLowerCase().replace('#', '')) || item.title.toLowerCase().includes(styleQuery.toLowerCase().replace('#', ''));
      return matchesCategory && matchesSearch && matchesStyle;
    });
  }, [currentCategory, searchQuery, styleQuery]);

  const handleCategoryClick = (cat: string) => {
    setSearchParams({ category: cat });
  };

  return (
    <div className="pt-8 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Category Filters */}
      <div className="flex overflow-x-auto gap-3 pb-8 no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => (
          <button 
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={cn(
              "px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors",
              currentCategory === cat 
                ? "bg-primary text-on-primary" 
                : "bg-surface-container-high text-on-surface-variant border border-outline-variant hover:bg-surface-container-highest"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Filter Info */}
      {(searchQuery || styleQuery || currentCategory !== 'All') && (
        <div className="mb-6 flex items-center gap-4">
          <p className="text-xs text-outline uppercase tracking-widest">
            Filtering by: <span className="text-primary">{searchQuery || styleQuery || currentCategory}</span>
          </p>
          <button 
            onClick={() => setSearchParams({})}
            className="text-[10px] font-bold text-error uppercase tracking-tighter hover:underline"
          >
            Clear Matrix Filter
          </button>
        </div>
      )}

      {/* Staggered Feed Grid */}
      <div className="masonry-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="masonry-item group relative overflow-hidden rounded-xl bg-surface-container"
            >
              <Link to={`/photo/${item.id}`}>
                <img 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" 
                  src={item.img} 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-xs font-bold uppercase tracking-tighter text-primary">{item.category}</span>
                  <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-outline">No matches found in the matrix.</p>
          </div>
        )}
      </div>

      {/* Contextual FAB */}
      <div className="fixed bottom-24 right-6 z-50">
        <button 
          onClick={() => navigate('/studio')}
          className="w-14 h-14 bg-primary text-on-primary rounded-xl shadow-[0_0_20px_rgba(119,241,108,0.3)] flex items-center justify-center active:scale-90 transition-transform duration-200 group relative"
        >
          <span className="text-2xl font-bold">+</span>
          <div className="absolute right-full mr-4 bg-surface-container-high px-3 py-1 rounded border border-outline/20 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            New Exhibition
          </div>
        </button>
      </div>
    </div>
  );
}
