import React from 'react';
import { PixelButton, PixelCard } from './PixelComponents';

interface MainMenuProps {
  onStartRootGame: () => void;
  onStartWordGame: () => void;
  onStartPractice: () => void;
  onOpenReference: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartRootGame, onStartWordGame, onStartPractice, onOpenReference }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 animate-fade-in p-4">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 pixel-font tracking-tighter" 
            style={{ textShadow: '4px 4px 0px #8b0000, 8px 8px 0px #000' }}>
          速成大師
        </h1>
        <h2 className="text-xl md:text-2xl text-blue-300 pixel-font mt-4">
          SUCHENG MASTER
        </h2>
      </div>

      <PixelCard className="w-full max-w-md flex flex-col gap-4 p-8 bg-[#2a2a2a] border-gray-600">
        <div className="text-center text-gray-400 mb-2 text-sm">選擇模式</div>
        
        <PixelButton onClick={onStartPractice} color="primary" className="w-full relative group">
          <span className="absolute left-4 opacity-0 group-hover:opacity-100 transition-opacity">►</span>
          修煉道場 (練習模式)
        </PixelButton>

        <PixelButton onClick={onStartRootGame} color="accent" className="w-full relative group">
          <span className="absolute left-4 opacity-0 group-hover:opacity-100 transition-opacity">►</span>
          字根防衛戰 (字根練習)
        </PixelButton>

        <PixelButton onClick={onStartWordGame} color="danger" className="w-full relative group">
          <span className="absolute left-4 opacity-0 group-hover:opacity-100 transition-opacity">►</span>
          隕石拆碼戰 (拆碼挑戰)
        </PixelButton>

        <div className="h-4"></div>

        <PixelButton onClick={onOpenReference} color="secondary" className="w-full">
          速成寶典 (查詢表)
        </PixelButton>
      </PixelCard>

      <div className="text-xs text-gray-500 mt-8">
        請使用鍵盤遊玩 • 建議使用 CHROME 瀏覽器以獲得最佳體驗
      </div>
    </div>
  );
};

export default MainMenu;