import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pill' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pill',
}) => {
  if (variant === 'underline') {
    return (
      <div className={cn('flex items-center space-x-6 border-b border-slate-200/80', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative pb-3 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer',
                isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-600 font-bold">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/50',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 select-none cursor-pointer',
              isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activePillTab"
                className="absolute inset-0 bg-white rounded-lg shadow-2xs border border-slate-200/60"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 text-[10px] rounded-full font-bold ml-0.5',
                    isActive ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/80 text-slate-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
