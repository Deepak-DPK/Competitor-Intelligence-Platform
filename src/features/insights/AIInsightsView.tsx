import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Send,
  Zap,
} from 'lucide-react';
import { AIInsight, Project } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { formatTimeAgo } from '../../lib/utils';

export interface AIInsightsViewProps {
  project: Project;
  insights: AIInsight[];
  onGenerateInsight: (promptQuery?: string) => Promise<void>;
  isGenerating: boolean;
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({
  project,
  insights,
  onGenerateInsight,
  isGenerating,
}) => {
  const { showToast } = useToast();
  const [customPrompt, setCustomPrompt] = useState('');
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    try {
      await onGenerateInsight(customPrompt);
      showToast('success', 'Apex AI Strategy Generated', 'Created new competitive analysis report.');
      setCustomPrompt('');
    } catch (err) {
      showToast('error', 'AI Generation Failed', 'Could not run strategic analysis.');
    }
  };

  const toggleAction = (insightId: string, idx: number) => {
    const key = `${insightId}_${idx}`;
    setCheckedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>AI Summary & Competitor Change Intelligence (Gemini)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated Gemini AI summaries of package price drops, new travel packages, removed packages, and recommended actions.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => onGenerateInsight()}
          isLoading={isGenerating}
          leftIcon={<Zap className="w-4 h-4 text-amber-300" />}
        >
          Generate AI Summary
        </Button>
      </div>

      {/* Interactive AI Prompt Input Bar */}
      <Card className="bg-slate-900 text-white p-4 shadow-lg border border-slate-800">
        <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Sparkles className="absolute left-3.5 top-3 w-4 h-4 text-indigo-400 pointer-events-none" />
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ask Gemini AI (e.g. 'Summarize package price drops and new packages added across competitors')..."
              className="w-full h-10 pl-10 pr-4 bg-slate-800/80 text-xs text-white placeholder:text-slate-400 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-400 transition-all"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isGenerating}
            rightIcon={<Send className="w-3.5 h-3.5" />}
            className="bg-indigo-600 hover:bg-indigo-500 border-indigo-600 text-white shrink-0"
          >
            Generate Strategy
          </Button>
        </form>
      </Card>

      {/* MODULE 6: Gemini Executive Scan Summary */}
      <Card className="p-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white border-indigo-800/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="text-sm font-bold tracking-tight text-white uppercase">
              Gemini Executive Scan Summary
            </h3>
          </div>
          <Badge variant="success" size="sm">Real-time AI Synthesis</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold uppercase text-amber-300 block mb-1">Price Drops</span>
            <p className="text-xs font-semibold text-white">3 packages dropped prices</p>
            <p className="text-[11px] text-slate-300 mt-1">MakeMyTrip lowered Goa Golden Sands by Rs.2,500 (-11.9%)</p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold uppercase text-emerald-300 block mb-1">New Packages Added</span>
            <p className="text-xs font-semibold text-white">2 seasonal packages launched</p>
            <p className="text-[11px] text-slate-300 mt-1">Booking.com Hub introduced Royal Rajasthan Heritage Circuit</p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold uppercase text-rose-300 block mb-1">Removed Packages</span>
            <p className="text-xs font-semibold text-white">1 package discontinued</p>
            <p className="text-[11px] text-slate-300 mt-1">MakeMyTrip removed Andaman Coral Reef Holiday package</p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold uppercase text-indigo-300 block mb-1">Recommended Actions</span>
            <p className="text-xs font-semibold text-white">2 priority actions</p>
            <p className="text-[11px] text-slate-300 mt-1">Match Rs.18,500 rate on direct booking portal with free airport transfer</p>
          </div>
        </div>
      </Card>

      {/* AI Insights List */}
      <div className="space-y-5">
        {insights.map((insight) => (
          <Card key={insight.id} className="p-6 border-slate-200/80 hover:border-slate-300 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    insight.type === 'threat'
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : insight.type === 'opportunity'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                  }`}
                >
                  {insight.type === 'threat' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : insight.type === 'opportunity' ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <Target className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        insight.type === 'threat'
                          ? 'danger'
                          : insight.type === 'opportunity'
                          ? 'success'
                          : 'purple'
                      }
                      size="sm"
                    >
                      {insight.category}
                    </Badge>
                    <span className="text-[11px] text-slate-400">
                      {formatTimeAgo(insight.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight mt-1">
                    {insight.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold uppercase text-slate-500">Impact Score</span>
                <span className="text-sm font-black text-slate-900">{insight.impactScore}/100</span>
              </div>
            </div>

            {/* Summary & Analysis */}
            <div className="mt-4 space-y-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                  {insight.summary}
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {insight.detailedAnalysis}
                </p>
              </div>

              {/* Recommended Action Items */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Actionable Counter-Strategies
                </h4>
                <div className="space-y-2">
                  {insight.recommendedActions.map((action, idx) => {
                    const key = `${insight.id}_${idx}`;
                    const isDone = checkedActions[key];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleAction(insight.id, idx)}
                        className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-200 text-slate-500 line-through'
                            : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-800'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isDone ? 'text-emerald-600' : 'text-slate-300'
                          }`}
                        />
                        <span className="text-xs font-medium leading-relaxed">{action}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
