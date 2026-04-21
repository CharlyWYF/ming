import React from 'react';
import { Trophy, History, Star } from 'lucide-react';
import { LeaderboardEntry } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  leaderboard: LeaderboardEntry[];
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  bestScore,
  leaderboard,
}) => {
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Stats Card */}
      <div className="bg-white p-5 rounded-[24px] border border-gray-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-start divide-x divide-gray-100">
          <div className="w-1/2 pr-4">
            <div className="text-[12px] font-bold uppercase tracking-wider text-slate-muted mb-1">当前得分</div>
            <div className="text-3xl font-extrabold text-slate-text tracking-tight">{score.toLocaleString()}</div>
          </div>
          <div className="w-1/2 pl-4">
            <div className="text-[12px] font-bold uppercase tracking-wider text-slate-muted mb-1">最高纪录</div>
            <div className="text-3xl font-extrabold text-emerald-active tracking-tight">{bestScore.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Card */}
      <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex-grow">
        <div className="text-[12px] font-bold uppercase tracking-wider text-slate-muted mb-4 flex items-center gap-2">
          <History className="w-4 h-4" />
          本地积分榜
        </div>
        
        <div className="space-y-1 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-slate-muted text-sm italic">
                暂无记录，开始游戏吧！
              </div>
            ) : (
              leaderboard.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 font-bold text-gray-300 text-sm">{idx + 1}</span>
                    <span className="text-sm font-bold text-slate-text">玩家_{idx + 1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-slate-text">{entry.score.toLocaleString()}</span>
                    {entry.mode === 'AUTO' && (
                      <span className="text-[9px] font-black bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded leading-none">智慧</span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
