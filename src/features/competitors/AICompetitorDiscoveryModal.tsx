import React, { useState, useEffect } from 'react';
import { X, Sparkles, Target, Check, Search, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { apiService } from '../../services/api';

interface AICompetitorDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onCompetitorsUpdated: () => void;
}

type Step = 'input' | 'analyzing' | 'discovering' | 'review';

export const AICompetitorDiscoveryModal: React.FC<AICompetitorDiscoveryModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onCompetitorsUpdated,
}) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>('input');
  const [website, setWebsite] = useState('');
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setWebsite('');
      setCompanyProfile(null);
      setSuggestions([]);
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!website) {
      showToast('error', 'Error', 'Please enter your hotel website URL.');
      return;
    }

    setStep('analyzing');
    setIsProcessing(true);

    try {
      const profile = await apiService.analyzeCompany(projectId, website);
      setCompanyProfile(profile);
      setStep('discovering');
      
      await handleDiscover();
    } catch (error) {
      console.error(error);
      showToast('error', 'Analysis Failed', 'Could not analyze the company profile. Please try again.');
      setStep('input');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDiscover = async () => {
    setIsProcessing(true);
    try {
      await apiService.discoverCompetitors(projectId);
      const pendingSuggestions = await apiService.getPendingSuggestions(projectId);
      setSuggestions(pendingSuggestions);
      setStep('review');
    } catch (error) {
      console.error(error);
      showToast('error', 'Discovery Failed', 'Failed to discover competitors.');
      setStep('input');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async (suggestionId: string) => {
    try {
      await apiService.approveSuggestion(suggestionId);
      showToast('success', 'Competitor Added', 'Successfully added to your monitored fleet.');
      setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
      onCompetitorsUpdated();
    } catch (error) {
      console.error(error);
      showToast('error', 'Approval Failed', 'Could not approve this suggestion.');
    }
  };

  const handleReject = async (suggestionId: string) => {
    try {
      await apiService.rejectSuggestion(suggestionId);
      setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    } catch (error) {
      console.error(error);
      showToast('error', 'Rejection Failed', 'Could not reject this suggestion.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">AI Competitor Discovery</h3>
              <p className="text-xs text-slate-500">Automatically find relevant competitors for your hotel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          
          {step === 'input' && (
            <div className="space-y-6 max-w-xl mx-auto py-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800">What is your hotel's website?</h4>
                <p className="text-sm text-slate-500">
                  Enter your domain and our AI will analyze your market positioning to find your closest direct and indirect competitors.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourhotel.com"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                  />
                </div>
                <Button
                  variant="primary"
                  className="w-full py-3"
                  onClick={handleAnalyze}
                  disabled={!website || isProcessing}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Analyze & Discover
                </Button>
              </div>
            </div>
          )}

          {(step === 'analyzing' || step === 'discovering') && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-white p-4 rounded-full border-2 border-indigo-100 shadow-sm text-indigo-600">
                  <Search className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-slate-800">
                  {step === 'analyzing' ? 'Analyzing your hotel profile...' : 'Discovering market competitors...'}
                </h4>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  {step === 'analyzing' 
                    ? 'Our AI is extracting keywords, category, and market positioning from your website.' 
                    : 'Searching across web directories, OTAs, and social networks for hotels matching your profile.'}
                </p>
              </div>
              <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-1/2 animate-pulse transition-all duration-500"></div>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-6">
              {companyProfile && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">Analyzed Profile</h4>
                      <p className="text-xs text-slate-500">
                        {companyProfile.industry || 'Hospitality'} • {companyProfile.category || 'Hotel'}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-medium">
                    {suggestions.length} competitors found
                  </div>
                </div>
              )}

              {suggestions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                  <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-medium text-slate-700">No suggestions pending</h4>
                  <p className="text-xs text-slate-500 mt-1">We couldn't find any direct competitors matching this profile.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900">{suggestion.competitor_name}</h4>
                            <div className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-700">
                              {Math.round(suggestion.confidence_score * 100)}% Match
                            </div>
                          </div>
                          {suggestion.website && (
                            <a href={suggestion.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                              {suggestion.website}
                            </a>
                          )}
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                            {suggestion.reason}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(suggestion.id)}
                            className="text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                          >
                            Reject
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(suggestion.id)}
                            leftIcon={<Check className="w-4 h-4" />}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          {step === 'review' && (
            <Button variant="outline" onClick={onClose}>
              Done Reviewing
            </Button>
          )}
          {step === 'input' && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
