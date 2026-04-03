import React, { useState } from 'react';
import { IMAGES } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Maximize2, ArrowRight, X } from 'lucide-react';

const EXHIBITS = [
  {
    id: 1,
    title: "NEURAL_FLUX // 01",
    tag: "Featured Matrix",
    desc: "An exploration of kinetic data streams visualized through procedural generative algorithms.",
    img: IMAGES.NEURAL_FLUX,
    secondary: [IMAGES.GALLERY_ITEM_1, IMAGES.GALLERY_ITEM_2]
  },
  {
    id: 2,
    title: "VOID_CITY // 02",
    tag: "Urban Protocol",
    desc: "Silent urban spaces captured in the dead of the digital night.",
    img: IMAGES.VOID_CITY,
    secondary: [IMAGES.BRUTALIST, IMAGES.CITY_TRAFFIC]
  },
  {
    id: 3,
    title: "CHLOROPHYLL // 03",
    tag: "Bio-Neural",
    desc: "Visualizing the electrical signals within forest networks.",
    img: IMAGES.CHLOROPHYLL,
    secondary: [IMAGES.SMOKE, IMAGES.FLUID_WAVES]
  }
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const activeExhibit = EXHIBITS[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % EXHIBITS.length);
  };

  return (
    <div className="min-h-screen overflow-hidden flex flex-col">
      <section className="h-[calc(100vh-144px)] relative flex items-center justify-center overflow-hidden">
        {/* 3D Perspective Background */}
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            src={IMAGES.GALLERY_BG} 
            alt="Gallery Background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
        </div>

        {/* Virtual Displays */}
        <div className="relative z-10 w-full max-w-7xl px-6 grid grid-cols-12 gap-8 items-center">
          {/* Active Exhibit */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeExhibit.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="col-span-12 md:col-span-7 aspect-[4/3] relative group rounded-xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10"
            >
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={activeExhibit.img} 
                alt={activeExhibit.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2 block">{activeExhibit.tag}</span>
                <h2 className="text-3xl font-bold text-white mb-2">{activeExhibit.title}</h2>
                <p className="text-stone-400 text-sm max-w-md">{activeExhibit.desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Secondary Displays Stack */}
          <div className="hidden md:flex col-span-5 flex-col gap-6">
            {activeExhibit.secondary.map((img, i) => (
              <motion.div 
                key={`${activeExhibit.id}-sec-${i}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="aspect-video relative rounded-lg overflow-hidden border border-white/5 bg-surface-container-high group"
              >
                <img 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                  src={img} 
                  alt={`Secondary ${i}`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-primary text-4xl opacity-0 group-hover:opacity-100 transition-opacity">🌀</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Glowing Floor Markers */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12">
          {EXHIBITS.map((_, i) => (
            <div 
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "rounded-full cursor-pointer transition-all duration-500",
                activeIndex === i 
                  ? "w-6 h-6 bg-primary border-2 border-white/20 shadow-[0_0_15px_#08961b,inset_0_0_10px_#08961b]" 
                  : "w-4 h-4 bg-primary/20 border border-primary shadow-[0_0_15px_#08961b,inset_0_0_10px_#08961b] opacity-50 hover:opacity-100"
              )}
            ></div>
          ))}
        </div>

        {/* UI Overlays */}
        <div className="absolute top-8 right-8 flex flex-col gap-4">
          <button 
            onClick={() => setShowInfo(true)}
            className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-full hover:bg-primary/20 transition-all group"
          >
            <Info className="text-white group-hover:text-primary" size={24} />
          </button>
          <button 
            onClick={() => alert("Fullscreen matrix view engaged.")}
            className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-full hover:bg-primary/20 transition-all group"
          >
            <Maximize2 className="text-white group-hover:text-primary" size={24} />
          </button>
        </div>
      </section>

      {/* Exhibition Progress */}
      <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low border-y border-stone-800">
        <div className="flex items-center gap-4">
          <span className="text-primary font-bold text-sm tracking-tighter">0{activeIndex + 1} / 0{EXHIBITS.length}</span>
          <div className="w-48 h-0.5 bg-stone-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((activeIndex + 1) / EXHIBITS.length) * 100}%` }}
              className="h-full bg-primary"
            ></motion.div>
          </div>
          <span className="text-stone-500 text-[10px] uppercase tracking-[0.2em] font-bold">{activeExhibit.title}</span>
        </div>
        <button 
          onClick={handleNext}
          className="flex items-center gap-2 text-white/70 hover:text-primary text-[10px] font-bold uppercase tracking-widest transition-colors group"
        >
          Next Exhibit <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-surface-container-high border border-outline/20 rounded-3xl p-8 shadow-2xl"
            >
              <button onClick={() => setShowInfo(false)} className="absolute top-4 right-4 p-2 hover:bg-surface-container-highest rounded-full">
                <X size={20} />
              </button>
              <h3 className="text-2xl font-bold text-primary mb-4 uppercase tracking-tighter">Exhibition Protocol</h3>
              <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
                <p>Welcome to the Smurkhub Virtual Gallery. You are currently viewing the <span className="text-primary font-bold">Cybernetic Evolution Series</span>.</p>
                <p>Use the floor markers or the 'Next' button to navigate through different sectors of the matrix.</p>
                <p>Each display is a high-fidelity neural projection of digital art synthesized by our lead architects.</p>
              </div>
              <button 
                onClick={() => setShowInfo(false)}
                className="w-full mt-8 py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest hover:bg-primary-container transition-all"
              >
                Acknowledge
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
