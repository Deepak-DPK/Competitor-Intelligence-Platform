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
  Tag,
  MapPin,
  Clock,
  PlusCircle,
  MinusCircle,
  ExternalLink,
  RefreshCw,
  Sparkles,
  TrendingUp,
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
import { PricingDataPoint, PricingDisparity, Project, Competitor, TravelPackage, PackageComparisonItem } from '../../types';
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
  const [selectedCompetitorFilter, setSelectedCompetitorFilter] = useState<string>('All');

  const defaultExtractedPackages: TravelPackage[] = [
    {
      id: 'pkg-1',
      competitorId: 'comp-1',
      competitorName: 'MakeMyTrip',
      packageName: 'Goa Golden Sands Getaway',
      destination: 'Goa, India',
      duration: '4 Days / 3 Nights',
      price: 18500,
      discount: 15,
      inclusions: ['5-Star Resort stay', 'Breakfast included', 'Airport transfers', 'Sunset Cruise'],
      bookingUrl: 'https://www.makemytrip.com/packages/goa',
      lastScannedAt: new Date().toISOString(),
    },
    {
      id: 'pkg-2',
      competitorId: 'comp-2',
      competitorName: 'EaseMyTrip',
      packageName: 'Kerala Backwaters Luxury Tour',
      destination: 'Alleppey & Munnar',
      duration: '5 Days / 4 Nights',
      price: 24000,
      discount: 20,
      inclusions: ['Houseboat Stay', 'All Meals', 'Ayurvedic Spa Session', 'Private Cab'],
      bookingUrl: 'https://www.easemytrip.com/packages/kerala',
      lastScannedAt: new Date().toISOString(),
    },
    {
      id: 'pkg-3',
      competitorId: 'comp-3',
      competitorName: 'Booking.com Hub',
      packageName: 'Royal Rajasthan Heritage Circuit',
      destination: 'Jaipur & Udaipur',
      duration: '6 Days / 5 Nights',
      price: 38000,
      discount: 10,
      inclusions: ['Premium Accommodation', 'Guided City Tours', 'Gourmet Dining', 'Luxury Transfers'],
      bookingUrl: 'https://www.booking.com/packages/rajasthan',
      lastScannedAt: new Date().toISOString(),
    },
  ];

  const defaultComparisons: PackageComparisonItem[] = [
    {
      id: 'comp-item-1',
      packageName: 'Goa Golden Sands Getaway',
      competitorName: 'MakeMyTrip',
      changeType: 'price_change',
      previousValue: 'Rs.21,000',
      currentValue: 'Rs.18,500',
      changePercentage: -11.9,
      detectedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'comp-item-2',
      packageName: 'Kerala Backwaters Luxury Tour',
      competitorName: 'EaseMyTrip',
      changeType: 'discount_change',
      previousValue: '10% OFF',
      currentValue: '20% OFF',
      changePercentage: 10.0,
      detectedAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'comp-item-3',
      packageName: 'Royal Rajasthan Heritage Circuit',
      competitorName: 'Booking.com Hub',
      changeType: 'new_package',
      previousValue: 'Not Available',
      currentValue: 'Rs.38,000',
      detectedAt: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: 'comp-item-4',
      packageName: 'Andaman Coral Reef Holiday',
      competitorName: 'MakeMyTrip',
      changeType: 'removed_package',
      previousValue: 'Rs.45,000',
      currentValue: 'Removed from site',
      detectedAt: new Date(Date.now() - 28800000).toISOString(),
    },
  ];

  const filteredPackages = selectedCompetitorFilter === 'All'
    ? defaultExtractedPackages
    : defaultExtractedPackages.filter(p => p.competitorName === selectedCompetitorFilter);

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
            <CardTitle>7-Day Package Price & Parity Trajectory</CardTitle>
            <CardDescription>Direct travel business package price vs distribution channel member prices ({project.currency})</CardDescription>
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

      {/* MODULE 3: Extracted Competitor Travel Packages */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                <span>Extracted Competitor Travel Packages</span>
              </CardTitle>
              <CardDescription>Live package names, destinations, duration, pricing, discount %, inclusions, and booking URLs</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter:</span>
              <select
                value={selectedCompetitorFilter}
                onChange={(e) => setSelectedCompetitorFilter(e.target.value)}
                className="h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800"
              >
                <option value="All">All Competitors</option>
                <option value="MakeMyTrip">MakeMyTrip</option>
                <option value="EaseMyTrip">EaseMyTrip</option>
                <option value="Booking.com Hub">Booking.com Hub</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Competitor</th>
                <th className="py-2.5 px-3">Package Name</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Price & Discount</th>
                <th className="py-2.5 px-3">Inclusions</th>
                <th className="py-2.5 px-3 text-right">Booking URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{pkg.competitorName}</td>
                  <td className="py-3 px-3 font-semibold text-indigo-950">{pkg.packageName}</td>
                  <td className="py-3 px-3 text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{pkg.destination}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {pkg.duration}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Rs.{pkg.price.toLocaleString()}</span>
                      {pkg.discount > 0 && (
                        <Badge variant="success" size="sm">{pkg.discount}% OFF</Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {pkg.inclusions.map((inc, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                          {inc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={pkg.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <span>Booking URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODULE 4: Package Comparison (Current vs Previous Scan) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span>Scan Comparison: Current vs Previous Scan</span>
              </CardTitle>
              <CardDescription>Automated detection of price changes, discount changes, new packages, and removed packages</CardDescription>
            </div>
            <Badge variant="primary" size="sm">Live Parity Delta</Badge>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {defaultComparisons.map((item) => {
            const isPrice = item.changeType === 'price_change';
            const isDiscount = item.changeType === 'discount_change';
            const isNew = item.changeType === 'new_package';
            const isRemoved = item.changeType === 'removed_package';

            return (
              <div key={item.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.competitorName}
                    </span>
                    <Badge
                      variant={isNew ? 'success' : isRemoved ? 'danger' : isDiscount ? 'primary' : 'warning'}
                      size="sm"
                    >
                      {isNew ? 'New Package' : isRemoved ? 'Removed Package' : isDiscount ? 'Discount Change' : 'Price Change'}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{item.packageName}</h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Previous Scan</span>
                    <span className="font-semibold text-slate-500 line-through">{item.previousValue}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Current Scan</span>
                    <span className={`font-bold ${isRemoved ? 'text-rose-600' : isNew ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {item.currentValue}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Disparity Matrix Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Active Price Disparities</CardTitle>
            <CardDescription>Distribution channels pricing below agreed direct price baseline</CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Distribution Channel</th>
                <th className="py-2.5 px-3">Check-In Date</th>
                <th className="py-2.5 px-3">Package Category</th>
                <th className="py-2.5 px-3">Our Direct</th>
                <th className="py-2.5 px-3">Channel Price</th>
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
