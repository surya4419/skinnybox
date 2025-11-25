import React, { useState } from 'react';

interface CoffinProps {
  onDrop: (data: string) => void;
  isOpen: boolean;
}

export const Coffin: React.FC<CoffinProps> = ({ onDrop, isOpen }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const data = e.dataTransfer.getData("appId");
    if (data) {
      onDrop(data);
    }
  };

  return (
    <div 
      className={`relative w-64 h-96 transition-all duration-700 ease-in-out transform ${isOver ? 'scale-105' : 'scale-100'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Coffin Shape */}
      <div className={`
        absolute inset-0 border-4 border-neutral-800 bg-neutral-950 
        clip-path-coffin flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)]
        ${isOver ? 'border-red-900 shadow-[0_0_80px_rgba(220,38,38,0.3)]' : ''}
      `}
      style={{
        clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 85% 100%, 15% 100%, 0% 20%)'
      }}
      >
        <div className="text-center p-4 pointer-events-none select-none">
          {isOpen ? (
            <div className="space-y-4 opacity-50">
              <div className="w-full h-48 bg-black/50 border border-neutral-800 rounded-sm flex items-center justify-center">
                 <span className="font-typewriter text-xs text-neutral-600">VOID</span>
              </div>
              <p className="font-horror text-2xl text-red-800 tracking-wider">
                {isOver ? "RELEASE IT" : "DRAG HERE"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 border-2 border-neutral-800 rounded-full flex items-center justify-center mb-4">
                <div className="w-12 h-1 bg-neutral-800 rotate-45 absolute"></div>
                <div className="w-12 h-1 bg-neutral-800 -rotate-45 absolute"></div>
              </div>
              <p className="font-typewriter text-neutral-500 text-sm">SEALED</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Coffin Lid Animation Overlay */}
      <div 
        className={`
          absolute inset-0 bg-neutral-900 border-4 border-neutral-700
          transition-all duration-1000 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] z-20
        `}
        style={{
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 85% 100%, 15% 100%, 0% 20%)',
            transform: isOpen ? 'translateY(-100%) rotateX(60deg) scale(0.9) opacity-0' : 'translateY(0) rotateX(0deg) scale(1) opacity-100',
            transformOrigin: 'bottom center'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
           <span className="font-horror text-6xl text-black opacity-20">RIP</span>
        </div>
        {/* Wood Texture CSS */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
      </div>

    </div>
  );
};
