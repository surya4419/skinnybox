import React, { useEffect, useState } from 'react';

interface GlitchEffectProps {
  isActive: boolean;
  onDismiss?: () => void;
  intensity?: 'low' | 'high';
  text?: string;
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({ isActive, onDismiss, intensity = 'high', text = "NOT. YET." }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setVisible(true);
      // If high intensity, it might persist until explicit dismiss, 
      // but for UX safety we auto-dismiss after a few seconds unless it's a "Death" screen
      if (intensity === 'low') {
        const timer = setTimeout(() => {
          setVisible(false);
          onDismiss?.();
        }, 800);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [isActive, intensity, onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden pointer-events-auto cursor-not-allowed">
      {/* Background Strobe */}
      <div className="absolute inset-0 bg-white opacity-10 animate-pulse mix-blend-difference"></div>
      
      {/* Distortion Layers */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-50 pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
            <div 
                key={i} 
                className="h-2 bg-red-600 w-full transform translate-x-4 mix-blend-overlay"
                style={{
                    marginTop: `${Math.random() * 100}vh`,
                    animation: `glitch-anim 0.${Math.floor(Math.random() * 9) + 1}s infinite reverse`
                }}
            />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-9xl font-horror text-red-600 tracking-widest animate-bounce opacity-90 relative">
          {text}
          <span className="absolute top-0 left-1 text-blue-500 opacity-50 mix-blend-screen animate-pulse">{text}</span>
          <span className="absolute top-0 -left-1 text-green-500 opacity-50 mix-blend-screen animate-pulse" style={{animationDelay: '0.1s'}}>{text}</span>
        </h1>
        <p className="mt-8 font-typewriter text-xl text-neutral-400">
            {intensity === 'high' ? "THE PACT IS SEALED." : "DO NOT DISTURB THE DEAD."}
        </p>
      </div>
      
      {/* Interactive blocker */}
      <div 
        className="absolute inset-0"
        onClick={() => {
            if (intensity === 'low') onDismiss?.();
        }}
      />
    </div>
  );
};
