import React, { useState } from 'react';
import {
  FileText,
  Download,
  Mail,
  Calendar,
  Check,
  Plus,
  Printer,
  Sparkles,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { ReportConfig, Project, Competitor, PricingDataPoint } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '../../lib/utils';

export interface ReportsViewProps {
  project: Project;
  reports: ReportConfig[];
  competitors: Competitor[];
  onCreateReport: (data: Omit<ReportConfig, 'id'>) => Promise<void>;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  project,
  reports,
  competitors,
  onCreateReport,
}) => {
  const { showToast } = useToast();
  const [selectedReport, setSelectedReport] = useState<ReportConfig | null>(reports[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    dateRange: '7d' as ReportConfig['dateRange'],
    schedule: 'Weekly Email' as ReportConfig['schedule'],
    recipients: 'alex.rivera@grandhotelgroup.com',
    pricing: true,
    seo: true,
    website: true,
    ads: true,
    aiInsights: true,
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast('error', 'Validation Error', 'Report title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateReport({
        projectId: project.id,
        title: formData.title,
        dateRange: formData.dateRange,
        includeSections: {
          pricing: formData.pricing,
          seo: formData.seo,
          website: formData.website,
          ads: formData.ads,
          aiInsights: formData.aiInsights,
        },
        schedule: formData.schedule,
        recipients: formData.recipients.split(',').map((s) => s.trim()),
      });
      showToast('success', 'Report Scheduled', `Configured executive report "${formData.title}".`);
      setIsModalOpen(false);
      setFormData({
        title: '',
        dateRange: '7d',
        schedule: 'Weekly Email',
        recipients: 'alex.rivera@grandhotelgroup.com',
        pricing: true,
        seo: true,
        website: true,
        ads: true,
        aiInsights: true,
      });
    } catch (err) {
      showToast('error', 'Error', 'Failed to create report configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportPDF = () => {
    showToast('info', 'Exporting Report', 'Generating executive PDF document preview...');
    setTimeout(() => {
      window.print();
    }, 600);
  };

  const handleExportCSV = (reportType: string) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Report Type,Competitor,Package Name,Price,Discount,Date\n"
      + `${reportType},MakeMyTrip,Goa Golden Sands Getaway,18500,15%,2026-07-27\n`
      + `${reportType},EaseMyTrip,Kerala Backwaters Luxury Tour,24000,20%,2026-07-27\n`
      + `${reportType},Booking.com Hub,Royal Rajasthan Heritage Circuit,38000,10%,2026-07-27\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType.toLowerCase().replace(/\s+/g, '_')}_2026-07-27.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'CSV Exported', `Downloaded ${reportType} as CSV file.`);
  };

  const handleExportReportPDF = (reportType: string) => {
    showToast('info', 'PDF Export Started', `Generating ${reportType} in PDF format...`);
    setTimeout(() => {
      window.print();
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Executive Reports & Intelligence Digests</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated PDF summaries and scheduled weekly email digests for hotel leadership.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF} leftIcon={<Printer className="w-4 h-4" />}>
            Print / PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Schedule New Report
          </Button>
        </div>
      </div>

      {/* MODULE 7: Instant Executive Report Exports */}
      <Card className="p-4 bg-slate-50 border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Instant Report Export Engine (PDF / CSV)</span>
            </h3>
            <p className="text-xs text-slate-500">
              One-click export of Competitor Price Report, Website Change Report, and AI Executive Summary.
            </p>
          </div>
          <Badge variant="primary" size="sm">Export Ready</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Travel Pricing</span>
              <h4 className="text-xs font-bold text-slate-900">Competitor Price Report</h4>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
              <Button size="sm" variant="outline" className="flex-1 text-[11px]" onClick={() => handleExportReportPDF('Competitor Price Report')}>
                PDF
              </Button>
              <Button size="sm" variant="primary" className="flex-1 text-[11px]" onClick={() => handleExportCSV('Competitor Price Report')}>
                CSV
              </Button>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Monitoring Log</span>
              <h4 className="text-xs font-bold text-slate-900">Website Change Report</h4>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
              <Button size="sm" variant="outline" className="flex-1 text-[11px]" onClick={() => handleExportReportPDF('Website Change Report')}>
                PDF
              </Button>
              <Button size="sm" variant="primary" className="flex-1 text-[11px]" onClick={() => handleExportCSV('Website Change Report')}>
                CSV
              </Button>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Gemini Synthesis</span>
              <h4 className="text-xs font-bold text-slate-900">AI Executive Summary</h4>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
              <Button size="sm" variant="outline" className="flex-1 text-[11px]" onClick={() => handleExportReportPDF('AI Executive Summary')}>
                PDF
              </Button>
              <Button size="sm" variant="primary" className="flex-1 text-[11px]" onClick={() => handleExportCSV('AI Executive Summary')}>
                CSV
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scheduled Reports List Column */}
        <div className="lg:col-span-5 space-y-3">
          <CardHeader>
            <div>
              <CardTitle>Configured Report Schedule</CardTitle>
              <CardDescription>Scheduled digests for active project</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-3">
            {reports.map((rep) => {
              const isSelected = selectedReport?.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {rep.title}
                    </span>
                    <Badge variant={isSelected ? 'outline' : 'info'} size="sm">
                      {rep.schedule}
                    </Badge>
                  </div>

                  <div className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    Range: {rep.dateRange.toUpperCase()} • Recipients: {rep.recipients.join(', ')}
                  </div>

                  <div className={`text-[10px] mt-2 pt-2 border-t ${isSelected ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-400'}`}>
                    Last generated {rep.lastGeneratedAt ? formatDate(rep.lastGeneratedAt) : 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Executive Document Preview Column */}
        <div className="lg:col-span-7">
          {selectedReport ? (
            <Card className="p-8 border border-slate-300/80 shadow-md bg-white space-y-6">
              {/* Document Header */}
              <div className="flex items-start justify-between pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                    <Building2 className="w-4 h-4" />
                    <span>Executive Intelligence Briefing</span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-900">{selectedReport.title}</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Project Scope: {project.name} ({project.location}) • Date Range: {selectedReport.dateRange.toUpperCase()}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Generated On</span>
                  <span className="text-xs font-bold text-slate-800">
                    {formatDate(selectedReport.lastGeneratedAt || new Date().toISOString())}
                  </span>
                </div>
              </div>

              {/* Competitor Set Summary Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Monitored Fleet Snapshot
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Competitors</span>
                    <span className="text-sm font-bold text-slate-900">{competitors.length} Monitored</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Schedule</span>
                    <span className="text-sm font-bold text-slate-900">{selectedReport.schedule}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                    <span className="text-sm font-bold text-emerald-600">Active</span>
                  </div>
                </div>
              </div>

              {/* Sections Included Checklist */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Report Modules Included
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedReport.includeSections).map(([sec, isInc]) => (
                    <div
                      key={sec}
                      className={`flex items-center space-x-2 p-2.5 rounded-xl border ${
                        isInc ? 'bg-indigo-50/60 border-indigo-200 text-slate-900' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${isInc ? 'text-indigo-600' : 'text-slate-300'}`} />
                      <span className="font-semibold uppercase text-[11px]">{sec} Analysis</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipients */}
              <div className="pt-4 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900">Configured Email Recipients: </span>
                  <span>{selectedReport.recipients.join(', ')}</span>
                </div>
                <Button variant="primary" size="sm" onClick={handleExportPDF} leftIcon={<Download className="w-3.5 h-3.5" />}>
                  Download PDF
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12 text-slate-400 text-xs">
              Select a report from the schedule list to inspect document layout.
            </Card>
          )}
        </div>
      </div>

      {/* Modal: Create Report Schedule */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Executive Report"
        description="Automate recurring intelligence email digests for leadership teams."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Report Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Weekly Rate Parity & Competitor Audit"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date Range
              </label>
              <select
                value={formData.dateRange}
                onChange={(e) => setFormData({ ...formData, dateRange: e.target.value as any })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="ytd">Year to Date (YTD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Schedule
              </label>
              <select
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value as any })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              >
                <option value="Manual">Manual On-Demand</option>
                <option value="Weekly Email">Weekly Email Digest</option>
                <option value="Monthly PDF">Monthly PDF Report</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recipients (comma separated)
            </label>
            <input
              type="text"
              placeholder="alex.rivera@grandhotelgroup.com, gm@grandhotelgroup.com"
              value={formData.recipients}
              onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Schedule Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
