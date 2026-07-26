import React, { useState } from 'react';
import {
  Settings,
  Key,
  Bell,
  Cpu,
  Shield,
  Save,
  Check,
  RefreshCw,
} from 'lucide-react';
import { SystemStatus, Project } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

export interface SettingsViewProps {
  project: Project;
  systemStatus: SystemStatus | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  project,
  systemStatus,
}) => {
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    scanFrequency: project.scanFrequency,
    concurrency: '4 Nodes',
    firecrawlDepth: 'Real-Time Markdown & HTML Diff',
    proxyRotation: true,
    slackWebhook: 'https://hooks.slack.com/services/T00/B00/XXXX',
    emailAlerts: true,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('success', 'Settings Saved', 'Updated crawler configurations & API keys.');
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <span>Settings & Firecrawl Pipeline</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure Firecrawl real-time web scrapers and Apex Intelligence Engine models.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Playwright Crawler Settings */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                Firecrawl Scraping Engine
              </CardTitle>
              <CardDescription>Real-time web extraction & screenshot diffs</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-4 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Crawl Schedule Interval
                </label>
                <select
                  value={settings.scanFrequency}
                  onChange={(e) => setSettings({ ...settings, scanFrequency: e.target.value as any })}
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                >
                  <option value="Hourly">Hourly Automated Crawl</option>
                  <option value="Daily">Daily Snapshot Sync</option>
                  <option value="Weekly">Weekly Deep Audit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Firecrawl Worker Concurrency
                </label>
                <select
                  value={settings.concurrency}
                  onChange={(e) => setSettings({ ...settings, concurrency: e.target.value })}
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                >
                  <option value="2 Nodes">2 Parallel Workers</option>
                  <option value="4 Nodes">4 Parallel Workers (Recommended)</option>
                  <option value="8 Nodes">8 High-Speed Parallel Nodes</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Residential Proxy Rotation</span>
                <span className="text-[11px] text-slate-500">
                  Rotates residential IPs per request to prevent rate limiting on OTA sites.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.proxyRotation}
                onChange={(e) => setSettings({ ...settings, proxyRotation: e.target.checked })}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
              />
            </div>
          </div>
        </Card>

        {/* AI & Jina Reader Settings */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600" />
                Firecrawl API & Apex AI Engine Integration
              </CardTitle>
              <CardDescription>Clean Markdown HTML extraction and real-time intelligence</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-4 mt-3">
            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono space-y-1">
              <div>Apex AI Engine: Active (v2.5)</div>
              <div>Firecrawl Latency: 220ms</div>
              <div>Environment Variable: FIRECRAWL_API_KEY (Server-Side Injected)</div>
            </div>
          </div>
        </Card>

        {/* Notifications & Webhooks */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600" />
                Real-Time Webhooks & Notifications
              </CardTitle>
              <CardDescription>Instant alerts for rate parity violations and website changes</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-4 mt-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Slack Webhook URL
              </label>
              <input
                type="url"
                value={settings.slackWebhook}
                onChange={(e) => setSettings({ ...settings, slackWebhook: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
