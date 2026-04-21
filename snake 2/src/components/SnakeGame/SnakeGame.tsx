import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameBoard } from './GameBoard';
import { ScoreBoard } from './ScoreBoard';
import { HUD } from './HUD';
import { TouchControls } from './TouchControls';
import { motion } from 'motion/react';
import { 
  Direction, 
  GameStatus, 
  GameState, 
  ControlMode, 
  ControlOwner, 
  LeaderboardEntry 
} from '../../types';
import { Cpu } from 'lucide-react';
import { 
  CELL_COUNT, 
  STORAGE_KEY, 
  OVERRIDE_DURATION_MS,
  MIN_SPEED,
  SPEED_INCREMENT
} from '../../constants';
import { getInitialState, getRandomPoint, isOpposite } from '../../logic/gameLogic';
import { getNextAutoDirection } from '../../logic/autopilot';
import { useGameLoop } from '../../hooks/useGameLoop';

export const SnakeGame: React.FC = () => {
  const [state, setState] = useState<GameState>(getInitialState());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const manualOverrideUntil = useRef<number>(0);

  // Load from storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { bestScore, leaderboard } = JSON.parse(saved);
        setState(prev => ({ ...prev, bestScore }));
        setLeaderboard(leaderboard || []);
      } catch (e) {
        console.error('Failed to load storage', e);
      }
    }
  }, []);

  // Save to storage
  const saveToStorage = useCallback((bestScore: number, newLeaderboard: LeaderboardEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ bestScore, leaderboard: newLeaderboard }));
  }, []);

  const handleGameOver = useCallback(() => {
    setState(prev => {
      const isNewBest = prev.score > prev.bestScore;
      const finalBest = isNewBest ? prev.score : prev.bestScore;
      
      const newEntry: LeaderboardEntry = {
        id: Date.now().toString(),
        score: prev.score,
        mode: prev.controlMode,
        date: new Date().toISOString(),
      };
      
      const newLeaderboard = [newEntry, ...leaderboard]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      
      setLeaderboard(newLeaderboard);
      saveToStorage(finalBest, newLeaderboard);
      
      return { ...prev, status: 'GAMEOVER', bestScore: finalBest };
    });
  }, [leaderboard, saveToStorage]);

  const moveSnake = useCallback(() => {
    if (state.status !== 'RUNNING') return;

    setState(prev => {
      let finalDir = prev.nextDirection;

      // Handle Autopilot logic
      const now = Date.now();
      const isManualOverridden = now < manualOverrideUntil.current;
      
      let currentOwner: ControlOwner = prev.controlOwner;
      if (prev.controlMode === 'AUTO') {
        if (isManualOverridden) {
          currentOwner = 'AUTO_OVERRIDE';
          // Stay with manual direction (prev.nextDirection)
        } else {
          currentOwner = 'AUTO';
          finalDir = getNextAutoDirection(prev.snake, prev.food, CELL_COUNT);
        }
      } else {
        currentOwner = 'MANUAL';
      }

      const head = prev.snake[0];
      const newHead = { x: head.x, y: head.y };

      switch (finalDir) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // 1. Wall collision
      if (newHead.x < 0 || newHead.x >= CELL_COUNT || newHead.y < 0 || newHead.y >= CELL_COUNT) {
        handleGameOver();
        return prev;
      }

      // 2. Self collision
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return prev;
      }

      const newSnake = [newHead, ...prev.snake];
      const ateFood = newHead.x === prev.food.x && newHead.y === prev.food.y;

      let newFood = prev.food;
      let newScore = prev.score;
      let newSpeed = prev.speed;

      if (ateFood) {
        newFood = getRandomPoint(newSnake);
        newScore += 10;
        newSpeed = Math.max(MIN_SPEED, prev.speed - SPEED_INCREMENT);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        speed: newSpeed,
        direction: finalDir,
        controlOwner: currentOwner,
      };
    });
  }, [state.status, handleGameOver]);

  useGameLoop(moveSnake, state.status === 'RUNNING' ? state.speed : null);

  const handleDirectionChange = useCallback((dir: Direction) => {
    setState(prev => {
      if (isOpposite(dir, prev.direction)) return prev;
      
      if (prev.controlMode === 'AUTO') {
        manualOverrideUntil.current = Date.now() + OVERRIDE_DURATION_MS;
      }
      
      return { ...prev, nextDirection: dir };
    });
  }, []);

  const toggleStatus = () => {
    setState(prev => ({
      ...prev,
      status: prev.status === 'RUNNING' ? 'PAUSED' : 'RUNNING'
    }));
  };

  const restartGame = () => {
    setState(prev => ({ ...getInitialState(prev.bestScore), controlMode: prev.controlMode }));
    manualOverrideUntil.current = 0;
  };

  const toggleMode = () => {
    setState(prev => ({
      ...prev,
      controlMode: prev.controlMode === 'MANUAL' ? 'AUTO' : 'MANUAL',
      controlOwner: prev.controlMode === 'MANUAL' ? 'AUTO' : 'MANUAL'
    }));
    manualOverrideUntil.current = 0;
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': handleDirectionChange('UP'); break;
        case 'ArrowDown': case 's': case 'S': handleDirectionChange('DOWN'); break;
        case 'ArrowLeft': case 'a': case 'A': handleDirectionChange('LEFT'); break;
        case 'ArrowRight': case 'd': case 'D': handleDirectionChange('RIGHT'); break;
        case ' ': e.preventDefault(); toggleStatus(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirectionChange]);

  return (
    <div className="min-h-screen bg-[#F4F7F2] p-8 font-sans text-slate-text">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 h-full">
        {/* Left Column: Canvas Area with Integrated HUD */}
        <div className="bg-white rounded-[24px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border-[8px] border-[#E2E8F0] relative overflow-hidden flex flex-col h-fit">
          <HUD 
            status={state.status} 
            controlMode={state.controlMode}
            onToggleStatus={toggleStatus}
            onRestart={restartGame}
            onToggleMode={toggleMode}
          />
          
          <div className="p-4 flex-grow flex items-center justify-center bg-white relative">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ 
                   backgroundImage: `linear-gradient(to right, #2D3748 1px, transparent 1px), linear-gradient(to bottom, #2D3748 1px, transparent 1px)`,
                   backgroundSize: '25px 25px'
                 }} 
            />
            
            <GameBoard 
              snake={state.snake} 
              food={state.food} 
              status={state.status}
              onRestart={restartGame}
            />
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="flex flex-col gap-5">
          <ScoreBoard 
            score={state.score} 
            bestScore={state.bestScore} 
            leaderboard={leaderboard} 
          />


          {/* D-PAD Area */}
          <div className="mt-auto pt-4 flex flex-col items-center">
            <TouchControls onDirectionChange={handleDirectionChange} />
            <div className="mt-4 text-[11px] text-slate-muted font-bold uppercase tracking-widest text-center hidden md:block">
              控制：WASD / 方向键 • 空格：暂停
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
