import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users2,
  Globe,
  Search,
  DollarSign,
  Share2,
  Sparkles,
  FileText,
  Bell,
  Settings,
  Activity,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { SystemStatus } from '../../types';

export type NavItem =
  | 'dashboard'
  | 'projects'
  | 'competitors'
  | 'website'
  | 'pricing'
  | 'keywords'
  | 'social-ads'
  | 'insights'
  | 'reports'
  | 'alerts'
  | 'settings';

export interface SidebarProps {
  currentNav: NavItem;
  onNavigate: (nav: NavItem) => void;
  systemStatus: SystemStatus | null;
  unreadAlertsCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentNav,
  onNavigate,
  systemStatus,
  unreadAlertsCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const mainNavItems = [
    { id: 'dashboard' as NavItem, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects' as NavItem, label: 'Workspaces', icon: FolderKanban },
    { id: 'competitors' as NavItem, label: 'Competitors', icon: Users2 },
  ];

  const monitoringItems = [
    { id: 'website' as NavItem, label: 'Website Scan', icon: Globe },
    { id: 'pricing' as NavItem, label: 'Travel Packages', icon: DollarSign },
    { id: 'keywords' as NavItem, label: 'Keyword Ranks', icon: Search },
    { id: 'social-ads' as NavItem, label: 'Social & Ads', icon: Share2 },
  ];

  const intelligenceItems = [
    { id: 'insights' as NavItem, label: 'AI Summary', icon: Sparkles, badge: 'Gemini AI' },
    { id: 'reports' as NavItem, label: 'Reports', icon: FileText },
    { id: 'alerts' as NavItem, label: 'Alerts & Threats', icon: Bell, badgeCount: unreadAlertsCount },
    { id: 'settings' as NavItem, label: 'Settings & Crawlers', icon: Settings },
  ];

  const renderNavGroup = (title: string, items: typeof mainNavItems) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onCloseMobile();
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer select-none',
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={cn('w-4 h-4', isActive ? 'text-indigo-300' : 'text-slate-400')} />
                <span>{item.label}</span>
              </div>
              {'badge' in item && item.badge && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200/60">
                  {item.badge}
                </span>
              )}
              {'badgeCount' in item && typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 bg-white border-r border-slate-200/70 overflow-y-auto">
      <div>
        {/* Mobile Header Close */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 lg:hidden">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Navigation</span>
          <button onClick={onCloseMobile} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {renderNavGroup('Overview', mainNavItems)}
        {renderNavGroup('Monitoring Channels', monitoringItems)}
        {renderNavGroup('Intelligence & Output', intelligenceItems)}
      </div>

      {/* Footer: System Crawler Status */}
      <div className="pt-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60">
          <div className="flex items-center justify-between text-slate-700 mb-1.5">
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-slate-800">Firecrawl Real-Time Scraper</span>
            </div>
            <Activity className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-[10px] text-slate-500 space-y-0.5">
            <div>Firecrawl Live API: Active</div>
            <div>Scraper Proxy Nodes: {systemStatus?.activeProxies ?? 42} active</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] sticky top-16 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-64 max-w-xs bg-white h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
