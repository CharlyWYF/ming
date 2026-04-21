import React, { useRef, useEffect } from 'react';
import { Point, GameStatus } from '../../types';
import { CELL_COUNT, COLORS } from '../../constants';
import { motion, AnimatePresence } from 'motion/react';

interface GameBoardProps {
  snake: Point[];
  food: Point;
  status: GameStatus;
  onRestart: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ snake, food, status, onRestart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const cellSize = size / CELL_COUNT;

    // Clear board (Canvas Area Background)
    ctx.fillStyle = COLORS.canvasBg;
    ctx.fillRect(0, 0, size, size);

    // Draw grid (Grid BG)
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= CELL_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();
    }

    // Draw food (Red circle with border and shadow effect)
    ctx.fillStyle = COLORS.food;
    ctx.strokeStyle = COLORS.foodBorder;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const foodX = food.x * cellSize + cellSize / 2;
    const foodY = food.y * cellSize + cellSize / 2;
    const radius = cellSize / 2.8;
    ctx.arc(foodX, foodY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw snake (Geometric segments with borders)
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snakeBody;
      ctx.strokeStyle = COLORS.snakeBorder;
      ctx.lineWidth = 2;
      
      const pad = 2; 
      const x = segment.x * cellSize + pad;
      const y = segment.y * cellSize + pad;
      const w = cellSize - pad * 2;
      const h = cellSize - pad * 2;
      
      // Draw segment with slight rounding as per theme
      const radius = 6;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fill();
      ctx.stroke();

      // Eyes only on head
      if (isHead) {
        ctx.fillStyle = 'white';
        const eyeSize = 2;
        // Eyes position relative to head
        ctx.beginPath();
        ctx.arc(x + w * 0.75, y + h * 0.25, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

  }, [snake, food]);

  return (
    <div className="relative aspect-square w-full max-w-[500px] bg-white rounded-3xl overflow-hidden border-4 border-white shadow-xl">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-full block"
      />
      
      <AnimatePresence>
        {status === 'GAMEOVER' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-olive/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
          >
            <h2 className="text-4xl font-black text-white mb-2">哎呀!</h2>
            <p className="text-white/70 mb-8 font-medium">小蛇撞到了墙壁或它自己...</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="px-8 py-3 bg-white text-olive font-black rounded-2xl shadow-xl uppercase tracking-widest text-sm"
            >
              再试一次
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
