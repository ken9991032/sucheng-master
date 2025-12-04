
import React from 'react';
import { MonsterType } from '../types';

export const PixelButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'danger';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, color = 'primary', className = '', disabled = false }) => {
  const colors = {
    primary: 'bg-blue-600 hover:bg-blue-500 border-blue-900 text-white shadow-[4px_4px_0_0_#1e3a8a]',
    secondary: 'bg-gray-600 hover:bg-gray-500 border-gray-900 text-white shadow-[4px_4px_0_0_#1f2937]',
    accent: 'bg-yellow-500 hover:bg-yellow-400 border-yellow-800 text-black shadow-[4px_4px_0_0_#854d0e]',
    danger: 'bg-red-600 hover:bg-red-500 border-red-900 text-white shadow-[4px_4px_0_0_#7f1d1d]',
  };

  const activeClass = disabled ? 'opacity-50 cursor-not-allowed' : 'active:translate-y-1 active:shadow-none cursor-pointer';

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`
        px-6 py-3 
        border-2 
        font-bold text-lg 
        transition-all
        font-['Press_Start_2P']
        ${colors[color]} 
        ${activeClass}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const PixelInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}> = ({ value, onChange, placeholder, maxLength = 10, className = '' }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`
        px-4 py-3 
        border-4 border-gray-700
        bg-black text-yellow-400
        font-bold text-lg font-['Press_Start_2P']
        focus:outline-none focus:border-blue-500
        placeholder-gray-600
        ${className}
      `}
    />
  );
};

export const PixelCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
}> = ({ children, className = '', title }) => {
  return (
    <div className={`
      bg-[#2a2a2a] border-4 border-gray-800 
      text-white shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] p-6 
      ${className}
    `}>
      {title && (
        <div className="bg-blue-800 text-white inline-block px-3 py-1 border-2 border-black -mt-10 mb-4 transform -rotate-1 shadow-md">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
};

export const PixelBadge: React.FC<{
  label: string;
  value: string | number;
  color?: string;
}> = ({ label, value, color = 'bg-gray-800' }) => (
  <div className={`flex flex-col items-center border-2 border-black/30 p-2 ${color} text-white rounded shadow-sm`}>
    <span className="text-[10px] uppercase tracking-widest text-white/70 mb-1 font-['Press_Start_2P']">{label}</span>
    <span className="text-lg font-bold font-['DotGothic16']">{value}</span>
  </div>
);

export const BossHealthBar: React.FC<{ current: number, max: number }> = ({ current, max }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div className="w-full max-w-2xl mx-auto mb-4 relative">
      <div className="flex justify-between text-yellow-500 font-bold mb-1 px-1 text-sm">
        <span>BOSS</span>
        <span>{current}/{max}</span>
      </div>
      <div className="h-6 bg-black border-2 border-white relative overflow-hidden">
        <div 
          className="h-full bg-red-600 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
        {/* Striped effect */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:20px_20px] opacity-50"></div>
      </div>
    </div>
  );
};

// --- Game Assets ---

export const PlayerSprite: React.FC<{ action: 'IDLE' | 'ATTACK' }> = ({ action }) => {
  return (
    <svg width="64" height="64" viewBox="0 0 16 16" className={`${action === 'ATTACK' ? 'animate-pulse' : 'animate-bounce'}`} style={{animationDuration: '2s'}}>
      {/* Wizard Hat */}
      <path d="M4 6 L12 6 L8 1 Z" fill="#3b82f6" />
      {/* Face */}
      <rect x="5" y="6" width="6" height="3" fill="#fca5a5" />
      <rect x="6" y="7" width="1" height="1" fill="#000" />
      <rect x="9" y="7" width="1" height="1" fill="#000" />
      {/* Robe */}
      <path d="M4 9 H12 V15 H4 Z" fill="#1e40af" />
      {/* Staff */}
      <rect x="12" y="5" width="1" height="10" fill="#78350f" />
      <rect x="11" y="4" width="3" height="1" fill="#fcd34d" />
      {action === 'ATTACK' && (
        <circle cx="12.5" cy="4.5" r="2" fill="yellow" opacity="0.5" className="animate-ping" />
      )}
    </svg>
  );
};

export const MonsterSprite: React.FC<{ type: MonsterType, isHit: boolean }> = ({ type, isHit }) => {
  const hitClass = isHit ? 'brightness-200 sepia' : '';
  
  switch (type) {
    case 'SLIME':
      return (
        <svg width="48" height="48" viewBox="0 0 16 16" className={`animate-bounce ${hitClass}`} style={{animationDuration: '1.5s'}}>
          <path d="M4 10 Q8 6 12 10 V14 H4 Z" fill="#84cc16" />
          <rect x="6" y="11" width="1" height="1" fill="black" />
          <rect x="9" y="11" width="1" height="1" fill="black" />
        </svg>
      );
    case 'BAT':
      return (
        <svg width="56" height="56" viewBox="0 0 16 16" className={`animate-pulse ${hitClass}`} style={{animationDuration: '0.5s'}}>
          <path d="M2 6 Q5 2 8 6 Q11 2 14 6 L8 12 Z" fill="#581c87" />
          <circle cx="6" cy="7" r="1" fill="red" />
          <circle cx="10" cy="7" r="1" fill="red" />
        </svg>
      );
    case 'GHOST':
      return (
        <svg width="52" height="52" viewBox="0 0 16 16" className={`${hitClass}`}>
          <path d="M4 14 V6 Q8 0 12 6 V14 L10 12 L8 14 L6 12 Z" fill="#e2e8f0" opacity="0.9" />
          <rect x="6" y="7" width="1" height="1" fill="black" />
          <rect x="9" y="7" width="1" height="1" fill="black" />
        </svg>
      );
    case 'BOSS':
      return (
        <svg width="128" height="128" viewBox="0 0 24 24" className={`${hitClass} animate-pulse`} style={{ filter: 'drop-shadow(0px 0px 10px red)' }}>
          <path d="M2 8 L8 2 L16 2 L22 8 V16 L16 22 H8 L2 16 Z" fill="#450a0a" />
          <path d="M6 10 L8 8 L10 10 L8 12 Z" fill="red" />
          <path d="M14 10 L16 8 L18 10 L16 12 Z" fill="red" />
          <path d="M8 16 Q12 20 16 16" stroke="black" strokeWidth="2" fill="none" />
          <rect x="11" y="6" width="2" height="4" fill="#facc15" />
        </svg>
      );
    default:
      return null;
  }
};

export const ProjectileSprite: React.FC<{ type: 'SMALL' | 'BIG' }> = ({ type }) => {
  if (type === 'SMALL') {
    return (
      <div className="w-4 h-4 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-pulse" />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-red-500 shadow-[0_0_20px_#f59e0b] animate-spin" />
  );
};
