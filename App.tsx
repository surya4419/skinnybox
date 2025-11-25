import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, AppTarget, Commitment } from './types';
import { generateSalt, hashCommitment } from './services/cryptoService';
import { generateCurse } from './services/geminiService';
import { GlitchEffect } from './components/GlitchEffect';
import { Coffin } from './components/Coffin';
import { AppDraggable } from './components/AppDraggable';

// --- Icons ---
import { Skull, Lock, Zap, RefreshCw, Smartphone } from 'lucide-react';

const MOCK_APPS: AppTarget[] = [
  { id: 'insta', name: 'Instagram', icon: '📸', type: 'SOCIAL' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', type: 'SOCIAL' },
  { id: 'reddit', name: 'Reddit', icon: '👽', type: 'SOCIAL' },
  { id: 'twitter', name: 'X / Twitter', icon: '🐦', type: 'SOCIAL' },
];

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [lastCommitment, setLastCommitment] = useState<Commitment | null>(null);
  
  // Ritual State
  const [isCoffinOpen, setIsCoffinOpen] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [burialStatus, setBurialStatus] = useState<'IDLE' | 'BURYING' | 'DONE'>('IDLE');
  
  // Glitch State
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchText, setGlitchText] = useState("NOT. YET.");

  // Init
  useEffect(() => {
    const saved = localStorage.getItem('skinnerbox_commitments');
    if (saved) {
      setCommitments(JSON.parse(saved));
    }
  }, []);

  const saveCommitments = (newCommitments: Commitment[]) => {
    setCommitments(newCommitments);
    localStorage.setItem('skinnerbox_commitments', JSON.stringify(newCommitments));
  };

  const handleBurial = async (appId: string) => {
    setBurialStatus('BURYING');
    setIsCoffinOpen(false); // Slam shut
    
    // Horror Sound trigger (conceptual)
    // Audio.play('coffin_slam');

    const app = MOCK_APPS.find(a => a.id === appId);
    if (!app) return;

    const salt = generateSalt();
    const createdAt = Date.now();
    // For demo purposes, 1 minute instead of days if needed, but let's stick to prompt logic
    const expiryAt = createdAt + (selectedDuration * 24 * 60 * 60 * 1000); 
    
    const hash = await hashCommitment(appId, expiryAt, salt);
    
    // Generate AI Curse
    const epitaph = await generateCurse(app.name, selectedDuration);

    const newCommitment: Commitment = {
      id: crypto.randomUUID(),
      targetId: appId,
      targetName: app.name,
      salt,
      hash,
      createdAt,
      expiryAt,
      epitaph,
      isBuried: true
    };

    setTimeout(() => {
      saveCommitments([...commitments, newCommitment]);
      setLastCommitment(newCommitment);
      setBurialStatus('DONE');
      setView(ViewState.CERTIFICATE);
    }, 2000); // 2s delay for animation/suspense
  };

  const attemptOpen = (commitment: Commitment) => {
    const now = Date.now();
    if (now < commitment.expiryAt) {
      setGlitchText(Math.random() > 0.5 ? "NOT. YET." : "IT BURNS.");
      setGlitchActive(true);
    } else {
      // Unbury logic
      const updated = commitments.map(c => c.id === commitment.id ? { ...c, isBuried: false } : c);
      saveCommitments(updated);
    }
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString() + ' ' + new Date(ts).toLocaleTimeString();

  // --- Views ---

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center z-10 relative">
      <h1 className="text-6xl md:text-8xl font-horror text-red-600 mb-4 tracking-tighter shadow-red-900 drop-shadow-lg">
        SkinnerBox
      </h1>
      <p className="font-typewriter text-neutral-400 max-w-md mb-8 text-sm md:text-base leading-relaxed">
        We offer a burial service for your digital addictions. 
        Cryptographically sealed. Psychologically binding.
        <br/><br/>
        <span className="text-red-500">Warning: Contains flashing lights and sudden noises.</span>
      </p>
      
      <button 
        onClick={() => setView(ViewState.DASHBOARD)}
        className="group relative px-8 py-4 bg-transparent border border-neutral-600 hover:border-red-600 transition-colors duration-300"
      >
        <span className="font-typewriter text-xl tracking-widest group-hover:text-red-500">ENTER THE TOMB</span>
        <div className="absolute inset-0 bg-red-900/10 scale-0 group-hover:scale-100 transition-transform origin-bottom duration-300"></div>
      </button>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen p-8 pt-20 max-w-4xl mx-auto z-10 relative">
      <div className="flex justify-between items-end mb-12 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-4xl font-horror text-neutral-200">Graveyard</h2>
          <p className="font-typewriter text-xs text-neutral-500 mt-2">Active Burials: {commitments.filter(c => c.isBuried).length}</p>
        </div>
        <button 
          onClick={() => {
            setIsCoffinOpen(true);
            setBurialStatus('IDLE');
            setView(ViewState.RITUAL);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-700 hover:border-red-600 hover:text-red-500 transition-all font-typewriter text-sm"
        >
          <Skull size={16} /> NEW BURIAL
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {commitments.length === 0 && (
          <div className="col-span-full text-center py-20 text-neutral-600 font-typewriter opacity-50 border border-dashed border-neutral-800 rounded-lg">
            No souls trapped yet.
          </div>
        )}
        
        {commitments.map(c => (
          <div 
            key={c.id} 
            onClick={() => attemptOpen(c)}
            className={`
              relative p-6 border bg-black transition-all cursor-pointer group overflow-hidden
              ${c.isBuried ? 'border-neutral-800 hover:border-red-900' : 'border-neutral-700 opacity-50'}
            `}
          >
            {c.isBuried && (
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 pointer-events-none"></div>
            )}
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="font-typewriter text-xl text-neutral-300">{c.targetName}</h3>
              {c.isBuried ? <Lock size={18} className="text-red-700" /> : <span className="text-green-700 text-xs border border-green-900 px-1">EXHUMED</span>}
            </div>
            
            <p className="font-serif italic text-neutral-500 text-sm mb-4 leading-relaxed line-clamp-2">
              "{c.epitaph}"
            </p>

            <div className="flex justify-between items-center border-t border-neutral-900 pt-3 mt-auto">
               <span className="font-typewriter text-[10px] text-neutral-600 uppercase tracking-wider">
                 Opens: {new Date(c.expiryAt).toLocaleDateString()}
               </span>
               <span className="font-mono text-[10px] text-neutral-700 truncate w-24 opacity-50">
                 {c.hash.substring(0, 8)}...
               </span>
            </div>
            
            {/* Hover Glitch Effect overlay for card */}
            {c.isBuried && (
                <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/10 transition-colors z-0"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderRitual = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 z-10 relative overflow-hidden">
        {/* Back Button */}
        <button 
            onClick={() => setView(ViewState.DASHBOARD)}
            className="absolute top-8 left-8 text-neutral-500 hover:text-white font-typewriter text-xs z-50"
        >
            &lt; ESCAPE
        </button>

      {burialStatus === 'BURYING' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
             <div className="text-center">
                 <h2 className="text-4xl font-horror text-red-600 animate-pulse">SEALING FATE...</h2>
                 <p className="mt-4 font-typewriter text-neutral-500 text-sm">Encrypting commitment hash...</p>
             </div>
        </div>
      )}

      <div className="mb-8 text-center space-y-2">
        <h2 className="text-2xl font-horror text-neutral-300">The Ritual</h2>
        <p className="font-typewriter text-xs text-neutral-500">Drag the habit into the void.</p>
      </div>

      <div className="relative mb-12">
        <Coffin onDrop={handleBurial} isOpen={isCoffinOpen} />
      </div>

      {isCoffinOpen && (
        <div className="w-full max-w-md bg-neutral-900/50 border border-neutral-800 p-6 rounded-lg backdrop-blur-sm">
            <div className="mb-6">
                <label className="block font-typewriter text-xs text-neutral-400 mb-2">PENANCE DURATION</label>
                <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={selectedDuration} 
                    onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                    className="w-full accent-red-700 h-1 bg-neutral-700 appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 font-mono text-red-500 text-sm">
                    <span>{selectedDuration} DAYS</span>
                    <span className="opacity-50 text-[10px]">{selectedDuration * 24} HOURS</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {MOCK_APPS.map(app => (
                    <AppDraggable key={app.id} app={app} />
                ))}
            </div>
        </div>
      )}
    </div>
  );

  const renderCertificate = () => {
    if (!lastCommitment) return null;
    return (
      <div className="min-h-screen flex items-center justify-center p-4 z-10 relative bg-neutral-950">
        <div className="w-full max-w-lg bg-[#e0e0e0] text-black p-8 shadow-[0_0_100px_rgba(255,255,255,0.1)] relative transform rotate-1">
          {/* Paper Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-50 pointer-events-none"></div>
          
          <div className="border-4 border-double border-black h-full p-6 relative z-10">
            <div className="text-center border-b-2 border-black pb-6 mb-6">
              <h2 className="font-horror text-5xl mb-2">CERTIFICATE OF BURIAL</h2>
              <p className="font-typewriter text-xs tracking-widest uppercase">SkinnerBox Necrology Dept.</p>
            </div>

            <div className="space-y-6 font-typewriter">
              <div className="flex justify-between items-end border-b border-black/20 pb-2">
                <span className="text-sm font-bold">DECEASED:</span>
                <span className="text-xl">{lastCommitment.targetName}</span>
              </div>
              
              <div className="flex justify-between items-end border-b border-black/20 pb-2">
                <span className="text-sm font-bold">TIME OF DEATH:</span>
                <span className="text-sm">{formatDate(lastCommitment.createdAt)}</span>
              </div>

              <div className="flex justify-between items-end border-b border-black/20 pb-2">
                <span className="text-sm font-bold">RESURRECTION:</span>
                <span className="text-sm">{formatDate(lastCommitment.expiryAt)}</span>
              </div>

              <div className="my-8 p-4 bg-black text-white italic text-center font-serif border-l-4 border-red-600">
                "{lastCommitment.epitaph}"
              </div>

              <div className="text-[10px] break-all font-mono opacity-60">
                COMMITMENT_HASH: {lastCommitment.hash}
              </div>
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => setView(ViewState.DASHBOARD)}
                className="px-6 py-2 bg-black text-white font-typewriter hover:bg-red-700 transition-colors"
              >
                ACKNOWLEDGE FATE
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <GlitchEffect isActive={glitchActive} onDismiss={() => setGlitchActive(false)} text={glitchText} />
      
      <main className="relative min-h-screen">
        {view === ViewState.LANDING && renderLanding()}
        {view === ViewState.DASHBOARD && renderDashboard()}
        {view === ViewState.RITUAL && renderRitual()}
        {view === ViewState.CERTIFICATE && renderCertificate()}
      </main>
    </>
  );
}
