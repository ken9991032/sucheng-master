import React, { useState, useEffect, useMemo } from 'react';
import { WORD_DATA, ROOT_DATA } from '../data';
import { PixelButton, PixelCard, PixelBadge } from './PixelComponents';

interface PracticeModeProps {
  onExit: () => void;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ onExit }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  const [streak, setStreak] = useState(0);

  // Randomize order on mount
  const shuffledIndices = useMemo(() => {
    return Array.from({ length: WORD_DATA.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
  }, []);

  const currentWord = WORD_DATA[shuffledIndices[currentWordIndex]];
  const rootMap = useMemo(() => {
    return ROOT_DATA.reduce((acc, curr) => {
      acc[curr.key] = curr.root;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  const handleNext = () => {
    setInput('');
    setShowHint(false);
    setStatus('IDLE');
    setCurrentWordIndex((prev) => (prev + 1) % WORD_DATA.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === 'CORRECT') return; // Block input during success animation

      const char = e.key.toUpperCase();
      
      // Handle Backspace
      if (e.key === 'Backspace') {
        setInput(prev => prev.slice(0, -1));
        setStatus('IDLE');
        setShowHint(false);
        return;
      }

      // Handle Letters
      if (/^[A-Z]$/.test(char)) {
        if (input.length < currentWord.code.length) {
          const newInput = input + char;
          setInput(newInput);
          setShowHint(false); // Hide hint once user tries a key

          // Auto-check if full
          if (newInput.length === currentWord.code.length) {
            if (newInput === currentWord.code) {
              setStatus('CORRECT');
              setStreak(s => s + 1);
              setTimeout(handleNext, 1000); // Auto advance
            } else {
              setStatus('WRONG');
              setStreak(0);
              // Optional: Clear input after a short delay or let user backspace
              setTimeout(() => {
                setInput('');
                setStatus('IDLE');
              }, 500);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, currentWord, status]);

  // Derive current hint
  const nextIndex = input.length;
  const targetCode = currentWord.code[nextIndex];
  const targetRoot = targetCode ? rootMap[targetCode] : '';
  const hintLabel = nextIndex === 0 ? '頭碼' : '尾碼';

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 relative">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div className="flex gap-4">
          <PixelBadge label="連勝" value={streak} color="bg-green-900" />
        </div>
        <PixelButton onClick={onExit} color="secondary" className="px-4 py-2 text-sm">
          退出
        </PixelButton>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-400 mb-2" style={{ textShadow: '2px 2px 0 #000' }}>
          修煉道場
        </h1>
        <p className="text-gray-400 text-sm">輸入頭碼 + 尾碼。無時間限制。</p>
      </div>

      <PixelCard className={`
        flex flex-col items-center gap-8 p-12 w-full max-w-lg transition-transform duration-200
        ${status === 'WRONG' ? 'animate-shake border-red-500' : ''}
        ${status === 'CORRECT' ? 'border-green-500 scale-105' : ''}
      `}>
        {/* Character Display - Uses font-sans for clarity */}
        <div className="relative">
          <div className="text-9xl font-bold text-white leading-none font-sans">
            {currentWord.char}
          </div>
          {status === 'CORRECT' && (
            <div className="absolute -top-4 -right-8 text-4xl animate-bounce">✅</div>
          )}
        </div>

        {/* Input Slots */}
        <div className="flex gap-4">
          {currentWord.code.split('').map((_, i) => {
            const char = input[i];
            const root = char ? rootMap[char] : null;
            
            return (
              <div 
                key={i} 
                className={`
                  w-16 h-20 border-4 flex flex-col items-center justify-center rounded bg-gray-900
                  ${i === input.length ? 'border-yellow-400' : 'border-gray-600'}
                  ${status === 'CORRECT' ? 'border-green-500 bg-green-900' : ''}
                  ${status === 'WRONG' ? 'border-red-500' : ''}
                `}
              >
                {char && (
                  <>
                    <span className="text-xl font-bold text-gray-400 -mb-1">{char}</span>
                    <span className="text-3xl font-bold text-white font-sans">{root || '?'}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Hint Area */}
        <div className="h-16 flex items-center justify-center w-full">
           {showHint && targetRoot ? (
             <div className="bg-blue-900/50 border border-blue-500 px-6 py-2 rounded text-blue-200 text-xl font-bold animate-fade-in">
               {hintLabel}: {targetRoot}
             </div>
           ) : (
             <PixelButton 
                onClick={() => setShowHint(true)} 
                color="accent" 
                className="text-sm py-2 px-4" 
                disabled={status === 'CORRECT' || input.length >= currentWord.code.length}
             >
               💡 顯示提示
             </PixelButton>
           )}
        </div>

        {/* Feedback Message */}
        <div className="h-8 text-xl font-bold text-center">
          {status === 'WRONG' && <span className="text-red-500">再試一次！</span>}
          {status === 'CORRECT' && <span className="text-green-400">太棒了！</span>}
        </div>

      </PixelCard>
      
      {/* On-screen Keyboard Guide (Optional visualization) */}
      <div className="mt-8 text-gray-600 text-xs">
        輸入對應提示的英文字母。
      </div>
    </div>
  );
};

export default PracticeMode;