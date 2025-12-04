
import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import GameLoop from './components/GameLoop';
import Reference from './components/Reference';
import PracticeMode from './components/PracticeMode';
import Leaderboard from './components/Leaderboard';
import { PixelButton, PixelCard, PixelInput } from './components/PixelComponents';
import { GameMode, LeaderboardEntry } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameMode>('MENU');
  const [lastScore, setLastScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const handleGameOver = (score: number) => {
    setLastScore(score);
    setScoreSubmitted(false);
    setGameState('GAME_OVER');
  };

  const handleSubmitScore = () => {
    if (!playerName.trim()) return;
    
    const newEntry: LeaderboardEntry = {
      name: playerName.trim(),
      score: lastScore,
      date: new Date().toISOString()
    };

    const saved = localStorage.getItem('sucheng_leaderboard');
    let entries: LeaderboardEntry[] = saved ? JSON.parse(saved) : [];
    entries.push(newEntry);
    
    // Keep top 50 locally
    entries.sort((a, b) => b.score - a.score);
    entries = entries.slice(0, 50);
    
    localStorage.setItem('sucheng_leaderboard', JSON.stringify(entries));
    setScoreSubmitted(true);
    setGameState('LEADERBOARD');
  };

  return (
    <div className="w-screen h-screen bg-[#2d1b2e] overflow-hidden flex flex-col items-center justify-center font-['DotGothic16'] text-white">
      {/* Container to maintain aspect ratio or max width if needed, currently full screen */}
      <div className="w-full h-full max-w-6xl relative bg-[#1a101a] shadow-2xl overflow-hidden md:border-x-8 border-black">
        
        {gameState === 'MENU' && (
          <MainMenu 
            onStartPractice={() => setGameState('PRACTICE')}
            onStartRootGame={() => setGameState('GAME_ROOTS')}
            onStartWordGame={() => setGameState('GAME_WORDS')}
            onOpenReference={() => setGameState('REFERENCE')}
            onOpenLeaderboard={() => setGameState('LEADERBOARD')}
          />
        )}

        {gameState === 'PRACTICE' && (
          <PracticeMode onExit={() => setGameState('MENU')} />
        )}

        {(gameState === 'GAME_ROOTS' || gameState === 'GAME_WORDS') && (
          <GameLoop 
            mode={gameState} 
            onGameOver={handleGameOver}
            onExit={() => setGameState('MENU')}
          />
        )}

        {gameState === 'REFERENCE' && (
          <div className="w-full h-full pt-8 pb-4">
             <Reference onBack={() => setGameState('MENU')} />
          </div>
        )}

        {gameState === 'LEADERBOARD' && (
          <Leaderboard onBack={() => setGameState('MENU')} />
        )}

        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
            <PixelCard className="text-center p-12 space-y-6 max-w-lg w-full animate-bounce-in">
              <h2 className="text-5xl text-red-600 font-bold mb-4 pixel-font">遊戲結束</h2>
              
              <div className="bg-black/20 p-4 rounded border-2 border-black/10">
                <div className="text-gray-600 text-sm">最終分數</div>
                <div className="text-4xl text-blue-800 font-bold">{lastScore}</div>
              </div>

              {!scoreSubmitted && lastScore > 0 ? (
                <div className="space-y-4">
                  <p className="text-yellow-400 text-sm">輸入名字以儲存分數：</p>
                  <PixelInput 
                    value={playerName} 
                    onChange={setPlayerName} 
                    placeholder="你的名字"
                    className="w-full text-center"
                    maxLength={8}
                  />
                  <PixelButton onClick={handleSubmitScore} color="accent" className="w-full py-2">
                    提交分數
                  </PixelButton>
                </div>
              ) : (
                <div className="text-green-500 text-sm">
                  {lastScore > 0 ? "分數已儲存！" : "繼續加油！"}
                </div>
              )}

              <div className="flex gap-4 justify-center mt-8 border-t border-gray-700 pt-6">
                <PixelButton onClick={() => setGameState('MENU')} color="secondary" className="flex-1 text-sm">
                  主選單
                </PixelButton>
                <PixelButton onClick={() => setGameState('GAME_WORDS')} color="primary" className="flex-1 text-sm">
                  再玩一次
                </PixelButton>
              </div>
            </PixelCard>
          </div>
        )}

      </div>
      
      {/* Decorative scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
    </div>
  );
};

export default App;
