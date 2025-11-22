import React from 'react';
import { StickerData, TagSkin } from '../types';

interface StickerProps {
  data: StickerData;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  isDragging: boolean;
  isClearing: boolean;
}

export const Sticker: React.FC<StickerProps> = ({ data, onMouseDown, isDragging, isClearing }) => {
  const isEmoji = data.type === 'emoji';
  
  // Animation Classes
  const animationClass = isClearing ? 'animate-implode' : 'animate-popup';
  const dragClass = isDragging ? 'scale-110 shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-50' : '';

  // Base layout classes
  const wrapperClasses = `absolute flex items-center justify-center select-none cursor-grab active:cursor-grabbing pointer-events-auto transition-transform duration-100`;
  const contentClasses = `${animationClass} ${dragClass} relative flex items-center justify-center overflow-hidden transition-all duration-200 origin-center will-change-transform`;

  const getSkinStyles = (skin: TagSkin) => {
    if (isEmoji) {
      return {
        className: `${contentClasses} text-8xl drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]`,
        style: {
            width: '100px',
            height: '100px',
        }
      };
    }

    // Base Text Note Styles
    const noteClasses = `${contentClasses} p-6 text-2xl font-bold uppercase tracking-wider border-4 min-w-[180px] max-w-[400px]`;

    switch (skin) {
      case TagSkin.LEOPARD:
        return {
          className: `${noteClasses} border-yellow-900 text-yellow-900 font-sans`,
          style: {
            background: `
              radial-gradient(circle at 50% 50%, transparent 60%, #d97706 60%, #d97706 80%, transparent 80%),
              radial-gradient(circle at 20% 20%, #fcd34d 0%, #b45309 100%)
            `,
            backgroundSize: '30px 30px, 100% 100%',
            boxShadow: '8px 8px 0px rgba(0,0,0,0.4)'
          }
        };
      case TagSkin.POLKA_DOT:
        return {
          className: `${noteClasses} border-pink-600 text-pink-900 rounded-xl font-sans`,
          style: {
            backgroundColor: '#fce7f3',
            backgroundImage: 'radial-gradient(#db2777 15%, transparent 16%)',
            backgroundSize: '20px 20px',
            boxShadow: '6px 6px 0px #be185d'
          }
        };
      case TagSkin.DIAMOND:
        return {
          className: `${noteClasses} border-cyan-300 text-cyan-100 font-sans`,
          style: {
            backgroundColor: '#083344',
            backgroundImage: `linear-gradient(135deg, #06b6d4 25%, transparent 25%), 
                              linear-gradient(225deg, #06b6d4 25%, transparent 25%), 
                              linear-gradient(45deg, #06b6d4 25%, transparent 25%), 
                              linear-gradient(315deg, #06b6d4 25%, transparent 25%)`,
            backgroundPosition: '15px 0, 15px 0, 0 0, 0 0',
            backgroundSize: '30px 30px',
            backgroundRepeat: 'repeat',
            boxShadow: '0 0 20px #06b6d4'
          }
        };
      case TagSkin.GLITCH:
        return {
          className: `${noteClasses} border-white text-black bg-white font-mono`,
          style: {
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)',
            backgroundSize: '100% 100%',
            textShadow: '3px 0 #ff00ff, -3px 0 #00f3ff',
            boxShadow: '8px 8px 0px #ff00ff'
          }
        };
      case TagSkin.HOLO:
        return {
          className: `${noteClasses} border-white/50 text-white font-cyber rounded-lg backdrop-blur-md`,
          style: {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(255,255,255,0.2)',
            textShadow: '0 0 10px rgba(255,255,255,0.8)'
          }
        };
      case TagSkin.WARNING:
        return {
          className: `${noteClasses} border-black text-black font-bold`,
          style: {
             backgroundColor: '#fbbf24',
             backgroundImage: 'repeating-linear-gradient(45deg, #fbbf24, #fbbf24 10px, #000 10px, #000 20px)',
             textShadow: '0px 0px 5px #fff, 0px 0px 10px #fff, 0px 0px 15px #fff', // Outline effect
             boxShadow: '5px 5px 0 #000'
          }
        };
      case TagSkin.BLUEPRINT:
        return {
          className: `${noteClasses} border-blue-300/50 text-blue-100 font-mono`,
          style: {
            backgroundColor: '#1e3a8a',
            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            boxShadow: 'inset 0 0 20px #000'
          }
        };
      case TagSkin.RETRO:
        return {
          className: `${noteClasses} border-yellow-400 text-white italic font-cyber rounded-tl-xl rounded-br-xl`,
          style: {
            background: 'linear-gradient(to bottom, #6366f1, #ec4899, #eab308)',
            boxShadow: '0 10px 20px rgba(236, 72, 153, 0.5)',
            textShadow: '2px 2px 0 #000'
          }
        };
      case TagSkin.PAPER:
        return {
          className: `${noteClasses} border-none text-gray-800 font-serif`,
          style: {
             backgroundColor: '#f3f4f6',
             clipPath: 'polygon(2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%)', // Crude cut
             backgroundImage: 'linear-gradient(90deg, transparent 90%, rgba(0,0,0,0.05) 90%)',
             backgroundSize: '20px 100%',
             filter: 'drop-shadow(5px 5px 5px rgba(0,0,0,0.3))'
          }
        };
      case TagSkin.MATRIX:
        return {
          className: `${noteClasses} border-green-500 text-green-500 font-mono bg-black`,
          style: {
            boxShadow: '0 0 15px #22c55e',
            textShadow: '0 0 5px #22c55e'
          }
        };
      case TagSkin.CIRCUIT:
        return {
          className: `${noteClasses} border-emerald-900 text-emerald-400 font-cyber bg-emerald-950`,
          style: {
             backgroundImage: `radial-gradient(#10b981 15%, transparent 16%), 
                               linear-gradient(0deg, transparent 49%, #064e3b 50%, transparent 51%),
                               linear-gradient(90deg, transparent 49%, #064e3b 50%, transparent 51%)`,
             backgroundSize: '10px 10px, 40px 40px, 40px 40px',
             boxShadow: 'inset 0 0 20px #000, 0 0 10px #064e3b'
          }
        };
      case TagSkin.NEON:
      default:
        return {
          className: `${noteClasses} border-[#00f3ff] text-[#00f3ff] bg-black/90 backdrop-blur-md font-cyber`,
          style: {
            boxShadow: '0 0 20px #00f3ff, inset 0 0 30px rgba(0,243,255,0.2)'
          }
        };
    }
  };

  const { className, style } = getSkinStyles(data.skin);
  
  const outerStyle = {
      left: `${data.x}px`,
      top: `${data.y}px`,
      transform: `translate(-50%, -50%) rotate(${data.rotation}rad)`, 
  };

  return (
    <div 
      style={outerStyle}
      className={wrapperClasses}
      onMouseDown={(e) => onMouseDown(e, data.id)}
    >
        <div className={className} style={style}> 
             {!isEmoji && <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay"></div>}
             <span className="relative z-10 break-words text-center whitespace-normal leading-tight">{data.content}</span>
        </div>
    </div>
  );
};