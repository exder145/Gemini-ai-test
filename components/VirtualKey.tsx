
import React from 'react';
import { KeyDefinition } from '../types';

interface VirtualKeyProps {
  def: KeyDefinition;
  isActive: boolean;
}

export const VirtualKey: React.FC<VirtualKeyProps> = ({ def, isActive }) => {
  const baseWidth = 3; // rem equivalent unit
  const widthStyle = def.width ? `${def.width * baseWidth}rem` : `${baseWidth}rem`;
  
  // Dynamic styling for active state
  const activeClasses = isActive 
    ? "transform translate-y-1 shadow-[0_0_20px_#ff00ff] border-[#ff00ff] text-[#ff00ff] bg-[#ff00ff]/20" 
    : "shadow-[0_6px_0_#004d52] border-[#00f3ff]/50 text-[#00f3ff] bg-[#00151a] hover:border-[#00f3ff] hover:shadow-[0_0_10px_#00f3ff]";

  return (
    <div
      className={`
        relative h-14 rounded-sm border-2 border-b-[6px]
        flex items-center justify-center select-none transition-all duration-50
        ${activeClasses}
      `}
      style={{ 
        width: widthStyle,
        margin: '0.2rem'
      }}
    >
      {/* Key Label */}
      <span className={`z-10 ${def.type === 'special' ? 'text-lg' : 'text-2xl'} font-bold`}>
        {def.label}
      </span>

      {/* Aesthetic Grid Overlay for inactive keys */}
      {!isActive && (
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(0deg,transparent_24%,rgba(0,243,255,0.3)_25%,rgba(0,243,255,0.3)_26%,transparent_27%,transparent_74%,rgba(0,243,255,0.3)_75%,rgba(0,243,255,0.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(0,243,255,0.3)_25%,rgba(0,243,255,0.3)_26%,transparent_27%,transparent_74%,rgba(0,243,255,0.3)_75%,rgba(0,243,255,0.3)_76%,transparent_77%,transparent)] bg-[length:4px_4px]"></div>
      )}
    </div>
  );
};
