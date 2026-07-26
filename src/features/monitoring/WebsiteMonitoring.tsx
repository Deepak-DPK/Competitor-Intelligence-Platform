import React, { useState } from 'react';
import {
  Globe,
  Filter,
  Clock,
  Sparkles,
  Search,
  ChevronRight,
  ExternalLink,
  Code,
  SlidersHorizontal,
} from 'lucide-react';
import { WebsiteSnapshot, Competitor } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { formatTimeAgo } from '../../lib/utils';

export interface WebsiteMonitoringProps {
  snapshots: WebsiteSnapshot[];
  competitors: Competitor[];
  onTriggerScan: (comp: Competitor) => void;
  isScanning: boolean;
}

export const WebsiteMonitoring: React.FC<WebsiteMonitoringProps> = ({
  snapshots,
  competitors,
  onTriggerScan,
  isScanning,
}) => {
  const [selectedChangeType, setSelectedChangeType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSnapshot, setSelectedSnapshot] = useState<WebsiteSnapshot | null>(snapshots[0] || null);

  const changeTypes = ['All', 'CTA Changed', 'Promo Banner Added', 'Cancellation Policy Edit', 'Price Badge Moved'];

  const filteredSnapshots = snapshots.filter((snap) => {
    const matchesSearch =
      snap.competitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snap.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedChangeType === 'All' || snap.changeType === selectedChangeType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <span>Firecrawl Real-Time Web Extractor</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated DOM snapshot comparisons detecting CTA tweaks, promo banners, and policy edits.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Search by competitor or page summary..."
          className="max-w-md"
        />

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {changeTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedChangeType(type)}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedChangeType === type
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Timeline list on Left, Visual Diff Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List Column */}
        <div className="lg:col-span-5 space-y-3">
          <CardHeader>
            <div>
              <CardTitle>Change Timeline Feed</CardTitle>
              <CardDescription>{filteredSnapshots.length} detected page alterations</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredSnapshots.map((snap) => {
              const isSelected = selectedSnapshot?.id === snap.id;
              return (
                <div
                  key={snap.id}
                  onClick={() => setSelectedSnapshot(snap)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {snap.competitorName}
                    </span>
                    <Badge variant={isSelected ? 'outline' : 'purple'} size="sm">
                      {snap.changeType}
                    </Badge>
                  </div>

                  <p className={`text-xs leading-relaxed line-clamp-2 ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                    {snap.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] mt-3 pt-2 border-t border-slate-200/20">
                    <span className={`flex items-center gap-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(snap.timestamp)}
                    </span>
                    <span className={`font-mono font-bold ${isSelected ? 'text-indigo-300' : 'text-indigo-600'}`}>
                      {snap.diffPercentage}% DOM diff
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Inspector Column */}
        <div className="lg:col-span-7">
          {selectedSnapshot ? (
            <Card className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="purple" size="sm">
                      {selectedSnapshot.changeType}
                    </Badge>
                    <span className="text-xs font-bold text-slate-900">{selectedSnapshot.competitorName}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 mt-1">{selectedSnapshot.pageTitle}</h3>
                  <a
                    href={selectedSnapshot.pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>{selectedSnapshot.pageUrl}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <span className="text-xs text-slate-400">{formatTimeAgo(selectedSnapshot.timestamp)}</span>
              </div>

              {/* Summary Box */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Firecrawl Extraction Summary
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedSnapshot.summary}</p>
              </div>

              {/* Visual DOM Code Diff Split */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-slate-600" />
                  Firecrawl HTML Code Diff
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="bg-rose-50/80 p-3.5 rounded-xl border border-rose-200">
                    <div className="flex items-center justify-between text-[10px] font-bold text-rose-800 uppercase mb-2">
                      <span>Baseline DOM Snippet</span>
                      <span className="bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded">BEFORE</span>
                    </div>
                    <pre className="text-[11px] text-rose-950 whitespace-pre-wrap leading-relaxed">
                      {selectedSnapshot.beforeSnippet}
                    </pre>
                  </div>

                  <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800 uppercase mb-2">
                      <span>New Scraped DOM</span>
                      <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded">AFTER</span>
                    </div>
                    <pre className="text-[11px] text-emerald-950 whitespace-pre-wrap leading-relaxed">
                      {selectedSnapshot.afterSnippet}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Screenshot Preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Target Page Snapshot</h4>
                <img
                  src={selectedSnapshot.screenshotUrl}
                  alt="Page snapshot"
                  className="w-full h-52 object-cover rounded-xl border border-slate-200/80 shadow-2xs"
                />
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12 text-slate-400 text-xs">
              Select a change snapshot from the left feed to inspect DOM diff details.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
