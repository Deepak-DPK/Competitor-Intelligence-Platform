export type UserRole = 'Product Manager' | 'Marketing Team' | 'Revenue Manager' | 'Business Analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user: User;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  currency: string;
  competitorCount: number;
  lastScanAt: string;
  scanFrequency: 'Hourly' | 'Daily' | 'Weekly';
  status: 'Active' | 'Paused' | 'Scanning';
  createdAt: string;
}

export interface Competitor {
  id: string;
  projectId: string;
  name: string;
  domain: string;
  targetUrl: string;
  category: 'Direct OTA' | 'Hotel Chain' | 'Boutique Aggregator' | 'Luxury Resort';
  starRating: number;
  propertyCount: number;
  avgDailyRate: number;
  priceTier: '$' | '$$' | '$$$' | '$$$$';
  socialHandles: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    tiktok?: string;
  };
  trackingStatus: {
    website: boolean;
    pricing: boolean;
    keywords: boolean;
    social: boolean;
    advertising: boolean;
  };
  lastCheckedAt: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  logoUrl?: string;
}

export interface WebsiteSnapshot {
  id: string;
  competitorId: string;
  competitorName: string;
  pageTitle: string;
  pageUrl: string;
  timestamp: string;
  changeType: 'CTA Changed' | 'Promo Banner Added' | 'Cancellation Policy Edit' | 'Room Package Updated' | 'Price Badge Moved';
  severity: 'Low' | 'Medium' | 'High';
  summary: string;
  beforeSnippet: string;
  afterSnippet: string;
  diffPercentage: number;
  screenshotUrl: string;
}

export interface RoomCategoryRate {
  roomType: 'Standard King' | 'Deluxe Ocean View' | 'Executive Suite' | 'Penthouse Villa';
  ourRate: number;
  competitorRate: number;
  diffAmount: number;
  diffPercentage: number;
  status: 'We are cheaper' | 'Parity' | 'Competitor cheaper';
}

export interface PricingDataPoint {
  id: string;
  date: string;
  ourRate: number;
  competitors: Record<string, number>; // competitorId -> rate
}

export interface PricingDisparity {
  id: string;
  competitorId: string;
  competitorName: string;
  checkInDate: string;
  roomType: string;
  ourRate: number;
  competitorRate: number;
  channel: 'Direct Site' | 'Booking.com' | 'Expedia' | 'Agoda';
  disparityAmount: number;
  disparityPercentage: number;
  detectedAt: string;
}

export interface KeywordRank {
  id: string;
  competitorId: string;
  competitorName: string;
  keyword: string;
  searchVolume: number;
  ourRank: number;
  competitorRank: number;
  rankChange: number; // e.g. +3 or -2
  serpFeatures: string[]; // e.g. ["Sponsored", "Featured Snippet", "Site Links"]
  landingPage: string;
  updatedAt: string;
}

export interface SocialPost {
  id: string;
  competitorId: string;
  competitorName: string;
  platform: 'Instagram' | 'Twitter' | 'LinkedIn' | 'TikTok';
  postText: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  engagementRate: number;
  campaignTag?: string;
  postedAt: string;
  postUrl: string;
  mediaUrl?: string;
}

export interface AdCampaign {
  id: string;
  competitorId: string;
  competitorName: string;
  adNetwork: 'Google Search' | 'Meta (Facebook/IG)' | 'TikTok Ads' | 'YouTube';
  headline: string;
  adCopy: string;
  targetKeywords: string[];
  destinationUrl: string;
  format: 'Search Ad' | 'Carousel Image' | 'Video Reel' | 'Display Banner';
  firstSeen: string;
  lastActive: string;
  estimatedMonthlySpend: string;
  promoCode?: string;
}

export interface AIInsight {
  id: string;
  projectId: string;
  title: string;
  category: 'Pricing Alert' | 'SEO Strategy' | 'Ad Campaign Threat' | 'Website UX Change' | 'Executive Summary';
  type: 'threat' | 'opportunity' | 'trend' | 'recommendation';
  summary: string;
  detailedAnalysis: string;
  recommendedActions: string[];
  impactScore: number; // 1-100
  createdAt: string;
  relatedCompetitorIds: string[];
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertCategory = 'Pricing' | 'Website' | 'SEO' | 'Ads' | 'Social';

export interface AlertItem {
  id: string;
  projectId: string;
  competitorId: string;
  competitorName: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface ReportConfig {
  id: string;
  projectId: string;
  title: string;
  dateRange: '7d' | '30d' | '90d' | 'ytd';
  includeSections: {
    pricing: boolean;
    seo: boolean;
    website: boolean;
    ads: boolean;
    aiInsights: boolean;
  };
  schedule: 'Manual' | 'Weekly Email' | 'Monthly PDF';
  recipients: string[];
  lastGeneratedAt?: string;
}

export interface SystemStatus {
  lastGlobalScan: string;
  activeProxies: number;
  firecrawlQueueStatus: 'Idle' | 'Processing' | 'Completed';
  firecrawlLatencyMs: number;
  aiEngineModel: string;
  totalSnapshotsToday: number;
}
