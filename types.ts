export enum TagSkin {
  LEOPARD = 'LEOPARD',
  POLKA_DOT = 'POLKA_DOT',
  DIAMOND = 'DIAMOND',
  GLITCH = 'GLITCH',
  NEON = 'NEON',
  HOLO = 'HOLO',
  WARNING = 'WARNING',
  BLUEPRINT = 'BLUEPRINT',
  RETRO = 'RETRO',
  PAPER = 'PAPER',
  MATRIX = 'MATRIX',
  CIRCUIT = 'CIRCUIT'
}

export interface TagData {
  label: string;
  skin: TagSkin;
}

export interface StickerData {
  id: string;
  type: 'text' | 'emoji';
  content: string;
  skin: TagSkin;
  x: number;
  y: number;
  rotation: number;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface KeyDefinition {
  label: string;
  code: string; // event.code
  width?: number; // relative width, 1 is standard
  type?: 'standard' | 'special';
}

export type KeyboardRow = KeyDefinition[];