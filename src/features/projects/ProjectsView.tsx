import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Building2,
  Clock,
  Trash2,
  CheckCircle2,
  SlidersHorizontal,
  Globe2,
} from 'lucide-react';
import { Project } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '../../lib/utils';

export interface ProjectsViewProps {
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (project: Project) => void;
  onCreateProject: (data: Omit<Project, 'id' | 'createdAt' | 'lastScanAt' | 'competitorCount'>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
}) => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    currency: 'INR',
    scanFrequency: 'Daily' as 'Hourly' | 'Daily' | 'Weekly',
    status: 'Active' as 'Active' | 'Paused' | 'Scanning',
    businessType: 'Resort & Hospitality',
    country: 'United States',
    primaryDestinations: '',
    monitoringPreferences: {
      pricingParity: true,
      serpKeywords: true,
      websiteChanges: true,
      socialAds: true,
    },
    workspaceSettings: {
      autoReportWeekly: true,
      alertThresholdPct: 5,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      showToast('error', 'Validation Error', 'Please fill in required workspace name and location.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateProject({
        name: formData.name,
        description: formData.description || 'Travel business competitor monitoring campaign.',
        location: formData.location,
        currency: formData.currency,
        scanFrequency: formData.scanFrequency,
        status: formData.status,
        businessType: formData.businessType,
        country: formData.country,
        primaryDestinations: formData.primaryDestinations,
        monitoringPreferences: JSON.stringify(formData.monitoringPreferences),
        workspaceSettings: JSON.stringify(formData.workspaceSettings),
      });
      showToast('success', 'Workspace Created', `Created travel workspace "${formData.name}".`);
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        location: '',
        currency: 'INR',
        scanFrequency: 'Daily',
        status: 'Active',
        businessType: 'Resort & Hospitality',
        country: 'United States',
        primaryDestinations: '',
        monitoringPreferences: {
          pricingParity: true,
          serpKeywords: true,
          websiteChanges: true,
          socialAds: true,
        },
        workspaceSettings: {
          autoReportWeekly: true,
          alertThresholdPct: 5,
        },
      });
    } catch (err) {
      showToast('error', 'Error', 'Failed to create travel workspace.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (proj: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete workspace "${proj.name}"?`)) {
      try {
        await onDeleteProject(proj.id);
        showToast('info', 'Workspace Deleted', `Removed workspace ${proj.name}.`);
      } catch (err) {
        showToast('error', 'Error', 'Failed to delete workspace.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-600" />
            <span>Travel Intelligence Workspaces</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Organize competitor monitoring campaigns by geographic region, travel business segment, or workspace portfolio.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Travel Workspace
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const isActive = activeProject?.id === proj.id;
          return (
            <Card
              key={proj.id}
              hoverable
              onClick={() => onSelectProject(proj)}
              className={isActive ? 'ring-2 ring-slate-900 border-transparent shadow-md' : ''}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-slate-100 rounded-xl text-slate-800">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                      {proj.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                      <Globe2 className="w-3 h-3 text-slate-400" />
                      <span>{proj.location} {proj.country ? `• ${proj.country}` : ''}</span>
                    </p>
                  </div>
                </div>
                <Badge
                  variant={proj.status === 'Active' ? 'success' : proj.status === 'Scanning' ? 'info' : 'default'}
                  size="sm"
                >
                  {proj.status}
                </Badge>
              </div>

              <div className="mt-2 flex items-center gap-1.5">
                <Badge variant="default" size="sm">
                  {proj.businessType || 'Travel Workspace'}
                </Badge>
                {proj.primaryDestinations && (
                  <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                    Dest: {proj.primaryDestinations}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {proj.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Competitors</span>
                  <span className="font-semibold text-slate-900">{proj.competitorCount} monitored</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Frequency</span>
                  <span className="font-semibold text-slate-900">{proj.scanFrequency}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] text-slate-400">
                  Created {formatDate(proj.createdAt)}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleDelete(proj, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Workspace"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <Button
                    variant={isActive ? 'primary' : 'outline'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(proj);
                    }}
                  >
                    {isActive ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      'Switch To'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal: New Travel Workspace */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Travel Intelligence Workspace"
        description="Set up a new travel business intelligence workspace and competitor tracking group."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workspace Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Luxury APAC Resorts Set"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Type *
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              >
                <option value="Resort & Hospitality">Resort & Hospitality</option>
                <option value="Travel Agency">Travel Agency</option>
                <option value="Tour Operator">Tour Operator</option>
                <option value="Airline">Airline</option>
                <option value="Distribution Channel">Distribution Channel</option>
                <option value="E-Commerce Brand">E-Commerce Brand</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location / Region *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Goa, India"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                placeholder="e.g. United States, India, UK"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="SGD">SGD ($)</option>
                <option value="AUD">AUD ($)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Firecrawl Crawl Schedule
              </label>
              <select
                value={formData.scanFrequency}
                onChange={(e) =>
                  setFormData({ ...formData, scanFrequency: e.target.value as any })
                }
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              >
                <option value="Hourly">Hourly Crawlers</option>
                <option value="Daily">Daily Snapshot</option>
                <option value="Weekly">Weekly Deep Audit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Destinations
            </label>
            <input
              type="text"
              placeholder="e.g. Goa, Maldives, Dubai, Bali"
              value={formData.primaryDestinations}
              onChange={(e) => setFormData({ ...formData, primaryDestinations: e.target.value })}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Monitoring Preferences
            </label>
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.monitoringPreferences.pricingParity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monitoringPreferences: {
                        ...formData.monitoringPreferences,
                        pricingParity: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Package Price & Parity</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.monitoringPreferences.serpKeywords}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monitoringPreferences: {
                        ...formData.monitoringPreferences,
                        serpKeywords: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>SERP Keywords</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.monitoringPreferences.websiteChanges}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monitoringPreferences: {
                        ...formData.monitoringPreferences,
                        websiteChanges: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Website Changes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.monitoringPreferences.socialAds}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monitoringPreferences: {
                        ...formData.monitoringPreferences,
                        socialAds: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Social & Ads</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Workspace Settings
            </label>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.workspaceSettings.autoReportWeekly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workspaceSettings: {
                        ...formData.workspaceSettings,
                        autoReportWeekly: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Auto-generate weekly email reports</span>
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Alert threshold:</span>
                <select
                  value={formData.workspaceSettings.alertThresholdPct}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workspaceSettings: {
                        ...formData.workspaceSettings,
                        alertThresholdPct: Number(e.target.value),
                      },
                    })
                  }
                  className="h-7 px-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value={5}>5% disparity</option>
                  <option value={10}>10% disparity</option>
                  <option value={15}>15% disparity</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of the competitor travel set..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
