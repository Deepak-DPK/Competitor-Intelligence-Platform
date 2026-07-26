import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Star,
  ExternalLink,
  Globe,
  DollarSign,
  Search,
  Share2,
  Megaphone,
  RefreshCw,
  Trash2,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Competitor, Project } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/SearchInput';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { formatCurrency, formatTimeAgo } from '../../lib/utils';
import { AICompetitorDiscoveryModal } from './AICompetitorDiscoveryModal';

export interface CompetitorsViewProps {
  project: Project;
  competitors: Competitor[];
  onAddCompetitor: (data: Omit<Competitor, 'id' | 'lastCheckedAt' | 'threatLevel'>) => Promise<void>;
  onUpdateCompetitor: (id: string, updates: Partial<Competitor>) => Promise<void>;
  onDeleteCompetitor: (id: string) => Promise<void>;
  onTriggerScan: (comp: Competitor) => void;
  isScanning: boolean;
  onSelectCompetitorDetail: (comp: Competitor) => void;
}

export const CompetitorsView: React.FC<CompetitorsViewProps> = ({
  project,
  competitors,
  onAddCompetitor,
  onUpdateCompetitor,
  onDeleteCompetitor,
  onTriggerScan,
  isScanning,
  onSelectCompetitorDetail,
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAIDiscoveryOpen, setIsAIDiscoveryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    targetUrl: '',
    category: 'Direct OTA' as Competitor['category'],
    starRating: 4.5,
    propertyCount: 1,
    avgDailyRate: 350,
    priceTier: '$$$' as Competitor['priceTier'],
    instagram: '',
    twitter: '',
  });

  const categories = ['All', 'Direct OTA', 'Hotel Chain', 'Boutique Aggregator', 'Luxury Resort'];

  const filteredCompetitors = competitors.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleTracking = async (comp: Competitor, channel: keyof Competitor['trackingStatus']) => {
    try {
      const updatedStatus = { ...comp.trackingStatus, [channel]: !comp.trackingStatus[channel] };
      await onUpdateCompetitor(comp.id, { trackingStatus: updatedStatus });
      showToast('success', 'Tracking Updated', `Updated ${channel} monitoring for ${comp.name}.`);
    } catch (err) {
      showToast('error', 'Error', 'Failed to update tracking status.');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.domain || !formData.targetUrl) {
      showToast('error', 'Validation Error', 'Name, domain, and target URL are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddCompetitor({
        projectId: project.id,
        name: formData.name,
        domain: formData.domain,
        targetUrl: formData.targetUrl,
        category: formData.category,
        starRating: Number(formData.starRating),
        propertyCount: Number(formData.propertyCount),
        avgDailyRate: Number(formData.avgDailyRate),
        priceTier: formData.priceTier,
        socialHandles: {
          instagram: formData.instagram ? `@${formData.instagram.replace('@', '')}` : undefined,
          twitter: formData.twitter ? `@${formData.twitter.replace('@', '')}` : undefined,
        },
        trackingStatus: {
          website: true,
          pricing: true,
          keywords: true,
          social: true,
          advertising: true,
        },
      });
      showToast('success', 'Competitor Added', `Added ${formData.name} to project.`);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        domain: '',
        targetUrl: '',
        category: 'Direct OTA',
        starRating: 4.5,
        propertyCount: 1,
        avgDailyRate: 350,
        priceTier: '$$$',
        instagram: '',
        twitter: '',
      });
    } catch (err) {
      showToast('error', 'Error', 'Failed to add competitor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (comp: Competitor) => {
    if (confirm(`Remove competitor ${comp.name} from this project?`)) {
      try {
        await onDeleteCompetitor(comp.id);
        showToast('info', 'Competitor Removed', `Deleted ${comp.name}.`);
      } catch (err) {
        showToast('error', 'Error', 'Failed to delete competitor.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users2 className="w-5 h-5 text-indigo-600" />
            <span>Monitored Competitor Fleet</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Active hotel competitors in <span className="font-semibold text-slate-800">{project.name}</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsAIDiscoveryOpen(true)}
            leftIcon={<Sparkles className="w-4 h-4 text-indigo-500" />}
            className="border-indigo-200 hover:bg-indigo-50 text-indigo-700"
          >
            AI Discover
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Competitor
          </Button>
        </div>
      </div>

      <AICompetitorDiscoveryModal 
        isOpen={isAIDiscoveryOpen}
        onClose={() => setIsAIDiscoveryOpen(false)}
        projectId={project.id}
        onCompetitorsUpdated={() => {
          // Trigger a re-fetch of competitors by calling a passed prop or reloading
          // For now, we will just close the modal and let the parent handle the refresh
          setIsAIDiscoveryOpen(false);
          // Assuming the parent component re-fetches or we could just force a window reload for now
          window.location.reload(); 
        }}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Filter by competitor name or domain..."
          className="max-w-md"
        />

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Competitors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompetitors.map((comp) => (
          <Card key={comp.id} className="flex flex-col justify-between hover:border-slate-300">
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <img
                    src={comp.logoUrl}
                    alt={comp.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200/80 shadow-2xs"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {comp.name}
                    </h3>
                    <a
                      href={comp.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>{comp.domain}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

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
              </div>

              {/* Stats & Rating */}
              <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Rate</span>
                  <span className="text-xs font-bold text-slate-900">
                    {formatCurrency(comp.avgDailyRate, project.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Rating</span>
                  <span className="text-xs font-bold text-slate-900 flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {comp.starRating}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Properties</span>
                  <span className="text-xs font-bold text-slate-900">{comp.propertyCount}</span>
                </div>
              </div>

              {/* Channel Tracking Toggles */}
              <div className="py-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Active Crawler Pipeline
                </span>
                <div className="flex items-center justify-between space-x-1">
                  {[
                    { key: 'website' as const, label: 'Web', icon: Globe },
                    { key: 'pricing' as const, label: 'Rates', icon: DollarSign },
                    { key: 'keywords' as const, label: 'SEO', icon: Search },
                    { key: 'social' as const, label: 'Social', icon: Share2 },
                    { key: 'advertising' as const, label: 'Ads', icon: Megaphone },
                  ].map((ch) => {
                    const Icon = ch.icon;
                    const isEnabled = comp.trackingStatus[ch.key];
                    return (
                      <button
                        key={ch.key}
                        onClick={() => handleToggleTracking(comp, ch.key)}
                        title={`Toggle ${ch.label} tracking`}
                        className={`flex flex-col items-center p-1.5 rounded-xl border text-[10px] font-semibold transition-all cursor-pointer ${
                          isEnabled
                            ? 'bg-indigo-50/80 border-indigo-200 text-indigo-700'
                            : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 mb-0.5" />
                        <span>{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Crawled {formatTimeAgo(comp.lastCheckedAt)}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDelete(comp)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Competitor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTriggerScan(comp)}
                  isLoading={isScanning}
                  leftIcon={<RefreshCw className="w-3 h-3" />}
                >
                  Scan
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onSelectCompetitorDetail(comp)}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal: Add Competitor */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Monitored Competitor"
        description="Specify target hotel or OTA URL for Firecrawl real-time scrapers."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Competitor Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Taj Fort Aguada Resort & Spa"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Domain *
              </label>
              <input
                type="text"
                required
                placeholder="hyatt.com"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as any })
                }
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              >
                <option value="Direct OTA">Direct OTA</option>
                <option value="Hotel Chain">Hotel Chain</option>
                <option value="Boutique Aggregator">Boutique Aggregator</option>
                <option value="Luxury Resort">Luxury Resort</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Scraping URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://www.hyatt.com/en-US/hotel/..."
              value={formData.targetUrl}
              onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Est. Avg Daily Rate ($)
              </label>
              <input
                type="number"
                value={formData.avgDailyRate}
                onChange={(e) => setFormData({ ...formData, avgDailyRate: Number(e.target.value) })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Star Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.starRating}
                onChange={(e) => setFormData({ ...formData, starRating: Number(e.target.value) })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                placeholder="@hyatt"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Twitter/X Handle
              </label>
              <input
                type="text"
                placeholder="@hyatt"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Add Competitor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
