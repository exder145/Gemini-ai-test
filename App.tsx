
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import Matter from 'matter-js';
import { KEYBOARD_LAYOUT, TAG_SKINS } from './constants';
import { Message, StickerData, TagSkin } from './types';
import { VirtualKey } from './components/VirtualKey';
import { ScreenDisplay } from './components/ScreenDisplay';
import { Sticker } from './components/Sticker';
import { playKeyClick, playNotification } from './audio';

const App: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [currentInput, setCurrentInput] = useState<string>("");
  const [history, setHistory] = useState<Message[]>([]);
  const [stickers, setStickers] = useState<StickerData[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [draggedStickerId, setDraggedStickerId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  
  // Physics Refs
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderLoopRef = useRef<number | null>(null);
  const mouseConstraintRef = useRef<Matter.Constraint | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Gemini Chat Instance
  const chatSessionRef = useRef<Chat | null>(null);

  // --- Physics Initialization ---
  useEffect(() => {
    // Setup Matter.js
    const Engine = Matter.Engine,
          World = Matter.World,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite;

    const engine = Engine.create();
    engine.gravity.y = 1.5; // Stronger gravity for punchier drops
    engineRef.current = engine;

    // Create Walls
    const width = window.innerWidth;
    const height = window.innerHeight;
    const wallThickness = 500;

    // Floor
    const ground = Bodies.rectangle(width / 2, height + wallThickness/2 - 10, width * 2, wallThickness, { 
      isStatic: true,
      label: 'Ground',
      friction: 1,
      restitution: 0.1
    });
    
    // Walls
    const leftWall = Bodies.rectangle(0 - wallThickness/2, height / 2, wallThickness, height * 3, { isStatic: true });
    const rightWall = Bodies.rectangle(width + wallThickness/2, height / 2, wallThickness, height * 3, { isStatic: true });

    World.add(engine.world, [ground, leftWall, rightWall]);

    // Runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Rendering Loop
    const updateLoop = () => {
        const bodies = Composite.allBodies(engine.world);
        const dynamicBodies = bodies.filter(b => !b.isStatic);
        
        const newStickersData: StickerData[] = dynamicBodies.map(b => {
            const data = (b as any).customData;
            if (data) {
                return {
                    ...data,
                    x: b.position.x,
                    y: b.position.y,
                    rotation: b.angle
                };
            }
            return null;
        }).filter(Boolean) as StickerData[];

        setStickers(newStickersData);
        renderLoopRef.current = requestAnimationFrame(updateLoop);
    };

    renderLoopRef.current = requestAnimationFrame(updateLoop);

    return () => {
        if (runnerRef.current) Runner.stop(runnerRef.current);
        if (engineRef.current) World.clear(engineRef.current.world, false);
        if (renderLoopRef.current) cancelAnimationFrame(renderLoopRef.current);
        Matter.Engine.clear(engine);
    };
  }, []);

  // Helper: Create a random sticker with Physics
  const spawnSticker = useCallback((content: string, type: 'text' | 'emoji' = 'text') => {
    if (!engineRef.current) return;

    const skin = TAG_SKINS[Math.floor(Math.random() * TAG_SKINS.length)];
    const id = Math.random().toString(36).substr(2, 9);
    
    // Spawn position - Center of screen
    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
    const startY = window.innerHeight / 2 - 100; 

    let body: Matter.Body;

    if (type === 'emoji') {
        body = Matter.Bodies.circle(startX, startY, 40, {
            restitution: 0.6, // Bouncy emojis
            friction: 0.1,
            density: 0.05,
            angle: (Math.random() - 0.5),
        });
    } else {
        // Rectangle for text
        const approxWidth = Math.min(Math.max(content.length * 18 + 60, 180), 400); 
        const height = 90; 
        
        body = Matter.Bodies.rectangle(startX, startY, approxWidth, height, {
            restitution: 0.3,
            friction: 0.5,
            density: 0.02, 
            chamfer: { radius: 10 },
            angle: (Math.random() - 0.5) * 0.4,
        });
    }

    // Ejection Force
    Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 25, 
        y: -15 - Math.random() * 10     
    });
    
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3);

    (body as any).customData = {
        id,
        type,
        content,
        skin: type === 'emoji' ? TagSkin.NEON : skin,
    };

    Matter.World.add(engineRef.current.world, body);
  }, []);

  const handleClearStickers = useCallback(() => {
      if (stickers.length === 0 || isClearing) return;
      
      setIsClearing(true);
      playNotification(); // Re-use sound for effect

      // Wait for animation to complete before removing from physics
      setTimeout(() => {
          if (engineRef.current) {
              const bodies = Matter.Composite.allBodies(engineRef.current.world);
              const dynamicBodies = bodies.filter(b => !b.isStatic);
              Matter.World.remove(engineRef.current.world, dynamicBodies);
          }
          setIsClearing(false);
      }, 500); // 0.5s matches animation
  }, [stickers.length, isClearing]);

  const handleClearChat = useCallback(() => {
    setHistory([]);
    playKeyClick();
  }, []);

  // Initialize Chat
  useEffect(() => {
    if (process.env.API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatSessionRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are a playful, mischievous cyberpunk AI. You reply in short, punchy bursts. Split separate thoughts or sentences with the pipe character '||'. Example: 'Haha! || That is wild. || 🚀'. Be concise. Use Emojis freely, they will fall from the screen!",
        },
      });
    }
  }, []);

  const submitMessage = useCallback(async () => {
    if (!currentInput.trim()) return;
    const userInput = currentInput;
    setCurrentInput(""); 

    // User Message
    setHistory(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      text: userInput,
      timestamp: Date.now()
    }]);
    playNotification(); 

    spawnSticker(userInput, 'text');

    if (chatSessionRef.current) {
        setIsAiThinking(true);
        try {
            const response = await chatSessionRef.current.sendMessage({ message: userInput });
            const aiText = response.text;
            
            if (aiText) {
                const parts = aiText.split('||').map(s => s.trim()).filter(s => s.length > 0);
                
                parts.forEach((part, index) => {
                    setTimeout(() => {
                        setHistory(prev => [...prev, {
                            id: Math.random().toString(36).substr(2, 9),
                            role: 'ai',
                            text: part,
                            timestamp: Date.now()
                        }]);
                        playNotification(); 
                        
                        // Enhanced Emoji Extraction
                        const emojiRegex = /\p{Extended_Pictographic}/ug;
                        const emojis = part.match(emojiRegex);
                        if (emojis) {
                            emojis.forEach((emoji, i) => {
                                // Staggered drop for multiple emojis
                                setTimeout(() => spawnSticker(emoji, 'emoji'), i * 150 + 100);
                            });
                        }

                        if (index === parts.length - 1) setIsAiThinking(false);
                    }, index * 1500 + 1000); 
                });
            } else {
                 setIsAiThinking(false);
            }
        } catch (error) {
            console.error("AI Error", error);
            setIsAiThinking(false);
        }
    }
  }, [currentInput, spawnSticker]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const code = e.code;
    playKeyClick(); 
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(code);
      return newSet;
    });

    if (code === 'Tab' || code === 'AltLeft' || code === 'AltRight') {
      e.preventDefault();
    }

    if (code === 'Backspace') {
      setCurrentInput(prev => prev.slice(0, -1));
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      setCurrentInput(prev => prev + e.key);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const code = e.code;
    setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(code);
        return newSet;
    });
    if (code === 'Enter') {
        submitMessage();
    }
  }, [submitMessage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Mouse Drag Handling
  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
      if (isDraggingRef.current && mouseConstraintRef.current && engineRef.current) {
          mouseConstraintRef.current.pointA = { x: e.clientX, y: e.clientY };
      }
  }, []);

  const handleGlobalMouseUp = useCallback(() => {
      if (isDraggingRef.current && engineRef.current) {
          isDraggingRef.current = false;
          setDraggedStickerId(null); // Clear visual drag state
          if (mouseConstraintRef.current) {
              Matter.World.remove(engineRef.current.world, mouseConstraintRef.current);
              mouseConstraintRef.current = null;
          }
      }
  }, []);

  useEffect(() => {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
          window.removeEventListener('mousemove', handleGlobalMouseMove);
          window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  const handleStickerMouseDown = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      if (!engineRef.current) return;

      const bodies = Matter.Composite.allBodies(engineRef.current.world);
      const body = bodies.find(b => (b as any).customData?.id === id);

      if (body) {
          isDraggingRef.current = true;
          setDraggedStickerId(id); // Set visual drag state

          const mouseConstraint = Matter.Constraint.create({
              pointA: { x: e.clientX, y: e.clientY },
              bodyB: body,
              pointB: { x: 0, y: 0 },
              stiffness: 0.1, // Looser for "swinging" feel
              damping: 0.1,
              length: 0,
              render: { visible: false }
          });
          mouseConstraintRef.current = mouseConstraint;
          Matter.World.add(engineRef.current.world, mouseConstraint);
          Matter.Sleeping.set(body, false);
      }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_100%)] overflow-hidden relative font-sans">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none" 
           style={{
             backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(0, 243, 255, 0.05) 2px, transparent 2px)',
             backgroundSize: '50px 50px'
           }}>
      </div>

      {/* Draggable Stickers Layer */}
      <div className="absolute inset-0 z-50 pointer-events-none">
          {stickers.map(sticker => (
              <Sticker 
                  key={sticker.id} 
                  data={sticker} 
                  onMouseDown={handleStickerMouseDown} 
                  isDragging={draggedStickerId === sticker.id}
                  isClearing={isClearing}
              />
          ))}
      </div>

      {/* Main UI Container */}
      <div className="z-30 w-full max-w-5xl flex flex-col gap-6 pointer-events-none px-4">
        
        {/* Header */}
        <div className="w-full flex justify-between items-center border-b-2 border-[#00f3ff]/30 pb-2 pointer-events-auto bg-black/60 backdrop-blur-sm p-4 rounded-lg">
            <div className="flex flex-col">
                <h1 className="text-4xl md:text-6xl text-[#00f3ff] drop-shadow-[0_0_15px_rgba(0,243,255,0.8)] tracking-tighter leading-none">
                    NEO<span className="text-[#ff00ff]">TYPE</span>_2077
                </h1>
                <div className="flex gap-4 text-xs md:text-sm text-gray-500 font-mono mt-1">
                    <span className="hidden md:inline">MEM: 64TB</span>
                    <span className="animate-pulse text-[#00f3ff]">● CONNECTED</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={handleClearChat}
                    className="group relative px-6 py-2 border-2 border-cyan-500/50 bg-cyan-900/10 text-cyan-400 font-cyber text-sm hover:bg-cyan-500 hover:text-white transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10 font-bold">CLEAR CHAT</span>
                    <div className="absolute inset-0 bg-cyan-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
                </button>

                <button 
                    onClick={handleClearStickers}
                    className="group relative px-6 py-2 border-2 border-red-500/50 bg-red-900/10 text-red-400 font-cyber text-sm hover:bg-red-500 hover:text-white transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10 font-bold">PURGE SYSTEM</span>
                    <div className="absolute inset-0 bg-red-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
                </button>
            </div>
        </div>

        {/* Display Screen */}
        <div className="w-full pointer-events-auto">
             <ScreenDisplay history={history} currentInput={currentInput} isAiThinking={isAiThinking} />
        </div>

        {/* Mechanical Keyboard Visualizer */}
        <div className="w-full pointer-events-auto relative p-8 bg-[#111] rounded-xl border-2 border-[#333] shadow-[0_25px_60px_rgba(0,0,0,0.9)] perspective-[1200px]">
            {/* Decorative LEDs */}
            <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-[#222] border-2 border-[#444] flex items-center justify-center"><div className="w-2 h-2 bg-[#00f3ff] rounded-full animate-ping"></div></div>
            <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#222] border-2 border-[#444]"></div>
            
            <div className="flex flex-col items-center gap-2 transform rotate-x-6 scale-[1.02]">
                {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center w-full">
                    {row.map((keyDef) => (
                    <VirtualKey 
                        key={keyDef.code} 
                        def={keyDef} 
                        isActive={activeKeys.has(keyDef.code)} 
                    />
                    ))}
                </div>
                ))}
            </div>
            
            {/* Keyboard Underglow */}
            <div className="absolute -bottom-16 left-20 right-20 h-20 bg-[#00f3ff] blur-[80px] opacity-15"></div>
        </div>
        
        <div className="text-[#555] text-center text-sm font-mono bg-black/60 px-4 py-2 rounded pointer-events-auto self-center border border-[#333]">
             TYPE TO CHAT // DRAG OBJECTS // AI DROPS EMOJIS
        </div>
      </div>
    </div>
  );
};

export default App;
