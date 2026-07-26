import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  Globe,
  Search,
  DollarSign,
  Users,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldAlert,
  ChevronRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Project,
  Competitor,
  WebsiteSnapshot,
  PricingDataPoint,
  PricingDisparity,
  KeywordRank,
  AIInsight,
  AlertItem,
} from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatTimeAgo } from '../../lib/utils';

export interface DashboardViewProps {
  project: Project;
  competitors: Competitor[];
  snapshots: WebsiteSnapshot[];
  pricingTrends: PricingDataPoint[];
  disparities: PricingDisparity[];
  keywords: KeywordRank[];
  insights: AIInsight[];
  alerts: AlertItem[];
  onNavigate: (nav: any) => void;
  onTriggerScan: (comp: Competitor) => void;
  isScanning: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  competitors,
  snapshots,
  pricingTrends,
  disparities,
  keywords,
  insights,
  alerts,
  onNavigate,
  onTriggerScan,
  isScanning,
}) => {
  const topThreatInsight = insights.find((i) => i.type === 'threat') || insights[0];
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical');
  const avgCompetitorRate = Math.round(
    competitors.reduce((acc, c) => acc + c.avgDailyRate, 0) / (competitors.length || 1)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Active Project Overview & AI Threat Alert */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Project Overview • {project.location}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {project.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Monitoring {competitors.length} primary competitors across website changes, rate disparities, Google SERPs, and Meta ads.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('insights')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-300" />}
            >
              AI Strategy Engine
            </Button>
          </div>
        </div>

        {/* Highlighted AI Strategic Insight */}
        {topThreatInsight && (
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/30">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                    AI Threat Warning
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Impact Score: {topThreatInsight.impactScore}/100
                  </span>
                </div>
                <p className="text-xs font-semibold text-white mt-0.5">
                  {topThreatInsight.title}
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                  {topThreatInsight.summary}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('insights')}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-300 hover:text-white transition-colors self-end sm:self-center cursor-pointer shrink-0"
            >
              <span>Take Recommended Action</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable onClick={() => onNavigate('competitors')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tracked Competitors</span>
            <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{competitors.length}</span>
            <span className="text-xs font-medium text-slate-500">Active Nodes</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Avg Competitor Rate: {formatCurrency(avgCompetitorRate, project.currency)}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </Card>

        <Card hoverable onClick={() => onNavigate('pricing')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rate Disparities</span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{disparities.length}</span>
            <Badge variant="danger" size="sm">
              Max -17.4% Undercut
            </Badge>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>OTA Undercut Risk: High</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </Card>

        <Card hoverable onClick={() => onNavigate('website')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Website Changes Today</span>
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{snapshots.length}</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{snapshots.length}</span>
            <Badge variant="purple" size="sm">
              Firecrawl HTML Diff
            </Badge>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Last change {formatTimeAgo(snapshots[0]?.timestamp || new Date().toISOString())}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </Card>

        <Card hoverable onClick={() => onNavigate('keywords')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Top SERP Keywords</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{keywords.length}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2 Positions
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Search Volume: 144k/mo</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </Card>
      </div>

      {/* Main Grid: Rate Comparison Chart + Live Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rate Comparison Trend Chart */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <CardHeader>
            <div>
              <CardTitle>Average Daily Rate (ADR) Comparison</CardTitle>
              <CardDescription>
                7-day rate tracking across your direct site vs top competitor channels ({project.currency})
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('pricing')}>
              View Matrix
            </Button>
          </CardHeader>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pricingTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ourRateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={['dataMin - 20', 'dataMax + 20']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="ourRate" name="Our Direct Rate" stroke="#0f172a" strokeWidth={2.5} fillOpacity={1} fill="url(#ourRateGrad)" />
                <Area type="monotone" dataKey="competitors.comp_booking_com" name="Booking.com Hub" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#bookingGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center space-x-6 pt-3 mt-2 border-t border-slate-100 text-xs font-medium text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-slate-900" />
              <span>Our Direct Rate (₹35,000)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Booking.com (₹29,000 - Undercutting)</span>
            </div>
          </div>
        </Card>

        {/* Live Change Diffs & Critical Alerts Widget */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <div>
                <CardTitle>Recent Detected Changes</CardTitle>
                <CardDescription>Firecrawl HTML diffs & rate updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('alerts')}>
                All ({alerts.length})
              </Button>
            </CardHeader>

            <div className="space-y-3 mt-3">
              {snapshots.slice(0, 3).map((snap) => (
                <div
                  key={snap.id}
                  onClick={() => onNavigate('website')}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                    <span className="truncate pr-2">{snap.competitorName}</span>
                    <Badge variant={snap.severity === 'High' ? 'danger' : 'warning'} size="sm">
                      {snap.changeType}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-snug">
                    {snap.summary}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(snap.timestamp)}
                    </span>
                    <span className="font-mono text-indigo-600 font-semibold">{snap.diffPercentage}% DOM diff</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('website')}
            className="w-full mt-4"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open Change Inspection Diff
          </Button>
        </Card>
      </div>

      {/* Competitor Overview Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Competitor Fleet Summary</CardTitle>
            <CardDescription>Live tracking status and threat levels for active competitors</CardDescription>
          </div>
          <Button variant="primary" size="sm" onClick={() => onNavigate('competitors')}>
            Manage Competitors
          </Button>
        </CardHeader>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-2.5 px-3">Competitor</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Avg Rate</th>
                <th className="py-2.5 px-3">Threat Level</th>
                <th className="py-2.5 px-3">Last Crawled</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {competitors.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={comp.logoUrl}
                        alt={comp.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{comp.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                          <span>{comp.domain}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{comp.category}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {formatCurrency(comp.avgDailyRate, project.currency)}
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        comp.threatLevel === 'Critical'
                          ? 'danger'
                          : comp.threatLevel === 'High'
                          ? 'warning'
                          : comp.threatLevel === 'Medium'
                          ? 'info'
                          : 'default'
                      }
                      size="sm"
                    >
                      {comp.threatLevel}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{formatTimeAgo(comp.lastCheckedAt)}</td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTriggerScan(comp)}
                      isLoading={isScanning}
                      leftIcon={<RefreshCw className="w-3 h-3" />}
                    >
                      Crawl
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
