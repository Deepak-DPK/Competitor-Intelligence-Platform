import React, { useState } from 'react';
import {
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Mail,
  Copy,
  Check,
  Calendar,
  Layers,
  ArrowRight,
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
import { PricingDataPoint, PricingDisparity, Project, Competitor } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { formatCurrency, formatDate, formatTimeAgo } from '../../lib/utils';

export interface PricingMonitoringProps {
  project: Project;
  pricingTrends: PricingDataPoint[];
  disparities: PricingDisparity[];
  competitors: Competitor[];
}

export const PricingMonitoring: React.FC<PricingMonitoringProps> = ({
  project,
  pricingTrends,
  disparities,
  competitors,
}) => {
  const { showToast } = useToast();
  const [selectedDisparity, setSelectedDisparity] = useState<PricingDisparity | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpenDisputeEmail = (disp: PricingDisparity) => {
    setSelectedDisparity(disp);
    setIsEmailModalOpen(true);
  };

  const emailDraftText = selectedDisparity
    ? `Subject: URGENT: Rate Disparity Violation Notice - ${selectedDisparity.channel} (${selectedDisparity.checkInDate})\n\nDear Partner Account Manager,\n\nOur revenue monitoring engine detected an unauthorized rate disparity on ${selectedDisparity.channel} for check-in date ${formatDate(selectedDisparity.checkInDate)}.\n\nRoom Type: ${selectedDisparity.roomType}\nOur Direct Rate: ${formatCurrency(selectedDisparity.ourRate, project.currency)}\n${selectedDisparity.channel} Displayed Rate: ${formatCurrency(selectedDisparity.competitorRate, project.currency)} (Disparity: -${selectedDisparity.disparityPercentage.toFixed(1)}%)\n\nPlease immediately rectify this pricing rate undercut to align with our contracted Rate Parity Agreement.\n\nBest regards,\nRevenue Management Team`
    : '';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailDraftText);
    setCopied(true);
    showToast('success', 'Email Copied', 'Dispute notice copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <span>Pricing Parity & Rate Undercut Engine</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time channel disparity tracking across OTA partners and direct competitor rates.
          </p>
        </div>
      </div>

      {/* ADR Comparison Chart */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>7-Day Average Daily Rate (ADR) Trajectory</CardTitle>
            <CardDescription>Direct hotel rate vs Booking.com and Expedia member rates ({project.currency})</CardDescription>
          </div>
        </CardHeader>

        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pricingTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="directGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="otaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={['dataMin - 20', 'dataMax + 20']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="ourRate" name="Our Direct Site" stroke="#0f172a" strokeWidth={3} fillOpacity={1} fill="url(#directGrad)" />
              <Area type="monotone" dataKey="competitors.comp_booking_com" name="Booking.com Hub" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#otaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Disparity Matrix Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Active Rate Disparities</CardTitle>
            <CardDescription>OTA channels pricing below agreed direct rate baseline</CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">OTA Channel</th>
                <th className="py-2.5 px-3">Check-In Date</th>
                <th className="py-2.5 px-3">Room Category</th>
                <th className="py-2.5 px-3">Our Direct</th>
                <th className="py-2.5 px-3">OTA Rate</th>
                <th className="py-2.5 px-3">Undercut %</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {disparities.map((disp) => {
                const isNegativeDisparity = disp.disparityAmount > 0;
                return (
                  <tr key={disp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{disp.channel}</td>
                    <td className="py-3 px-3 text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatDate(disp.checkInDate)}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{disp.roomType}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {formatCurrency(disp.ourRate, project.currency)}
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-700">
                      {formatCurrency(disp.competitorRate, project.currency)}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={isNegativeDisparity ? 'danger' : 'success'} size="sm">
                        {isNegativeDisparity ? `-${disp.disparityPercentage.toFixed(1)}%` : `+${Math.abs(disp.disparityPercentage).toFixed(1)}%`}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDisputeEmail(disp)}
                        leftIcon={<Mail className="w-3 h-3" />}
                      >
                        Dispute Email
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Rate Dispute Draft Generator */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Parity Dispute Email Notice"
        description="Auto-generated formal email notice to send to your OTA Account Manager."
      >
        <div className="space-y-4">
          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-64 overflow-y-auto">
            {emailDraftText}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">Includes check-in date & room type evidence</span>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEmailModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCopyEmail}
                leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copied ? 'Copied!' : 'Copy Email Draft'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
