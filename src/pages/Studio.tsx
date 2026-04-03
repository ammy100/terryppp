import React, { useState, useEffect } from 'react';
import { IMAGES } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, UserPlus, ArrowRight, Bell, Plus, X, Upload, Check, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc, Timestamp } from '../firebase';
import { GoogleGenAI, Type } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function Studio() {
  const [user, setUser] = useState<any>(null);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [flowStep, setFlowStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [newExhibition, setNewExhibition] = useState({
    title: '',
    description: '',
    type: 'Virtual Reality',
    status: 'draft'
  });
  const [uploadedArt, setUploadedArt] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'exhibitions'), where('artistUid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExhibitions(list);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });
    return () => unsubscribe();
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign in error", error);
    }
  };

  const handleSignOut = () => signOut(auth);

  const startFlow = () => {
    setFlowStep(1);
    setIsFlowOpen(true);
    setNewExhibition({ title: '', description: '', type: 'Virtual Reality', status: 'draft' });
    setUploadedArt([]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newArtworks = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      const filePromise = new Promise((resolve) => {
        reader.onload = async (event) => {
          const base64 = event.target?.result as string;
          const base64Data = base64.split(',')[1];
          
          try {
            // Use Gemini to analyze the image
            const model = "gemini-3.1-pro-preview";
            const result = await genAI.models.generateContent({
              model,
              contents: [
                {
                  parts: [
                    { text: "Analyze this artwork. Provide a title, a brief poetic description, and technical metadata (ISO, Aperture, Shutter, Focal Length) if it looks like a photograph. Return as JSON." },
                    { inlineData: { data: base64Data, mimeType: file.type } }
                  ]
                }
              ],
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    metadata: {
                      type: Type.OBJECT,
                      properties: {
                        iso: { type: Type.STRING },
                        aperture: { type: Type.STRING },
                        shutter: { type: Type.STRING },
                        focalLength: { type: Type.STRING }
                      }
                    }
                  },
                  required: ["title", "description"]
                }
              }
            });

            const analysis = JSON.parse(result.text || "{}");
            resolve({
              file,
              preview: base64,
              ...analysis
            });
          } catch (err) {
            console.error("Gemini error", err);
            resolve({
              file,
              preview: base64,
              title: "Untitled Artwork",
              description: "No analysis available."
            });
          }
        };
        reader.readAsDataURL(file);
      });

      newArtworks.push(await filePromise);
    }

    setUploadedArt([...uploadedArt, ...newArtworks]);
    setIsUploading(false);
  };

  const saveExhibition = async () => {
    if (!user) return;
    setIsUploading(true);
    try {
      const exRef = await addDoc(collection(db, 'exhibitions'), {
        ...newExhibition,
        artistUid: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        coverImage: uploadedArt[0]?.preview || IMAGES.NEURAL_DRIFT
      });

      for (const art of uploadedArt) {
        await addDoc(collection(db, `exhibitions/${exRef.id}/artworks`), {
          exhibitionId: exRef.id,
          artistUid: user.uid,
          title: art.title,
          description: art.description,
          imageUrl: art.preview, // In a real app, we'd upload to Storage first
          metadata: art.metadata || {},
          createdAt: Timestamp.now()
        });
      }

      setIsFlowOpen(false);
    } catch (error) {
      console.error("Error saving exhibition", error);
    }
    setIsUploading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="text-primary" size={48} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Artist Studio</h2>
          <p className="text-on-surface-variant">Sign in to manage your virtual exhibitions and showcase your digital masterpieces to the world.</p>
          <button 
            onClick={handleSignIn}
            className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest hover:bg-primary-container transition-all active:scale-95"
          >
            Connect with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 max-w-7xl mx-auto py-8">
      {/* Profile Header Section */}
      <header className="relative mb-12">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-primary/30 p-1 bg-surface-container">
              <img 
                src={user.photoURL || IMAGES.ARTIST_AETHER} 
                alt="Artist Profile" 
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary-container text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">Verified</div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
              <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">{user.displayName}</h2>
              <button onClick={handleSignOut} className="text-xs text-outline hover:text-error transition-colors">Sign Out</button>
            </div>
            <p className="text-on-surface-variant max-w-lg font-light leading-relaxed">
              Synthesizing biological light and urban decay through the lens of ultra-high-definition neural imaging. Resident artist at the Neo-Cortex Collective.
            </p>
          </div>
          <div className="grid grid-cols-2 md:flex gap-4 w-full md:w-auto">
            <StatBox icon={<Eye size={14} />} value="42.8K" label="Views" />
            <StatBox icon={<UserPlus size={14} />} value="12.5K" label="Follows" />
            <button className="glass-card p-4 rounded-xl flex flex-col items-center justify-center min-w-[100px] hover:bg-primary/5 transition-colors relative group">
              <div className="absolute top-4 right-4 w-2 h-2 bg-error rounded-full shadow-[0_0_8px_#ff7351] animate-pulse"></div>
              <div className="text-primary/50 mb-1 group-hover:text-primary transition-colors">
                <Bell size={14} />
              </div>
              <span className="text-2xl font-black text-primary tracking-tighter">3</span>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Alerts</span>
            </button>
          </div>
        </div>
      </header>

      {/* Management Section */}
      <section className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-1">Your Exhibitions</h3>
            <p className="text-on-surface-variant text-xs">Manage your live and draft virtual experiences</p>
          </div>
          <button 
            onClick={startFlow}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95"
          >
            <Plus size={16} /> New Exhibition
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exhibitions.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-outline/20 rounded-2xl">
              <p className="text-outline mb-4">No exhibitions found. Create your first one!</p>
              <button onClick={startFlow} className="text-primary font-bold uppercase text-xs tracking-widest hover:underline">Start Guided Flow</button>
            </div>
          ) : (
            exhibitions.map((ex) => (
              <ExhibitionCard 
                key={ex.id}
                img={ex.coverImage} 
                tag={ex.type} 
                title={ex.title} 
                desc={ex.description || "No description provided."} 
              />
            ))
          )}
        </div>
      </section>

      {/* Guided Flow Modal */}
      <AnimatePresence>
        {isFlowOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFlowOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-container-high border border-outline/20 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-outline/10 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Create Virtual Exhibition</h3>
                  <p className="text-xs text-outline uppercase tracking-widest mt-1">Step {flowStep} of 3</p>
                </div>
                <button onClick={() => setIsFlowOpen(false)} className="p-2 hover:bg-surface-container-highest rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                {flowStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-primary">Exhibition Title</label>
                      <input 
                        value={newExhibition.title}
                        onChange={(e) => setNewExhibition({...newExhibition, title: e.target.value})}
                        className="w-full bg-surface-container-lowest border border-outline/20 rounded-xl px-4 py-3 focus:border-primary focus:ring-0 transition-all"
                        placeholder="e.g. Neon Dreams 2077"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-primary">Description</label>
                      <textarea 
                        value={newExhibition.description}
                        onChange={(e) => setNewExhibition({...newExhibition, description: e.target.value})}
                        className="w-full bg-surface-container-lowest border border-outline/20 rounded-xl px-4 py-3 focus:border-primary focus:ring-0 transition-all h-32 resize-none"
                        placeholder="Tell the story of your exhibition..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-primary">Experience Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Virtual Reality', 'Augmented Reality', 'Physical Gallery'].map((type) => (
                          <button 
                            key={type}
                            onClick={() => setNewExhibition({...newExhibition, type})}
                            className={cn(
                              "px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-tighter transition-all",
                              newExhibition.type === type ? "bg-primary/10 border-primary text-primary" : "border-outline/20 text-outline hover:border-outline/40"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {flowStep === 2 && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-outline/20 rounded-2xl p-8 text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="text-primary" size={32} />
                      </div>
                      <div>
                        <p className="font-bold">Upload Artworks</p>
                        <p className="text-xs text-outline">Gemini will automatically analyze and tag your art.</p>
                      </div>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        className="hidden" 
                        id="art-upload" 
                      />
                      <label 
                        htmlFor="art-upload"
                        className="inline-block px-6 py-3 bg-surface-container-highest rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        Select Files
                      </label>
                    </div>

                    {isUploading && (
                      <div className="flex items-center justify-center gap-3 text-primary">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest">Gemini is analyzing...</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {uploadedArt.map((art, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-outline/20 group">
                          <img src={art.preview} className="w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                            <p className="text-xs font-bold text-primary truncate">{art.title}</p>
                            <p className="text-[10px] text-white/70 line-clamp-2">{art.description}</p>
                          </div>
                          <button 
                            onClick={() => setUploadedArt(uploadedArt.filter((_, idx) => idx !== i))}
                            className="absolute top-2 right-2 p-1 bg-black/40 rounded-full hover:bg-error/20 hover:text-error transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {flowStep === 3 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border border-outline/20">
                        <img src={uploadedArt[0]?.preview || IMAGES.NEURAL_DRIFT} className="w-full h-full object-cover" alt="Cover" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-2xl font-bold tracking-tight">{newExhibition.title || "Untitled Exhibition"}</h4>
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded">{newExhibition.type}</span>
                          <span className="px-2 py-0.5 bg-surface-container-highest text-outline text-[10px] font-bold uppercase rounded">{uploadedArt.length} Artworks</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline/10">
                      <p className="text-sm text-on-surface-variant italic leading-relaxed">"{newExhibition.description || "No description provided."}"</p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-outline">Visibility</p>
                      <div className="flex gap-4">
                        {['draft', 'published'].map((status) => (
                          <button 
                            key={status}
                            onClick={() => setNewExhibition({...newExhibition, status})}
                            className={cn(
                              "flex-1 py-4 rounded-xl border font-bold uppercase text-xs tracking-widest transition-all",
                              newExhibition.status === status ? "bg-primary text-on-primary border-primary" : "border-outline/20 text-outline hover:border-outline/40"
                            )}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-outline/10 flex justify-between items-center bg-surface-container-highest/30">
                <button 
                  onClick={() => setFlowStep(Math.max(1, flowStep - 1))}
                  disabled={flowStep === 1}
                  className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-outline hover:text-on-surface disabled:opacity-0 transition-all"
                >
                  Back
                </button>
                {flowStep < 3 ? (
                  <button 
                    onClick={() => setFlowStep(flowStep + 1)}
                    disabled={flowStep === 1 && !newExhibition.title}
                    className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-primary-container disabled:opacity-50 transition-all"
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    onClick={saveExhibition}
                    disabled={isUploading}
                    className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-primary-container flex items-center gap-2 transition-all"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                    Finalize Exhibition
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center min-w-[100px]">
      <div className="text-primary/50 mb-1">{icon}</div>
      <span className="text-2xl font-black text-primary tracking-tighter">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</span>
    </div>
  );
}

function ExhibitionCard({ img, tag, title, desc, tagColor = "text-primary", tagBg = "bg-primary/10" }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-outline-variant/30"
    >
      <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90"></div>
      <div className="absolute bottom-0 p-6 w-full">
        <span className={`${tagColor} ${tagBg} text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-3 inline-block`}>{tag}</span>
        <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
        <p className="text-on-surface-variant text-xs font-light line-clamp-2">{desc}</p>
      </div>
    </motion.div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
