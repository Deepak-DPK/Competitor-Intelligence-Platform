import React, { useState } from 'react';
import {
  Hotel,
  ChevronDown,
  RefreshCw,
  Bell,
  Menu,
  Sparkles,
  User as UserIcon,
  Check,
  Building2,
  SlidersHorizontal,
} from 'lucide-react';
import { Project, User, UserRole, AlertItem } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface NavbarProps {
  user: User;
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (project: Project) => void;
  alerts: AlertItem[];
  onOpenAlerts: () => void;
  onTriggerGlobalScan: () => void;
  isScanning: boolean;
  onToggleMobileSidebar: () => void;
  onChangeUserRole: (role: UserRole) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  projects,
  activeProject,
  onSelectProject,
  alerts,
  onOpenAlerts,
  onTriggerGlobalScan,
  isScanning,
  onToggleMobileSidebar,
  onChangeUserRole,
  onLogout,
}) => {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  const roles: UserRole[] = ['Revenue Manager', 'Product Manager', 'Marketing Team', 'Business Analyst'];

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left side: Brand Logo + Project Selector */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Hotel className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-none">
              ResortIQ
            </h1>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              Competitor AI
            </span>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-200/80 hidden sm:block" />

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 text-xs font-semibold text-slate-800 border border-slate-200/60 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="max-w-[140px] sm:max-w-[200px] truncate">
              {activeProject ? activeProject.name : 'Select Project'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProjectDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsProjectDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-1.5 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase border-b border-slate-100 mb-1">
                  Active Monitoring Project
                </div>
                {projects.map((proj) => {
                  const isSelected = activeProject?.id === proj.id;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => {
                        onSelectProject(proj);
                        setIsProjectDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors text-left cursor-pointer',
                        isSelected
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate">{proj.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal truncate">
                          {proj.location} • {proj.competitorCount} competitors
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-slate-900 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side: Global Actions & User Persona */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Run Crawl Scan Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onTriggerGlobalScan}
          isLoading={isScanning}
          leftIcon={<RefreshCw className={cn('w-3.5 h-3.5', isScanning && 'animate-spin')} />}
          className="hidden sm:inline-flex"
        >
          {isScanning ? 'Crawling...' : 'Scan Now'}
        </Button>

        {/* Quick Alert Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          title="Notifications & Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        <div className="h-5 w-px bg-slate-200/80 hidden sm:block" />

        {/* User Persona & Role Selector */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-none">{user.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{user.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                  <div className="text-[11px] text-slate-500">{user.email}</div>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  Switch Role Persona
                </div>

                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onChangeUserRole(r);
                      setIsUserMenuOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-xl text-left cursor-pointer transition-colors',
                      user.role === r
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <span>{r}</span>
                    {user.role === r && <Check className="w-3.5 h-3.5 text-slate-900" />}
                  </button>
                ))}

                <div className="h-px bg-slate-100 my-1 w-full" />
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-start px-3 py-1.5 text-xs rounded-xl text-left cursor-pointer transition-colors text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
