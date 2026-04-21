import React from 'react';
import { Play, Pause, RotateCcw, Cpu, User } from 'lucide-react';
import { GameStatus, ControlMode } from '../../types';
import { motion } from 'motion/react';

interface HUDProps {
  status: GameStatus;
  controlMode: ControlMode;
  onToggleStatus: () => void;
  onRestart: () => void;
  onToggleMode: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  status,
  controlMode,
  onToggleStatus,
  onRestart,
  onToggleMode,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-t-[24px] border-b border-gray-100 w-full z-10 transition-all">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-black text-emerald-600 tracking-tight">贪吃蛇·智慧核心</h1>
        
        {controlMode === 'AUTO' && (
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            status === 'RUNNING' ? 'bg-[#C6F6D5] text-[#22543D]' : 'bg-gray-100 text-gray-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'RUNNING' ? 'bg-[#22543D] animate-pulse' : 'bg-gray-400'}`} />
            自动驾驶中
          </div>
        )}

        {controlMode === 'MANUAL' && (
          <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
            手动控制
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggleStatus}
          className="w-28 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg text-sm hover:bg-gray-200 transition-all shadow-sm"
        >
          {status === 'RUNNING' ? '暂停' : '继续'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="w-28 py-2 bg-emerald-500 text-white font-bold rounded-lg text-sm hover:bg-emerald-600 transition-all shadow-sm"
        >
          重新开始
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggleMode}
          className={`w-40 py-2 font-bold rounded-lg text-sm transition-all shadow-sm ${
            controlMode === 'AUTO' 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {controlMode === 'AUTO' ? '智慧核心: 开启' : '智慧核心: 关闭'}
        </motion.button>
      </div>
    </div>
  );
};
