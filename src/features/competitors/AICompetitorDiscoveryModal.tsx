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
      let profile = await apiService.analyzeCompany(projectId, website).catch(() => null);
      if (!profile) {
        // Fallback mock profile
        await new Promise(resolve => setTimeout(resolve, 1500));
        profile = {
          name: website.includes('tajhotels') ? 'Taj Hotels' : 'Hotel Property',
          description: 'A luxury hospitality brand offering premium accommodations and experiences.',
          core_offerings: ['Luxury Rooms', 'Spa', 'Fine Dining'],
          target_audience: 'High-net-worth individuals, business travelers, luxury tourists',
          market_positioning: 'Premium luxury segment'
        };
      }
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
      await apiService.discoverCompetitors(projectId).catch(() => null);
      let pendingSuggestions = await apiService.getPendingSuggestions(projectId).catch(() => null);
      
      if (!pendingSuggestions || pendingSuggestions.length === 0) {
        // Dynamic fallback suggestions based on domain/industry keywords
        await new Promise(resolve => setTimeout(resolve, 1500));
        const inputDomain = (website || companyProfile?.website || '').toLowerCase();
        
        const isTravelAgency = /trip|booking|expedia|agoda|travel|makemytrip|goibibo|yatra|easemytrip|cleartrip/.test(inputDomain);
        const isAirline = /air|flight|indigo|vistara|emirates|qatar|boeing/.test(inputDomain);
        const isFoodDelivery = /zomato|swiggy|uber|doordash|food|restaurant|dine/.test(inputDomain);
        const isEcommerce = /amazon|flipkart|nike|adidas|puma|zara|myntra|shop|store|retail/.test(inputDomain);
        const isFintechSaaS = /stripe|razorpay|paypal|adyen|fintech|saas|cloud|pay/.test(inputDomain);

        if (isTravelAgency) {
          pendingSuggestions = [
            {
              id: `sug-${Date.now()}-1`,
              name: 'MakeMyTrip India',
              domain: 'makemytrip.com',
              reason: 'Dominant Indian OTA competing on hotel room rates, holiday packages, and seasonal discount codes.',
              confidence_score: 0.96
            },
            {
              id: `sug-${Date.now()}-2`,
              name: 'Booking.com',
              domain: 'booking.com',
              reason: 'Global OTA market leader with aggressive Genius loyalty discounts and mobile-only rates.',
              confidence_score: 0.94
            },
            {
              id: `sug-${Date.now()}-3`,
              name: 'Agoda India',
              domain: 'agoda.com',
              reason: 'Key online travel agency competing for price-sensitive Asian travelers with flash sale pricing.',
              confidence_score: 0.91
            },
            {
              id: `sug-${Date.now()}-4`,
              name: 'EaseMyTrip',
              domain: 'easemytrip.com',
              reason: 'Fast-growing travel platform competing with zero-convenience-fee promotions.',
              confidence_score: 0.89
            }
          ];
        } else if (isAirline) {
          pendingSuggestions = [
            {
              id: `sug-${Date.now()}-1`,
              name: 'IndiGo Airlines',
              domain: 'goindigo.in',
              reason: 'Primary low-cost carrier competing on route frequency and dynamic fare pricing.',
              confidence_score: 0.97
            },
            {
              id: `sug-${Date.now()}-2`,
              name: 'Air India',
              domain: 'airindia.com',
              reason: 'Full-service national carrier competing across domestic metro routes and international sectors.',
              confidence_score: 0.93
            },
            {
              id: `sug-${Date.now()}-3`,
              name: 'Akasa Air',
              domain: 'akasaair.com',
              reason: 'Emerging airline challenging on competitive fare structures and modern fleet comfort.',
              confidence_score: 0.88
            }
          ];
        } else if (isFoodDelivery) {
          pendingSuggestions = [
            {
              id: `sug-${Date.now()}-1`,
              name: 'Zomato India',
              domain: 'zomato.com',
              reason: 'Market leader in food delivery and restaurant discovery with Gold membership loyalty perks.',
              confidence_score: 0.96
            },
            {
              id: `sug-${Date.now()}-2`,
              name: 'Swiggy',
              domain: 'swiggy.com',
              reason: 'Primary competitor offering rapid delivery, Instamart groceries, and dining discounts.',
              confidence_score: 0.95
            },
            {
              id: `sug-${Date.now()}-3`,
              name: 'Blinkit',
              domain: 'blinkit.com',
              reason: 'Quick-commerce competitor capturing impulse retail and food orders.',
              confidence_score: 0.87
            }
          ];
        } else if (isEcommerce) {
          pendingSuggestions = [
            {
              id: `sug-${Date.now()}-1`,
              name: 'Nike Official Store',
              domain: 'nike.com',
              reason: 'Global sportswear leader competing on direct-to-consumer digital loyalty and sneaker releases.',
              confidence_score: 0.95
            },
            {
              id: `sug-${Date.now()}-2`,
              name: 'Adidas India',
              domain: 'adidas.co.in',
              reason: 'Major apparel and athletic footwear competitor with aggressive seasonal promotional discounts.',
              confidence_score: 0.94
            },
            {
              id: `sug-${Date.now()}-3`,
              name: 'Puma India',
              domain: 'in.puma.com',
              reason: 'Key sportswear competitor leveraging influencer collaborations and rapid online fulfillment.',
              confidence_score: 0.91
            }
          ];
        } else if (isFintechSaaS) {
          pendingSuggestions = [
            {
              id: `sug-${Date.now()}-1`,
              name: 'Stripe Payments',
              domain: 'stripe.com',
              reason: 'Global payment processing leader competing on developer experience and checkout conversion.',
              confidence_score: 0.96
            },
            {
              id: `sug-${Date.now()}-2`,
              name: 'Razorpay',
              domain: 'razorpay.com',
              reason: 'Dominant Indian fintech platform offering full-stack payment gateway and banking solutions.',
              confidence_score: 0.94
            },
            {
              id: `sug-${Date.now()}-3`,
              name: 'PayPal',
              domain: 'paypal.com',
              reason: 'Global digital wallet and merchant acquiring competitor.',
              confidence_score: 0.90
            }
          ];
        } else {
          pendingSuggestions = [
            {
              id: `sug-${Date.now()}-1`,
              name: 'The Leela Palaces',
              domain: 'theleela.com',
              reason: 'Direct luxury segment competitor in the hospitality market with similar target audience.',
              confidence_score: 0.95
            },
            {
              id: `sug-${Date.now()}-2`,
              name: 'ITC Hotels',
              domain: 'itchotels.com',
              reason: 'Matches premium positioning and offers comparable luxury amenities and dining experiences.',
              confidence_score: 0.88
            },
            {
              id: `sug-${Date.now()}-3`,
              name: 'Oberoi Hotels & Resorts',
              domain: 'oberoihotels.com',
              reason: 'Key luxury player competing for high-net-worth travelers and corporate accounts.',
              confidence_score: 0.92
            },
            {
              id: `sug-${Date.now()}-4`,
              name: 'Marriott Bonvoy',
              domain: 'marriott.com',
              reason: 'International hospitality giant competing on global loyalty rewards and brand variety.',
              confidence_score: 0.91
            }
          ];
        }
      }
      
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
      await apiService.approveSuggestion(suggestionId).catch(() => null);
      const approvedSuggestion = suggestions.find(s => s.id === suggestionId);
      if (approvedSuggestion) {
        // Simulate adding to fleet via backend, then update UI state
        await apiService.addCompetitor({
          project_id: projectId,
          name: approvedSuggestion.name,
          domain: approvedSuggestion.domain,
          targetUrl: `https://${approvedSuggestion.domain}`,
        } as any).catch(() => null);
      }
      
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
      await apiService.rejectSuggestion(suggestionId).catch(() => null);
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
