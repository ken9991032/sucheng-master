
import React, { useEffect, useState } from 'react';
import { PixelButton, PixelCard } from './PixelComponents';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sucheng_leaderboard');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Sort by score descending
        parsed.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);
        setEntries(parsed);
      } catch (e) {
        console.error("Failed to parse leaderboard", e);
      }
    }
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 w-full max-w-3xl mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-yellow-400" style={{ textShadow: '3px 3px 0 #000' }}>
          英雄榜
        </h1>
        <PixelButton onClick={onBack} color="secondary" className="px-4 py-2 text-sm">
          返回
        </PixelButton>
      </div>

      <PixelCard className="w-full flex-1 overflow-hidden flex flex-col min-h-0 bg-[#222]">
        <div className="grid grid-cols-12 gap-4 border-b-2 border-white pb-2 mb-4 text-gray-400 text-sm font-bold uppercase tracking-wider">
          <div className="col-span-2 text-center">排名</div>
          <div className="col-span-6">名字</div>
          <div className="col-span-4 text-right">分數</div>
        </div>

        <div className="overflow-y-auto pr-2 space-y-2">
          {entries.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              暫無紀錄。成為第一個傳說吧！
            </div>
          ) : (
            entries.map((entry, index) => (
              <div 
                key={index}
                className={`
                  grid grid-cols-12 gap-4 items-center p-3 rounded
                  ${index === 0 ? 'bg-yellow-900/30 border border-yellow-600' : ''}
                  ${index === 1 ? 'bg-gray-700/30 border border-gray-500' : ''}
                  ${index === 2 ? 'bg-orange-900/30 border border-orange-700' : ''}
                  ${index > 2 ? 'bg-white/5' : ''}
                `}
              >
                <div className="col-span-2 text-center font-bold text-xl font-['Press_Start_2P']">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>
                <div className="col-span-6 font-bold text-lg truncate">
                  {entry.name}
                </div>
                <div className="col-span-4 text-right font-mono text-xl text-blue-300">
                  {entry.score.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </PixelCard>
    </div>
  );
};

export default Leaderboard;
