import React, { useState } from 'react';
import { Search, Command } from 'lucide-react';
import { IMAGES } from '@/src/constants';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Discovery() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/feed?q=${encodeURIComponent(search)}`);
    }
  };

  const handleTileClick = (style: string) => {
    navigate(`/feed?style=${encodeURIComponent(style)}`);
  };

  return (
    <div className="px-6 max-w-7xl mx-auto matrix-grid min-h-screen py-8">
      {/* Search Section */}
      <section className="mb-12">
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center bg-surface-container-high border border-outline/30 rounded-full px-6 py-4 focus-within:border-primary transition-all shadow-2xl">
            <Search className="text-primary mr-4" size={20} />
            <input 
              className="bg-transparent border-none focus:ring-0 w-full text-primary tracking-widest uppercase placeholder:text-outline/50" 
              placeholder="QUERY THE MATRIX..." 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2">
              <kbd className="hidden sm:inline-flex items-center justify-center h-8 w-8 rounded border border-outline/30 text-[10px] text-outline font-bold">⌘</kbd>
              <kbd className="hidden sm:inline-flex items-center justify-center h-8 w-8 rounded border border-outline/30 text-[10px] text-outline font-bold">K</kbd>
            </div>
          </div>
        </form>
      </section>

      {/* Bento Grid Discovery */}
      <section className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-[180px] gap-4">
        {/* Featured: Photography Styles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => handleTileClick('Neon Noir')}
          className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden glass-card group cursor-pointer border-primary/40"
        >
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
            src={IMAGES.NEON_NOIR} 
            alt="Neon Noir"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-2 block">Core Protocol</span>
            <h3 className="text-2xl font-extrabold text-on-background tracking-tighter uppercase">Neon Noir Style</h3>
            <p className="text-sm text-on-surface-variant mt-1">Advanced low-light synthesis.</p>
          </div>
        </motion.div>

        {/* Tile: Equipment */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => handleTileClick('Gear')}
          className="md:col-span-2 relative rounded-xl overflow-hidden glass-card group cursor-pointer hover:border-primary/60 transition-all"
        >
          <div className="p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="text-primary-dim text-3xl">⚙️</div>
              <span className="text-[10px] text-tertiary font-bold px-2 py-1 bg-tertiary/10 rounded">NEW</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-background uppercase tracking-tight">Anamorphic Gear</h3>
              <p className="text-xs text-outline">Lens mapping & calibration.</p>
            </div>
          </div>
        </motion.div>

        {/* Tile: Location */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => handleTileClick('Sector 7')}
          className="md:col-span-2 relative rounded-xl overflow-hidden glass-card group cursor-pointer"
        >
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" 
            src={IMAGES.SECTOR_7} 
            alt="Sector 7"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="text-primary mb-2 block">📍</div>
              <h3 className="text-sm font-bold uppercase tracking-widest">Sector 7 Cities</h3>
            </div>
          </div>
        </motion.div>

        {/* Tile: Macro Matrix */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => handleTileClick('Macro')}
          className="md:col-span-1 relative rounded-xl overflow-hidden glass-card border-green-500/20 group cursor-pointer hover:shadow-[0_0_20px_rgba(119,241,108,0.2)]"
        >
          <div className="p-4 flex flex-col items-center justify-center h-full text-center">
            <div className="text-primary mb-2">🌀</div>
            <span className="text-xs font-bold uppercase">Macro</span>
          </div>
        </motion.div>

        {/* Tile: Portrait */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => handleTileClick('Portrait')}
          className="md:col-span-1 relative rounded-xl overflow-hidden glass-card group cursor-pointer"
        >
          <div className="p-4 flex flex-col items-center justify-center h-full text-center">
            <div className="text-primary mb-2">👤</div>
            <span className="text-xs font-bold uppercase">Portrait</span>
          </div>
        </motion.div>

        {/* Tile: Architectural */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => handleTileClick('Architecture')}
          className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden glass-card group cursor-pointer"
        >
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-30" 
            src={IMAGES.CYBER_ARCH} 
            alt="Cyber Architecture"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/20 transition-all"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <h3 className="text-xl font-black uppercase text-primary">Cyber Architecture</h3>
            <p className="text-xs text-on-surface-variant font-medium">Geometric perfection in the void.</p>
          </div>
        </motion.div>

        {/* Tile: Drone */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => handleTileClick('Aerial')}
          className="md:col-span-2 relative rounded-xl overflow-hidden bg-primary/10 border border-primary/20 group cursor-pointer"
        >
          <div className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <div className="text-primary">🚀</div>
            </div>
            <div>
              <h3 className="font-bold uppercase text-on-background">Aerial Recon</h3>
              <p className="text-xs text-outline">Sat-link photography nodes.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trending Tags */}
      <section className="mt-12">
        <h4 className="text-xs font-bold text-outline tracking-widest uppercase mb-6 flex items-center gap-2">
          <span className="h-px w-8 bg-outline/30"></span> Active Streams
        </h4>
        <div className="flex flex-wrap gap-3">
          {['#QUANTUM_FILM', '#NEURAL_ISO', '#VOID_CHROMA', '#LASER_FOCAL', '#MATRIX_REVEAL'].map((tag, i) => (
            <button 
              key={tag} 
              onClick={() => handleTileClick(tag)}
              className={cn(
                "px-4 py-2 rounded-full border text-[10px] font-bold uppercase transition-all",
                i === 0 ? "border-primary/30 text-primary hover:bg-primary/10" : "border-outline/30 text-on-surface-variant hover:border-primary/50"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
