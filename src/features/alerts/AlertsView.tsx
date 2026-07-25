import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Trash2,
  ExternalLink,
  Filter,
  CheckCheck,
} from 'lucide-react';
import { AlertItem, Project } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatTimeAgo } from '../../lib/utils';

export interface AlertsViewProps {
  project: Project;
  alerts: AlertItem[];
  onMarkAsRead: (alertId: string) => Promise<void>;
  onClearAllAlerts: () => Promise<void>;
  onNavigate: (nav: any) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  project,
  alerts,
  onMarkAsRead,
  onClearAllAlerts,
  onNavigate,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');

  const severities = ['All', 'critical', 'warning', 'info'];

  const filteredAlerts = alerts.filter(
    (a) => selectedSeverity === 'All' || a.severity === selectedSeverity
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>Alerts & Real-Time Threat Feed</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated notifications for pricing undercuts, page edits, and competitor ad launches.
          </p>
        </div>

        {alerts.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAllAlerts}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear All Alerts
          </Button>
        )}
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center space-x-2">
        {severities.map((sev) => (
          <button
            key={sev}
            onClick={() => setSelectedSeverity(sev)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer ${
              selectedSeverity === sev
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card className="text-center py-12 text-slate-400 text-xs">
            No active alerts matching selected severity.
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`p-4 transition-all border ${
                !alert.isRead ? 'bg-amber-50/20 border-amber-200/80' : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-100 text-rose-700'
                        : alert.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    {alert.severity === 'critical' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                      <Badge
                        variant={
                          alert.severity === 'critical'
                            ? 'danger'
                            : alert.severity === 'warning'
                            ? 'warning'
                            : 'info'
                        }
                        size="sm"
                      >
                        {alert.category}
                      </Badge>
                      {!alert.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
                    <div className="text-[10px] text-slate-400 mt-1.5 flex items-center space-x-2">
                      <span>{alert.competitorName}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  {!alert.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(alert.id)}
                      leftIcon={<CheckCheck className="w-3.5 h-3.5 text-slate-500" />}
                    >
                      Mark Read
                    </Button>
                  )}

                  {alert.actionUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onMarkAsRead(alert.id);
                        if (alert.category === 'Pricing') onNavigate('pricing');
                        else if (alert.category === 'Website') onNavigate('website');
                        else if (alert.category === 'Ads') onNavigate('social-ads');
                        else onNavigate('dashboard');
                      }}
                      rightIcon={<ExternalLink className="w-3 h-3" />}
                    >
                      Inspect
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
