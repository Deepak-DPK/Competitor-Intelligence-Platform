import React, { useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Globe,
  DollarSign,
  Search,
  Share2,
  Megaphone,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  Competitor,
  WebsiteSnapshot,
  KeywordRank,
  AdCampaign,
  SocialPost,
  Project,
} from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { formatCurrency, formatTimeAgo } from '../../lib/utils';

export interface CompetitorDetailViewProps {
  competitor: Competitor;
  project: Project;
  snapshots: WebsiteSnapshot[];
  keywords: KeywordRank[];
  ads: AdCampaign[];
  socialPosts: SocialPost[];
  onBack: () => void;
  onTriggerScan: (comp: Competitor) => void;
  isScanning: boolean;
}

export const CompetitorDetailView: React.FC<CompetitorDetailViewProps> = ({
  competitor,
  project,
  snapshots,
  keywords,
  ads,
  socialPosts,
  onBack,
  onTriggerScan,
  isScanning,
}) => {
  const [activeTab, setActiveTab] = useState<'website' | 'keywords' | 'ads' | 'social'>('website');

  const compSnapshots = snapshots.filter((s) => s.competitorId === competitor.id);
  const compKeywords = keywords.filter((k) => k.competitorId === competitor.id);
  const compAds = ads.filter((a) => a.competitorId === competitor.id);
  const compPosts = socialPosts.filter((p) => p.competitorId === competitor.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/70">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Competitor List</span>
        </button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onTriggerScan(competitor)}
          isLoading={isScanning}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Trigger Crawl Now
        </Button>
      </div>

      {/* Competitor Banner Card */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={competitor.logoUrl}
              alt={competitor.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{competitor.name}</h2>
                <Badge
                  variant={
                    competitor.threatLevel === 'Critical'
                      ? 'danger'
                      : competitor.threatLevel === 'High'
                      ? 'warning'
                      : 'info'
                  }
                  size="sm"
                >
                  {competitor.threatLevel} Threat
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center space-x-2">
                <span>{competitor.category}</span>
                <span>•</span>
                <a
                  href={competitor.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-300 hover:underline flex items-center gap-1"
                >
                  <span>{competitor.domain}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 bg-white/10 p-3 rounded-2xl backdrop-blur-xs text-xs">
            <div>
              <span className="text-[10px] text-slate-300 uppercase block font-bold">Est ADR</span>
              <span className="text-base font-bold text-white">
                {formatCurrency(competitor.avgDailyRate, project.currency)}
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <span className="text-[10px] text-slate-300 uppercase block font-bold">Star Rating</span>
              <span className="text-base font-bold text-amber-300 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                {competitor.starRating}
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <span className="text-[10px] text-slate-300 uppercase block font-bold">Properties</span>
              <span className="text-base font-bold text-white">{competitor.propertyCount}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'website', label: 'Website Changes', icon: <Globe className="w-4 h-4" />, badge: compSnapshots.length },
          { id: 'keywords', label: 'SEO Keywords', icon: <Search className="w-4 h-4" />, badge: compKeywords.length },
          { id: 'ads', label: 'Ad Campaigns', icon: <Megaphone className="w-4 h-4" />, badge: compAds.length },
          { id: 'social', label: 'Social Activity', icon: <Share2 className="w-4 h-4" />, badge: compPosts.length },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab Content */}
      {activeTab === 'website' && (
        <div className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>DOM & Markdown Change History</CardTitle>
              <CardDescription>
                Playwright + Jina Reader HTML snapshots comparing structural and promotional page updates.
              </CardDescription>
            </div>
          </CardHeader>

          {compSnapshots.length === 0 ? (
            <Card className="text-center py-8 text-slate-500 text-xs">
              No recent website changes detected for this competitor.
            </Card>
          ) : (
            compSnapshots.map((snap) => (
              <Card key={snap.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="purple" size="sm">
                      {snap.changeType}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-900">{snap.pageTitle}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(snap.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  {snap.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200/60">
                    <span className="text-[10px] font-bold text-rose-700 uppercase block mb-1">Before Change</span>
                    <pre className="text-[11px] text-rose-900 whitespace-pre-wrap">{snap.beforeSnippet}</pre>
                  </div>
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">After Change</span>
                    <pre className="text-[11px] text-emerald-900 whitespace-pre-wrap">{snap.afterSnippet}</pre>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'keywords' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Tracked SERP Keywords</CardTitle>
              <CardDescription>Google Search positions and target landing pages</CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Keyword</th>
                  <th className="py-2.5 px-3">Search Vol</th>
                  <th className="py-2.5 px-3">Our Rank</th>
                  <th className="py-2.5 px-3">Competitor Rank</th>
                  <th className="py-2.5 px-3">SERP Features</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {compKeywords.map((kw) => (
                  <tr key={kw.id}>
                    <td className="py-3 px-3 font-semibold text-slate-900">{kw.keyword}</td>
                    <td className="py-3 px-3 text-slate-600">{kw.searchVolume.toLocaleString()}/mo</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">#{kw.ourRank}</td>
                    <td className="py-3 px-3">
                      <Badge variant="purple" size="sm">
                        #{kw.competitorRank}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {kw.serpFeatures.map((f) => (
                          <span key={f} className="px-1.5 py-0.5 text-[10px] bg-slate-100 rounded-md text-slate-600">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'ads' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {compAds.map((ad) => (
            <Card key={ad.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="info" size="sm">
                  {ad.adNetwork}
                </Badge>
                <span className="text-[10px] text-slate-400 font-medium">
                  Est. Spend: {ad.estimatedMonthlySpend}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{ad.headline}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{ad.adCopy}"
                </p>
              </div>

              {ad.promoCode && (
                <div className="text-xs text-slate-700 bg-amber-50 p-2 rounded-xl border border-amber-200/60 font-semibold flex items-center justify-between">
                  <span>Detected Promo Code:</span>
                  <span className="font-mono text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                    {ad.promoCode}
                  </span>
                </div>
              )}

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                <span>First Seen: {new Date(ad.firstSeen).toLocaleDateString()}</span>
                <span>Active Format: {ad.format}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'social' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {compPosts.map((post) => (
            <Card key={post.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="purple" size="sm">
                  {post.platform}
                </Badge>
                <span className="text-xs font-semibold text-emerald-600">
                  {post.engagementRate}% Engagement
                </span>
              </div>

              {post.mediaUrl && (
                <img
                  src={post.mediaUrl}
                  alt="Post visual"
                  className="w-full h-40 rounded-xl object-cover border border-slate-200"
                />
              )}

              <p className="text-xs text-slate-700 leading-relaxed">{post.postText}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>
                  ❤️ {post.likesCount.toLocaleString()} • 💬 {post.commentsCount}
                </span>
                <span className="text-slate-400">{formatTimeAgo(post.postedAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
