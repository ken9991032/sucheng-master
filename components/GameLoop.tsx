import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FallingItem, GameMode, RootMapping, WordEntry, Projectile, MonsterType, Particle } from '../types';
import { ROOT_DATA, WORD_DATA } from '../data';
import { PixelBadge, PlayerSprite, MonsterSprite, ProjectileSprite } from './PixelComponents';

interface GameLoopProps {
  mode: 'GAME_ROOTS' | 'GAME_WORDS';
  onGameOver: (score: number) => void;
  onExit: () => void;
}

const SPAWN_RATE_MS = 2000;
const GAME_TICK_MS = 30; // ~30 FPS logic
const BLIND_MODE_LEVEL = 4; // Level at which hints disappear

const GameLoop: React.FC<GameLoopProps> = ({ mode, onGameOver, onExit }) => {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<{msg: string, color: string, x: number, y: number} | null>(null);
  
  // Player state
  const [playerAction, setPlayerAction] = useState<'IDLE' | 'ATTACK'>('IDLE');
  const [activeTargetId, setActiveTargetId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const nextProjId = useRef(0);
  const nextParticleId = useRef(0);
  const lastSpawnTime = useRef(0);
  const speedMultiplier = useRef(1);

  // Memoize root map for O(1) lookup: 'A' -> '日'
  const rootMap = useMemo(() => {
    return ROOT_DATA.reduce((acc, curr) => {
      acc[curr.key] = curr.root;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  // --- Helpers ---

  const createParticles = (x: number, y: number, color: string, count: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: nextParticleId.current++,
        x: x + (Math.random() * 4 - 2),
        y: y + (Math.random() * 4 - 2),
        color,
        life: 1.0 // 100% life
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const spawnItem = useCallback(() => {
    const id = nextId.current++;
    const x = Math.random() * 70 + 15; // Keep away from extreme edges
    const baseSpeed = mode === 'GAME_ROOTS' ? 0.15 : 0.10; 
    
    let content: WordEntry | RootMapping;
    let type: MonsterType = 'SLIME';
    let maxHp = 1;

    if (mode === 'GAME_ROOTS') {
      const idx = Math.floor(Math.random() * ROOT_DATA.length);
      content = ROOT_DATA[idx];
      maxHp = 1;
    } else {
      // Progressive difficulty
      let pool = WORD_DATA.filter(w => w.category === 'HighFreq');
      if (level > 1) {
        pool = [...pool, ...WORD_DATA.filter(w => w.category === 'Common' || w.category === 'Pronoun')];
        type = Math.random() > 0.6 ? 'SLIME' : 'BAT';
      }
      if (level > 2) {
        pool = [...pool, ...WORD_DATA.filter(w => w.category === 'Verb' || w.category === 'Adjective')];
        type = Math.random() > 0.7 ? 'GHOST' : (Math.random() > 0.4 ? 'BAT' : 'SLIME');
      }
      if (level >= 3) {
        pool = [...pool, ...WORD_DATA.filter(w => w.category === 'Difficult' || w.category === 'Question')];
        type = Math.random() > 0.8 ? 'BOSS' : (Math.random() > 0.5 ? 'GHOST' : 'BAT');
      }
      
      const idx = Math.floor(Math.random() * pool.length);
      content = pool[idx];
      maxHp = content.code.length;
    }

    setItems(prev => [
      ...prev,
      {
        id,
        word: content,
        x,
        y: -15, // Start well above screen
        speed: baseSpeed * speedMultiplier.current,
        monsterType: type,
        maxHp: maxHp,
        currentHp: maxHp,
        isTargeted: false,
        isHit: false
      }
    ]);
  }, [mode, level]);

  // --- Game Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      // Spawn
      if (now - lastSpawnTime.current > (SPAWN_RATE_MS / (1 + level * 0.15))) {
        spawnItem();
        lastSpawnTime.current = now;
      }

      // Move Items
      setItems(prevItems => {
        const nextItems: FallingItem[] = [];
        let damageTaken = false;

        prevItems.forEach(item => {
          // If dying (hp <= 0), wait for projectile visual? 
          // Actually, we remove immediately in input, but here we check boundary.
          
          // Move down
          const nextY = item.y + item.speed;

          if (nextY > 85) { // Reached player line
            damageTaken = true;
            createParticles(item.x, 90, 'red', 10);
          } else {
            nextItems.push({ ...item, y: nextY });
          }
        });

        if (damageTaken) {
          setLives(l => {
             const newLives = l - 1;
             setFeedback({ msg: "受傷！", color: "text-red-500", x: 50, y: 80 });
             return newLives;
          });
          setActiveTargetId(null); 
        }

        return nextItems;
      });

      // Move Projectiles
      setProjectiles(prev => {
        const nextProjs: Projectile[] = [];
        prev.forEach(p => {
          if (p.progress < 1) {
            nextProjs.push({ ...p, progress: p.progress + 0.1 }); 
          } 
        });
        return nextProjs;
      });

      // Update Particles
      setParticles(prev => prev
        .map(p => ({ ...p, life: p.life - 0.05, y: p.y + 0.5 }))
        .filter(p => p.life > 0)
      );

    }, GAME_TICK_MS);

    return () => clearInterval(interval);
  }, [spawnItem, level]);

  // Game Over
  useEffect(() => {
    if (lives <= 0) {
      onGameOver(score);
    }
  }, [lives, score, onGameOver]);

  // Level Up
  useEffect(() => {
    const newLevel = Math.floor(score / 1500) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      speedMultiplier.current = 1 + (newLevel * 0.15);
      
      let msg = "第 " + newLevel + " 波";
      let color = "text-yellow-400";
      
      if (mode === 'GAME_WORDS' && newLevel === BLIND_MODE_LEVEL) {
        msg = "盲打模式！";
        color = "text-red-500";
      }
      
      setFeedback({ msg, color, x: 50, y: 40 });
    }
  }, [score, level, mode]);

  // Cleanup Feedback
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Reset Player Action
  useEffect(() => {
    if (playerAction === 'ATTACK') {
      const timer = setTimeout(() => setPlayerAction('IDLE'), 200);
      return () => clearTimeout(timer);
    }
  }, [playerAction]);

  // --- Input Handling ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key.toUpperCase();
      if (!/^[A-Z]$/.test(char)) return;

      setPlayerAction('ATTACK');

      setItems(currentItems => {
        let targetIndex = -1;
        let newActiveTargetId = activeTargetId;

        // 1. Try to find the locked target
        if (newActiveTargetId !== null) {
          const idx = currentItems.findIndex(i => i.id === newActiveTargetId);
          if (idx !== -1) targetIndex = idx;
          else newActiveTargetId = null; // Target lost
        }

        // 2. If no target locked, search for best new target
        if (newActiveTargetId === null) {
          const candidates = currentItems
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => {
              const code = mode === 'GAME_ROOTS' 
                ? (item.word as RootMapping).key 
                : (item.word as WordEntry).code;
              // Check 1st char since we are starting a new target
              return code[0] === char;
            })
            .sort((a, b) => b.item.y - a.item.y); // Prioritize closest to bottom

          if (candidates.length > 0) {
            targetIndex = candidates[0].index;
            newActiveTargetId = candidates[0].item.id;
            setActiveTargetId(newActiveTargetId);
          }
        }

        // 3. Process Hit Logic
        if (targetIndex !== -1) {
          const item = currentItems[targetIndex];
          const code = mode === 'GAME_ROOTS' 
            ? (item.word as RootMapping).key 
            : (item.word as WordEntry).code;
          
          const neededIndex = item.maxHp - item.currentHp;
          
          if (code[neededIndex] === char) {
             // HIT!
             const updatedItem = { ...item, currentHp: item.currentHp - 1, isTargeted: true };
             const nextItems = [...currentItems];

             // Spawn visual projectile
             const isFinishingBlow = updatedItem.currentHp <= 0;
             setProjectiles(prev => [...prev, {
               id: nextProjId.current++,
               startX: 50, // Player is centered
               startY: 90,
               targetId: item.id,
               progress: 0,
               type: isFinishingBlow ? 'BIG' : 'SMALL'
             }]);

             if (isFinishingBlow) {
                // Kill logic
                setScore(s => s + (mode === 'GAME_ROOTS' ? 50 : 100));
                createParticles(item.x, item.y, '#facc15', 15);
                setActiveTargetId(null); // Unlock
                // Remove item immediately
                nextItems.splice(targetIndex, 1);
             } else {
                nextItems[targetIndex] = updatedItem;
             }
             
             return nextItems;
          } else {
             // Miss on locked target
             setFeedback({ msg: "失誤！", color: "text-red-400", x: item.x, y: item.y - 5 });
          }
        } else {
           // Miss globally
           // setFeedback({ msg: "?", color: "text-gray-500", x: 50, y: 80 });
        }

        return currentItems;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, activeTargetId, activeTargetId]);

  return (
    <div className="relative w-full h-full bg-[#111] overflow-hidden" ref={containerRef}>
      
      {/* UI Layer */}
      <div className="absolute top-4 left-4 z-20 flex gap-4">
        <PixelBadge label="分數" value={score} color="bg-blue-900" />
        <PixelBadge label="生命" value={"♥".repeat(lives)} color="bg-red-900" />
        <PixelBadge label="關卡" value={level} color="bg-yellow-900" />
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button onClick={onExit} className="px-4 py-2 bg-gray-700 border-2 border-white text-white font-bold hover:bg-gray-600">
          退出
        </button>
      </div>

      {/* Game Layer */}
      <div className="absolute inset-0 z-10">
        
        {/* Monsters */}
        {items.map(item => {
           const code = mode === 'GAME_ROOTS' ? (item.word as RootMapping).key : (item.word as WordEntry).code;
           
           return (
            <div 
              key={item.id}
              className="absolute transform -translate-x-1/2 flex flex-col items-center transition-all duration-100"
              style={{ 
                left: `${item.x}%`, 
                top: `${item.y}%`,
                opacity: item.isHit ? 0.5 : 1
              }}
            >
              {/* Target Indicator */}
              {item.isTargeted && (
                <div className="absolute -top-6 w-6 h-6 border-2 border-red-500 rounded-full animate-ping" />
              )}
              
              <MonsterSprite type={item.monsterType} isHit={item.isHit || false} />
              
              {/* Word Display */}
              <div className="mt-2 flex flex-col items-center bg-black/60 px-2 py-1 rounded border border-gray-600 shadow-lg">
                <span className="text-2xl font-bold text-white leading-none mb-1">
                  {(mode === 'GAME_ROOTS' ? (item.word as RootMapping).root : (item.word as WordEntry).char)}
                </span>
                
                {/* Code Progress with Sucheng Hints */}
                <div className="flex gap-1">
                   {code.split('').map((c, i) => {
                     const isTyped = i < (item.maxHp - item.currentHp);
                     const isNext = i === (item.maxHp - item.currentHp);
                     
                     // Determine what text to show in the box
                     let displayText = c;
                     if (mode === 'GAME_WORDS') {
                       // If Blind Mode is active (level >= 4), hide hint unless already typed
                       const isBlind = level >= BLIND_MODE_LEVEL;
                       if (isTyped) {
                         displayText = rootMap[c] || c; // Always show typed roots
                       } else {
                         displayText = isBlind ? '?' : (rootMap[c] || c); // Hide or show hint
                       }
                     }

                     return (
                       <span key={i} className={`
                         text-sm font-bold w-6 h-6 flex items-center justify-center rounded
                         font-['DotGothic16']
                         ${isTyped ? 'bg-green-600 text-white' : (isNext ? 'bg-yellow-400 text-black animate-pulse' : 'bg-gray-700 text-gray-400')}
                       `}>
                         {displayText}
                       </span>
                     );
                   })}
                </div>
              </div>

              {/* HP Bar */}
              <div className="mt-1 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-200"
                  style={{ width: `${(item.currentHp / item.maxHp) * 100}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Projectiles */}
        {projectiles.map(p => {
           const target = items.find(i => i.id === p.targetId);
           if (!target) return null;
           
           // Simple lerp
           const currX = p.startX + (target.x - p.startX) * p.progress;
           const currY = p.startY + (target.y - p.startY) * p.progress;
           
           return (
             <div 
               key={p.id} 
               className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-none"
               style={{ left: `${currX}%`, top: `${currY}%` }}
             >
               <ProjectileSprite type={p.type} />
             </div>
           );
        })}

        {/* Particles */}
        {particles.map(p => (
          <div 
            key={p.id}
            className="absolute w-2 h-2 rounded-sm pointer-events-none"
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%`, 
              backgroundColor: p.color,
              opacity: p.life 
            }}
          />
        ))}

        {/* Feedback Text */}
        {feedback && (
          <div 
            className={`absolute font-bold text-3xl animate-bounce ${feedback.color} z-50 whitespace-nowrap`}
            style={{ left: `${feedback.x}%`, top: `${feedback.y}%`, textShadow: '2px 2px 0 #000' }}
          >
            {feedback.msg}
          </div>
        )}
      </div>

      {/* Player Area */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
         <PlayerSprite action={playerAction} />
         <div className="w-16 h-2 bg-black/50 rounded-full mt-2 blur-sm" />
      </div>

      {/* Grid Floor */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-purple-900/50 to-transparent pointer-events-none z-0" 
           style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}
      />
    </div>
  );
};

export default GameLoop;