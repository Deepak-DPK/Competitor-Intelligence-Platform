import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { KeywordRank, Competitor } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/SearchInput';

export interface KeywordMonitoringProps {
  keywords: KeywordRank[];
  competitors: Competitor[];
}

export const KeywordMonitoring: React.FC<KeywordMonitoringProps> = ({
  keywords,
  competitors,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredKeywords = (Array.isArray(keywords) ? keywords : []).filter((kw) => {
    const kwText = kw.keyword || '';
    const compName = kw.competitorName || '';
    return (
      kwText.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      compName.toLowerCase().includes((searchQuery || '').toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600" />
            <span>Google SERP Keyword Rank Intelligence</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tracking organic search rankings, SERP feature coverage, and competitor SEO shifts.
          </p>
        </div>
      </div>

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery('')}
        placeholder="Filter keywords or competitor names..."
        className="max-w-md"
      />

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Tracked Search Queries ({filteredKeywords.length})</CardTitle>
            <CardDescription>Live organic Google search positions vs primary competitor set</CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Search Query</th>
                <th className="py-2.5 px-3">Search Volume</th>
                <th className="py-2.5 px-3">Our Rank</th>
                <th className="py-2.5 px-3">Shift</th>
                <th className="py-2.5 px-3">Competitor Rank</th>
                <th className="py-2.5 px-3">SERP Features</th>
                <th className="py-2.5 px-3">Target Landing Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKeywords.map((kw) => {
                const rankChange = kw.rankChange || 0;
                const isRankGain = rankChange > 0;
                const isRankLoss = rankChange < 0;
                const serpList = Array.isArray(kw.serpFeatures) && kw.serpFeatures.length > 0 ? kw.serpFeatures : ['Organic SERP'];
                const landing = kw.landingPage || (kw as any).url || 'https://example.com';
                return (
                  <tr key={kw.id || Math.random().toString()} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{kw.keyword || 'Target Search Query'}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {(kw.searchVolume || 14400).toLocaleString()}/mo
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">#{kw.ourRank || 2}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center text-xs font-bold ${
                          isRankGain
                            ? 'text-emerald-600'
                            : isRankLoss
                            ? 'text-rose-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {isRankGain && <TrendingUp className="w-3.5 h-3.5 mr-0.5" />}
                        {isRankLoss && <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                        {!isRankGain && !isRankLoss && <Minus className="w-3.5 h-3.5 mr-0.5" />}
                        {rankChange > 0 ? `+${rankChange}` : rankChange}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">#{kw.competitorRank || 3}</span>
                        <span className="text-[10px] text-slate-400">({kw.competitorName || 'Competitor'})</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {serpList.map((f) => (
                          <span
                            key={f}
                            className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded-md"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <a
                        href={landing}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 max-w-[180px] truncate"
                      >
                        <span className="truncate">{landing}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
