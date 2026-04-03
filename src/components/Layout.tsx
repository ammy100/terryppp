import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Image as ImageIcon, Box, Search, User, Bell } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800 flex justify-between items-center px-6 h-16">
          <NavLink to="/" className="flex items-center gap-4 group">
            <LayoutGrid className="text-primary cursor-pointer active:scale-95 duration-200 group-hover:rotate-90 transition-transform" size={24} />
            <h1 className="text-xl font-bold tracking-tighter text-primary uppercase font-sans">Smurkhub</h1>
          </NavLink>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8 text-stone-400 text-sm tracking-widest uppercase">
            <NavLink to="/feed" className={({ isActive }) => cn("hover:text-primary transition-colors", isActive && "text-primary")}>Feed</NavLink>
            <NavLink to="/gallery" className={({ isActive }) => cn("hover:text-primary transition-colors", isActive && "text-primary")}>Gallery</NavLink>
            <NavLink to="/" className={({ isActive }) => cn("hover:text-primary transition-colors", isActive && "text-primary")}>Discovery</NavLink>
            <NavLink to="/studio" className={({ isActive }) => cn("hover:text-primary transition-colors", isActive && "text-primary")}>Studio</NavLink>
          </nav>
          <button 
            onClick={() => alert("No new notifications in the matrix.")}
            className="text-primary cursor-pointer active:scale-95 duration-200 hover:bg-primary/10 p-2 rounded-full transition-colors"
          >
            <Bell size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-24">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-4 pb-4 bg-stone-950/90 backdrop-blur-xl border-t border-stone-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] rounded-t-lg z-50">
        <NavButton to="/feed" icon={<ImageIcon size={24} />} label="Feed" />
        <NavButton to="/gallery" icon={<Box size={24} />} label="Gallery" />
        <NavButton to="/studio" icon={<LayoutGrid size={24} />} label="Studio" />
        <NavButton to="/" icon={<Search size={24} />} label="Discovery" />
        <NavButton to="/studio" icon={<User size={24} />} label="Profile" />
      </nav>
    </div>
  );
}

function NavButton({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex flex-col items-center justify-center text-stone-500 hover:text-white transition-all active:translate-y-0.5 duration-150 px-3 py-1 rounded-xl",
        isActive && "bg-primary/10 text-primary"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tighter mt-1">{label}</span>
    </NavLink>
  );
}
