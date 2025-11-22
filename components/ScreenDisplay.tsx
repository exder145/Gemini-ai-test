
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface ScreenDisplayProps {
  history: Message[];
  currentInput: string;
  isAiThinking: boolean;
}

export const ScreenDisplay: React.FC<ScreenDisplayProps> = ({ history, currentInput, isAiThinking }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, currentInput, isAiThinking]);

  return (
    <div className="relative w-full h-[45vh] bg-[#0a0a0a] border-4 border-[#1a1a1a] rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.1)] flex flex-col">
        {/* Screen Bezel Details */}
        <div className="absolute top-0 left-0 p-2 text-lg text-[#00f3ff]/40 font-mono tracking-widest z-30 select-none">SYSTEM_READY</div>
        <div className="absolute top-0 right-0 p-2 text-lg text-[#ff00ff]/40 font-mono z-30 select-none">CONN: SECURE</div>
        
        {/* Scanlines Overlay */}
        <div className="scanlines pointer-events-none z-20"></div>

        {/* Content Area */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            
            {history.map((msg) => {
                const isAi = msg.role === 'ai';
                return (
                    <div 
                        key={msg.id} 
                        className={`flex w-full animate-fade-in-up ${isAi ? 'justify-start' : 'justify-end'}`}
                    >
                        <div className={`flex max-w-[80%] ${isAi ? 'flex-row' : 'flex-row-reverse'} items-end gap-3`}>
                            
                            {/* Avatar */}
                            <div className={`w-10 h-10 shrink-0 border-2 ${isAi ? 'border-[#ff00ff] bg-[#ff00ff]/20' : 'border-[#00f3ff] bg-[#00f3ff]/20'} flex items-center justify-center`}>
                                <span className="text-xl font-bold">{isAi ? 'AI' : 'ME'}</span>
                            </div>

                            {/* Text Bubble */}
                            <div className={`
                                relative px-5 py-3 text-[#e0e0e0] border-2
                                ${isAi 
                                    ? 'bg-[#ff00ff]/10 border-[#ff00ff]/40 rounded-tr-xl rounded-tl-xl rounded-br-xl text-pink-100 shadow-[0_0_10px_rgba(255,0,255,0.2)]' 
                                    : 'bg-[#00f3ff]/10 border-[#00f3ff]/40 rounded-tr-xl rounded-tl-xl rounded-bl-xl text-cyan-100 shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                                }
                            `}>
                                <span className="text-2xl md:text-3xl drop-shadow-sm leading-tight">
                                    {msg.text}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* AI Thinking Indicator */}
            {isAiThinking && (
                <div className="flex justify-start animate-pulse">
                     <div className="flex items-end gap-2">
                        <div className="w-10 h-10 shrink-0 border-2 border-[#ff00ff] bg-[#ff00ff]/20 flex items-center justify-center">
                            <span className="text-xl">AI</span>
                        </div>
                        <div className="bg-[#ff00ff]/5 border-2 border-[#ff00ff]/20 px-4 py-2 text-[#ff00ff] text-xl">
                            TYPING...
                        </div>
                     </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>

        {/* Input Line (Fixed at bottom of screen) */}
        <div className="relative z-10 p-4 bg-[#000]/50 border-t-2 border-[#1a1a1a] backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <span className="text-[#ff00ff] animate-pulse text-2xl">{'>'}</span>
                <span className="text-[#00f3ff] text-3xl font-mono tracking-wider break-all">
                    {currentInput}
                    <span className="inline-block w-4 h-8 bg-[#00f3ff] ml-1 animate-pulse align-middle"></span>
                </span>
            </div>
        </div>

        {/* Glass reflection effect */}
        <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none z-30 mix-blend-overlay"></div>
    </div>
  );
};
