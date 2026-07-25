import React, { useState } from 'react';
import {
  Share2,
  Megaphone,
  Heart,
  MessageCircle,
  Share,
  ExternalLink,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { AdCampaign, SocialPost, Competitor } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { formatTimeAgo } from '../../lib/utils';

export interface SocialAdsMonitoringProps {
  ads: AdCampaign[];
  socialPosts: SocialPost[];
  competitors: Competitor[];
}

export const SocialAdsMonitoring: React.FC<SocialAdsMonitoringProps> = ({
  ads,
  socialPosts,
  competitors,
}) => {
  const [activeTab, setActiveTab] = useState<'ads' | 'social'>('ads');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <span>Social & Paid Advertising Intelligence</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Scraped active Meta & Google ad campaigns, creative ad copy, and social media post engagement.
          </p>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'ads', label: 'Active Ad Campaigns', icon: <Megaphone className="w-4 h-4" />, badge: ads.length },
          { id: 'social', label: 'Social Media Feed', icon: <Share2 className="w-4 h-4" />, badge: socialPosts.length },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {activeTab === 'ads' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ads.map((ad) => (
            <Card key={ad.id} className="flex flex-col justify-between hover:border-slate-300">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <Badge variant="info" size="sm">
                    {ad.adNetwork}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Format: {ad.format}
                  </span>
                </div>

                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {ad.competitorName}
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{ad.headline}</h3>

                <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-700 leading-relaxed font-sans italic">
                  "{ad.adCopy}"
                </div>

                {ad.promoCode && (
                  <div className="mt-3 p-2 bg-amber-50 rounded-xl border border-amber-200/60 text-xs font-semibold text-amber-800 flex items-center justify-between">
                    <span>Active Promo Code:</span>
                    <span className="font-mono bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-bold">
                      {ad.promoCode}
                    </span>
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Spend:</span>
                    <span className="font-semibold text-slate-800">{ad.estimatedMonthlySpend}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Keywords:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                      {ad.targetKeywords.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>First Seen: {new Date(ad.firstSeen).toLocaleDateString()}</span>
                <a
                  href={ad.destinationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 font-semibold hover:underline flex items-center gap-0.5"
                >
                  <span>Landing Page</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {socialPosts.map((post) => (
            <Card key={post.id} className="flex flex-col justify-between hover:border-slate-300">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <Badge variant="purple" size="sm">
                    {post.platform}
                  </Badge>
                  <span className="text-xs font-bold text-emerald-600">
                    {post.engagementRate}% Engagement
                  </span>
                </div>

                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {post.competitorName}
                </div>

                {post.mediaUrl && (
                  <img
                    src={post.mediaUrl}
                    alt="Post visual"
                    className="w-full h-44 rounded-xl object-cover mb-3 border border-slate-200"
                  />
                )}

                <p className="text-xs text-slate-700 leading-relaxed">{post.postText}</p>

                {post.campaignTag && (
                  <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-md">
                    {post.campaignTag}
                  </span>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    {post.likesCount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                    {post.commentsCount}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">{formatTimeAgo(post.postedAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
