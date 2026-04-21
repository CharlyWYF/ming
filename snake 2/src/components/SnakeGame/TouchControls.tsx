import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Direction } from '../../types';
import { motion } from 'motion/react';

interface TouchControlsProps {
  onDirectionChange: (dir: Direction) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onDirectionChange }) => {
  const Button = ({ direction, icon: Icon, isPrimary = false }: { direction: Direction, icon: any, isPrimary?: boolean }) => (
    <motion.button
      whileTap={{ y: 2, boxShadow: 'none' }}
      onClick={() => onDirectionChange(direction)}
      className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all ${
        isPrimary 
          ? 'bg-emerald-500 text-white border-b-4 border-emerald-700 shadow-lg' 
          : 'bg-[#EDF2F7] text-slate-text border-b-4 border-[#CBD5E0] shadow-md'
      }`}
    >
      <Icon className="w-8 h-8" strokeWidth={3} />
    </motion.button>
  );

  return (
    <div className="grid grid-cols-3 gap-3 p-2">
      <div />
      <Button direction="UP" icon={ChevronUp} />
      <div />
      <Button direction="LEFT" icon={ChevronLeft} />
      <div />
      <Button direction="RIGHT" icon={ChevronRight} isPrimary />
      <div />
      <Button direction="DOWN" icon={ChevronDown} />
      <div />
    </div>
  );
};
