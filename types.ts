export interface RootMapping {
  key: string;
  root: string;
  mnemonic?: string; // e.g. "日" for A
}

export interface WordEntry {
  char: string;
  code: string;
  category: string;
  hint?: string; // e.g., "頭+尾" breakdown
}

export type GameMode = 'MENU' | 'REFERENCE' | 'GAME_ROOTS' | 'GAME_WORDS' | 'PRACTICE' | 'GAME_OVER';

export type MonsterType = 'SLIME' | 'BAT' | 'GHOST' | 'BOSS';

export interface FallingItem {
  id: number;
  word: WordEntry | RootMapping;
  x: number; // percentage 0-90
  y: number; // percentage 0-100
  speed: number;
  monsterType: MonsterType;
  maxHp: number; // 1 for roots, 2 for words usually
  currentHp: number; // Decreases as user types correct keys
  isTargeted: boolean; // Is the player currently locked onto this monster?
  isHit?: boolean; // For death animation state
}

export interface Projectile {
  id: number;
  startX: number;
  startY: number;
  targetId: number;
  progress: number; // 0 to 1
  type: 'SMALL' | 'BIG';
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  life: number;
}

export enum Difficulty {
  EASY = 'EASY',     // Slower, basic roots/words
  MEDIUM = 'MEDIUM', // Normal speed, sentences
  HARD = 'HARD'      // Fast, special chars
}