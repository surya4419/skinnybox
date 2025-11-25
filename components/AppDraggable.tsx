import React from 'react';
import { AppTarget } from '../types';

interface AppDraggableProps {
  app: AppTarget;
}

export const AppDraggable: React.FC<AppDraggableProps> = ({ app }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("appId", app.id);
    e.dataTransfer.effectAllowed = "move";
    // Create a ghost image if needed, or browser default
  };

  return (
    <div 
      className="flex flex-col items-center cursor-grab active:cursor-grabbing group hover:scale-110 transition-transform duration-200"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-neutral-700 shadow-lg flex items-center justify-center text-3xl group-hover:border-red-500 group-hover:shadow-red-900/20 transition-colors">
        {app.icon}
      </div>
      <span className="mt-2 font-typewriter text-xs text-neutral-400 group-hover:text-red-400">{app.name}</span>
    </div>
  );
};
