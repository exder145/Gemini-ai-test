import React from 'react';
import { TagData, TagSkin } from '../types';

interface TagProps {
  tag: TagData;
}

export const Tag: React.FC<TagProps> = ({ tag }) => {
  // Base classes
  const baseClasses = "relative px-3 py-1 text-xs font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:scale-110 select-none border";

  // Dynamic styles based on skin
  const getSkinStyles = (skin: TagSkin) => {
    switch (skin) {
      case TagSkin.LEOPARD:
        return {
          className: `${baseClasses} border-yellow-500 text-yellow-900`,
          style: {
            background: `
              radial-gradient(circle at 50% 50%, transparent 60%, #d97706 60%, #d97706 80%, transparent 80%),
              radial-gradient(circle at 20% 20%, #fcd34d 0%, #b45309 100%)
            `,
            backgroundSize: '10px 10px, 100% 100%',
          }
        };
      case TagSkin.POLKA_DOT:
        return {
          className: `${baseClasses} border-pink-500 text-white`,
          style: {
            backgroundColor: '#be185d',
            backgroundImage: 'radial-gradient(#fce7f3 20%, transparent 20%)',
            backgroundSize: '8px 8px',
          }
        };
      case TagSkin.DIAMOND:
        return {
          className: `${baseClasses} border-cyan-400 text-cyan-100`,
          style: {
            backgroundColor: '#0e7490',
            backgroundImage: `linear-gradient(135deg, #06b6d4 25%, transparent 25%), 
                              linear-gradient(225deg, #06b6d4 25%, transparent 25%), 
                              linear-gradient(45deg, #06b6d4 25%, transparent 25%), 
                              linear-gradient(315deg, #06b6d4 25%, transparent 25%)`,
            backgroundPosition: '4px 0, 4px 0, 0 0, 0 0',
            backgroundSize: '8px 8px',
            backgroundRepeat: 'repeat'
          }
        };
      case TagSkin.GLITCH:
        return {
          className: `${baseClasses} border-white text-black bg-white`,
          style: {
            backgroundImage: 'linear-gradient(90deg, transparent 50%, #000 50%)',
            backgroundSize: '4px 100%',
            textShadow: '2px 0 #ff00ff, -2px 0 #00f3ff',
          }
        };
      case TagSkin.NEON:
      default:
        return {
          className: `${baseClasses} border-[#00f3ff] text-[#00f3ff] bg-black shadow-[0_0_10px_#00f3ff]`,
          style: {}
        };
    }
  };

  const { className, style } = getSkinStyles(tag.skin);

  return (
    <span className={className} style={style}>
      <span className="relative z-10 mix-blend-hard-light">{tag.label}</span>
    </span>
  );
};