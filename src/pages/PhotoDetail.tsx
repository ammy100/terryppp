import React, { useState } from 'react';
import { IMAGES } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Sun, Timer, Maximize, FileText, MapPin, Heart, Send, Download, UserPlus, Mail, Fingerprint, X, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function PhotoDetail() {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      // Simple feedback
      console.log("Liked in the matrix.");
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage('');
    setIsTyping(true);

    try {
      const model = "gemini-3.1-pro-preview";
      const chat = genAI.chats.create({
        model,
        config: {
          systemInstruction: "You are VEX_LYRA, a futuristic digital artist specializing in algorithmic generation and neural landscapes. You speak in a slightly technical, poetic, and cybernetic tone. You are discussing your artwork 'NEURAL_DRIFT_04' with a fan."
        }
      });

      const result = await chat.sendMessage({ message: userMsg });
      setChatHistory(prev => [...prev, { role: 'model', text: result.text || "Connection lost in the void." }]);
    } catch (err) {
      console.error("Chat error", err);
      setChatHistory(prev => [...prev, { role: 'model', text: "Neural link failed. Try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto space-y-6 py-8">
      {/* Hero Image Display */}
      <section className="relative w-full aspect-[4/5] md:aspect-video rounded-xl overflow-hidden group">
        <img 
          src={IMAGES.NEURAL_DRIFT} 
          alt="Neural Drift" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-primary mb-2 block uppercase">Current Selection</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-on-background">NEURAL_DRIFT_04</h2>
          </div>
          <button 
            onClick={() => navigate('/gallery')}
            className="bg-primary hover:bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95"
          >
            <Box size={20} />
            VIEW IN GALLERY
          </button>
        </div>
      </section>

      {/* Bento Metadata & Artist Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Technical Specs Grid */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SpecCard icon={<Sun size={24} />} label="Sensitivity" value="ISO 100" />
          <SpecCard icon={<Box size={24} />} label="Aperture" value="f/2.8" />
          <SpecCard icon={<Timer size={24} />} label="Shutter" value="1/500s" />
          <SpecCard icon={<Maximize size={24} />} label="Focal Length" value="35mm" />
          
          <div className="col-span-2 glass-card p-6 rounded-xl flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <FileText className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-[10px] text-outline font-bold uppercase tracking-widest">Format</p>
                <p className="font-bold text-on-background">Lossless 14-bit RAW</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-outline font-bold uppercase tracking-widest">File Size</p>
              <p className="font-bold text-on-background">48.2 MB</p>
            </div>
          </div>

          <div className="col-span-2 glass-card p-6 rounded-xl flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <MapPin className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-[10px] text-outline font-bold uppercase tracking-widest">Origin</p>
                <p className="font-bold text-on-background">Matrix Sector 7G</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-outline font-bold uppercase tracking-widest">Captured</p>
              <p className="font-bold text-on-background">24.08.2077</p>
            </div>
          </div>
        </div>

        {/* Artist Profile Card */}
        <div className="glass-card p-8 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Fingerprint size={120} className="text-primary" />
          </div>
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full border-2 border-primary p-1 mb-6">
              <img 
                src={IMAGES.ARTIST_VEX} 
                alt="Artist" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[10px] text-primary font-bold uppercase tracking-[0.3em] mb-1">Lead Architect</p>
            <h3 className="text-2xl font-extrabold tracking-tighter text-on-background mb-4">VEX_LYRA</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
              Specializing in algorithmic generation and high-contrast neural landscapes. Lyra explores the boundary between digital decay and emergent systems.
            </p>
          </div>
          <div className="space-y-3 relative z-10">
            <button 
              onClick={handleFollow}
              className={cn(
                "w-full py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95",
                isFollowing ? "bg-primary/10 text-primary border border-primary" : "bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed"
              )}
            >
              <UserPlus size={16} /> {isFollowing ? "Following" : "Follow Artist"}
            </button>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-full py-3 border border-outline text-on-surface rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors active:scale-95"
            >
              <Mail size={16} /> Message
            </button>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between glass-card p-4 rounded-xl">
        <div className="flex gap-2">
          <button 
            onClick={handleLike}
            className={cn(
              "p-3 rounded-lg transition-all active:scale-90",
              isLiked ? "bg-primary/20 text-primary" : "bg-surface-container-highest text-primary hover:text-on-background"
            )}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => alert("Link copied to clipboard.")}
            className="p-3 rounded-lg bg-surface-container-highest text-primary hover:text-on-background transition-colors active:scale-90"
          >
            <Send size={20} />
          </button>
          <button 
            onClick={() => alert("Downloading high-res matrix file...")}
            className="p-3 rounded-lg bg-surface-container-highest text-primary hover:text-on-background transition-colors active:scale-90"
          >
            <Download size={20} />
          </button>
        </div>
        <div className="flex gap-2">
          {['#CYBERPUNK', '#ABSTRACT', '#GREEN_CORE'].map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-surface-container-highest border border-outline-variant text-[10px] font-bold text-outline uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Gemini Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-high border border-outline/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]"
            >
              <div className="px-6 py-4 border-b border-outline/10 flex justify-between items-center bg-surface-container-highest/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-primary p-0.5">
                    <img src={IMAGES.ARTIST_VEX} className="w-full h-full object-cover rounded-full" alt="Vex" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">VEX_LYRA</h4>
                    <p className="text-[10px] text-primary uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> Online
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-surface-container-highest rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {chatHistory.length === 0 && (
                  <div className="text-center py-10 space-y-4">
                    <Sparkles className="text-primary mx-auto" size={32} />
                    <p className="text-xs text-outline uppercase tracking-widest">Start a neural link with the artist</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[80%] px-4 py-3 rounded-2xl text-sm",
                      msg.role === 'user' ? "bg-primary text-on-primary rounded-tr-none" : "bg-surface-container-highest border border-outline/10 rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-surface-container-highest border border-outline/10 px-4 py-3 rounded-2xl rounded-tl-none">
                      <Loader2 className="animate-spin text-primary" size={16} />
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-outline/10 bg-surface-container-highest/30">
                <div className="relative">
                  <input 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full bg-surface-container-lowest border border-outline/20 rounded-xl px-4 py-3 pr-12 focus:border-primary focus:ring-0 transition-all text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!chatMessage.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg disabled:opacity-50 transition-all"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpecCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card p-6 rounded-xl flex flex-col justify-between aspect-square sm:aspect-auto">
      <div className="text-primary mb-4">{icon}</div>
      <div>
        <p className="text-[10px] text-outline font-bold uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-bold text-on-background">{value}</p>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
