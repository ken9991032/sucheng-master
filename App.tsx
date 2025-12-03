import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import GameLoop from './components/GameLoop';
import Reference from './components/Reference';
import PracticeMode from './components/PracticeMode';
import { PixelButton, PixelCard } from './components/PixelComponents';
import { GameMode } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameMode>('MENU');
  const [lastScore, setLastScore] = useState(0);

  const handleGameOver = (score: number) => {
    setLastScore(score);
    setGameState('GAME_OVER');
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

        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
            <PixelCard className="text-center p-12 space-y-6 max-w-lg w-full animate-bounce-in">
              <h2 className="text-5xl text-red-600 font-bold mb-4 pixel-font">遊戲結束</h2>
              
              <div className="bg-black/20 p-4 rounded border-2 border-black/10">
                <div className="text-gray-600 text-sm">最終分數</div>
                <div className="text-4xl text-blue-800 font-bold">{lastScore}</div>
              </div>

              <div className="flex gap-4 justify-center mt-8">
                <PixelButton onClick={() => setGameState('MENU')} color="secondary">
                  主選單
                </PixelButton>
                <PixelButton onClick={() => setGameState('GAME_WORDS')} color="primary">
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