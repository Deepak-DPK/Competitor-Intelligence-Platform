import {
  User,
  Project,
  Competitor,
  WebsiteSnapshot,
  PricingDataPoint,
  PricingDisparity,
  KeywordRank,
  SocialPost,
  AdCampaign,
  AIInsight,
  AlertItem,
  ReportConfig,
  SystemStatus,
  UserRole,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_PROJECTS,
  INITIAL_COMPETITORS,
  INITIAL_WEBSITE_SNAPSHOTS,
  INITIAL_PRICING_TRENDS,
  INITIAL_PRICING_DISPARITIES,
  INITIAL_KEYWORD_RANKS,
  INITIAL_SOCIAL_POSTS,
  INITIAL_AD_CAMPAIGNS,
  INITIAL_AI_INSIGHTS,
  INITIAL_ALERTS,
  INITIAL_REPORTS,
  INITIAL_SYSTEM_STATUS,
} from '../data/seedData';
import { delay } from '../lib/utils';

// Helper for local storage persistence
const STORAGE_KEYS = {
  USER: 'hotel_intel_user',
  PROJECTS: 'hotel_intel_projects',
  COMPETITORS: 'hotel_intel_competitors',
  SNAPSHOTS: 'hotel_intel_snapshots',
  DISPARITIES: 'hotel_intel_disparities',
  KEYWORDS: 'hotel_intel_keywords',
  SOCIAL: 'hotel_intel_social',
  ADS: 'hotel_intel_ads',
  INSIGHTS: 'hotel_intel_insights',
  ALERTS: 'hotel_intel_alerts',
  REPORTS: 'hotel_intel_reports',
};

function getStoredData<T>(key: string, initialFallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialFallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return initialFallback;
  }
}

function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

class ApiService {
  // User Authentication / Profile
  async getUser(): Promise<User> {
    await delay(120);
    return getStoredData(STORAGE_KEYS.USER, INITIAL_USER);
  }

  async updateUserRole(role: UserRole): Promise<User> {
    await delay(150);
    const user = getStoredData(STORAGE_KEYS.USER, INITIAL_USER);
    const updated = { ...user, role };
    setStoredData(STORAGE_KEYS.USER, updated);
    return updated;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    await delay(150);
    return getStoredData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    await delay(100);
    const projects = getStoredData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return projects.find((p) => p.id === id);
  }

  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'lastScanAt' | 'competitorCount'>): Promise<Project> {
    await delay(300);
    const projects = getStoredData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const newProject: Project = {
      ...data,
      id: `proj_${Date.now()}`,
      competitorCount: 0,
      lastScanAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newProject, ...projects];
    setStoredData(STORAGE_KEYS.PROJECTS, updated);
    return newProject;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    await delay(200);
    const projects = getStoredData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');
    const updated = { ...projects[index], ...updates };
    projects[index] = updated;
    setStoredData(STORAGE_KEYS.PROJECTS, projects);
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    await delay(250);
    const projects = getStoredData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const filtered = projects.filter((p) => p.id !== id);
    setStoredData(STORAGE_KEYS.PROJECTS, filtered);
  }

  // Competitors
  async getCompetitors(projectId?: string): Promise<Competitor[]> {
    await delay(150);
    const competitors = getStoredData(STORAGE_KEYS.COMPETITORS, INITIAL_COMPETITORS);
    if (!projectId) return competitors;
    return competitors.filter((c) => c.projectId === projectId);
  }

  async getCompetitorById(id: string): Promise<Competitor | undefined> {
    await delay(100);
    const competitors = getStoredData(STORAGE_KEYS.COMPETITORS, INITIAL_COMPETITORS);
    return competitors.find((c) => c.id === id);
  }

  async addCompetitor(
    data: Omit<Competitor, 'id' | 'lastCheckedAt' | 'threatLevel'>
  ): Promise<Competitor> {
    await delay(350);
    const competitors = getStoredData(STORAGE_KEYS.COMPETITORS, INITIAL_COMPETITORS);
    const newComp: Competitor = {
      ...data,
      id: `comp_${Date.now()}`,
      lastCheckedAt: new Date().toISOString(),
      threatLevel: 'Medium',
      logoUrl: data.logoUrl || `https://images.unsplash.com/photo-${1560000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=120`,
    };
    const updated = [newComp, ...competitors];
    setStoredData(STORAGE_KEYS.COMPETITORS, updated);

    // Increment competitor count in project
    const projects = getStoredData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const pIndex = projects.findIndex((p) => p.id === data.projectId);
    if (pIndex !== -1) {
      projects[pIndex].competitorCount += 1;
      setStoredData(STORAGE_KEYS.PROJECTS, projects);
    }

    return newComp;
  }

  async updateCompetitor(id: string, updates: Partial<Competitor>): Promise<Competitor> {
    await delay(200);
    const competitors = getStoredData(STORAGE_KEYS.COMPETITORS, INITIAL_COMPETITORS);
    const idx = competitors.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Competitor not found');
    const updated = { ...competitors[idx], ...updates };
    competitors[idx] = updated;
    setStoredData(STORAGE_KEYS.COMPETITORS, competitors);
    return updated;
  }

  async deleteCompetitor(id: string): Promise<void> {
    await delay(200);
    const competitors = getStoredData(STORAGE_KEYS.COMPETITORS, INITIAL_COMPETITORS);
    const comp = competitors.find((c) => c.id === id);
    const filtered = competitors.filter((c) => c.id !== id);
    setStoredData(STORAGE_KEYS.COMPETITORS, filtered);

    if (comp) {
      const projects = getStoredData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
      const pIndex = projects.findIndex((p) => p.id === comp.projectId);
      if (pIndex !== -1 && projects[pIndex].competitorCount > 0) {
        projects[pIndex].competitorCount -= 1;
        setStoredData(STORAGE_KEYS.PROJECTS, projects);
      }
    }
  }

  async triggerScan(competitorId: string): Promise<{ success: boolean; message: string; newSnapshot?: WebsiteSnapshot }> {
    await delay(1200); // Simulate Playwright + Jina Reader pipeline
    const competitors = getStoredData(STORAGE_KEYS.COMPETITORS, INITIAL_COMPETITORS);
    const comp = competitors.find((c) => c.id === competitorId);
    if (!comp) throw new Error('Competitor not found');

    comp.lastCheckedAt = new Date().toISOString();
    setStoredData(STORAGE_KEYS.COMPETITORS, competitors);

    // Generate new DOM snapshot diff
    const snapshots = getStoredData(STORAGE_KEYS.SNAPSHOTS, INITIAL_WEBSITE_SNAPSHOTS);
    const newSnap: WebsiteSnapshot = {
      id: `snap_${Date.now()}`,
      competitorId: comp.id,
      competitorName: comp.name,
      pageTitle: `${comp.name} | Live Hotel Rates & Offers`,
      pageUrl: comp.targetUrl,
      timestamp: new Date().toISOString(),
      changeType: 'Promo Banner Added',
      severity: 'High',
      summary: `Automated Playwright scan detected new promotional CTA on ${comp.name} home page.`,
      beforeSnippet: `<div class="hero-banner">Book Direct with ${comp.name}</div>`,
      afterSnippet: `<div class="hero-banner active-sale">EXCLUSIVE DIRECT DEAL: 25% OFF Deluxe Suites + Free Spa Pass</div>`,
      diffPercentage: 22.5,
      screenshotUrl: comp.logoUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
    };

    setStoredData(STORAGE_KEYS.SNAPSHOTS, [newSnap, ...snapshots]);

    // Create a new alert
    const alerts = getStoredData(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    const newAlert: AlertItem = {
      id: `alt_${Date.now()}`,
      projectId: comp.projectId,
      competitorId: comp.id,
      competitorName: comp.name,
      title: 'Manual Scan: New Promo Banner',
      message: `Detected 25% OFF promotional discount banner during manual crawl on ${comp.name}.`,
      severity: 'warning',
      category: 'Website',
      timestamp: new Date().toISOString(),
      isRead: false,
      actionUrl: '/website-monitoring',
    };
    setStoredData(STORAGE_KEYS.ALERTS, [newAlert, ...alerts]);

    return {
      success: true,
      message: `Completed Playwright + Jina Reader crawl on ${comp.name}. Detected 1 new change.`,
      newSnapshot: newSnap,
    };
  }

  // Monitoring Snapshots
  async getWebsiteSnapshots(competitorId?: string): Promise<WebsiteSnapshot[]> {
    await delay(150);
    const snapshots = getStoredData(STORAGE_KEYS.SNAPSHOTS, INITIAL_WEBSITE_SNAPSHOTS);
    if (!competitorId) return snapshots;
    return snapshots.filter((s) => s.competitorId === competitorId);
  }

  // Pricing
  async getPricingTrends(): Promise<PricingDataPoint[]> {
    await delay(150);
    return INITIAL_PRICING_TRENDS;
  }

  async getPricingDisparities(): Promise<PricingDisparity[]> {
    await delay(150);
    return getStoredData(STORAGE_KEYS.DISPARITIES, INITIAL_PRICING_DISPARITIES);
  }

  // Keywords
  async getKeywordRanks(competitorId?: string): Promise<KeywordRank[]> {
    await delay(150);
    const keywords = getStoredData(STORAGE_KEYS.KEYWORDS, INITIAL_KEYWORD_RANKS);
    if (!competitorId) return keywords;
    return keywords.filter((k) => k.competitorId === competitorId);
  }

  // Social & Ads
  async getSocialPosts(): Promise<SocialPost[]> {
    await delay(150);
    return getStoredData(STORAGE_KEYS.SOCIAL, INITIAL_SOCIAL_POSTS);
  }

  async getAdCampaigns(): Promise<AdCampaign[]> {
    await delay(150);
    return getStoredData(STORAGE_KEYS.ADS, INITIAL_AD_CAMPAIGNS);
  }

  // AI Insights
  async getAIInsights(projectId: string): Promise<AIInsight[]> {
    await delay(150);
    const insights = getStoredData(STORAGE_KEYS.INSIGHTS, INITIAL_AI_INSIGHTS);
    return insights.filter((i) => i.projectId === projectId);
  }

  async generateAIInsight(projectId: string, promptQuery?: string): Promise<AIInsight> {
    await delay(1500); // Simulate Gemini AI processing latency
    const insights = getStoredData(STORAGE_KEYS.INSIGHTS, INITIAL_AI_INSIGHTS);
    const newInsight: AIInsight = {
      id: `ins_${Date.now()}`,
      projectId,
      title: promptQuery ? `Custom AI Strategy: "${promptQuery.slice(0, 40)}..."` : 'AI Opportunity: High-Intent Weekend Price Undercut',
      category: 'Executive Summary',
      type: 'opportunity',
      summary: promptQuery
        ? `Gemini AI generated customized competitor analysis addressing: ${promptQuery}`
        : 'Competitors are holding high weekend rates ($480+) while midweek demand drops by 18%. Introducing a 3-night weekend package captures premium leisure travellers.',
      detailedAnalysis: 'Analysis of 1,200 competitor website snapshots and pricing trends shows competitor ADR peaking on Saturday nights with strict 2-night minimum stay requirements. Launching an unbundled 1-night Sunday stay perk converts price-sensitive guests without diluting overall ADR.',
      recommendedActions: [
        'Deploy a "Sunday Funday" rate plan with complimentary late 4 PM checkout.',
        'Target Google Hotel Ads for searchers looking for single-night Sunday weekend extensions.',
        'Send push notifications to mobile app users offering 15% bonus point rewards.',
      ],
      impactScore: 88,
      createdAt: new Date().toISOString(),
      relatedCompetitorIds: ['comp_booking_com', 'comp_marriott'],
    };

    const updated = [newInsight, ...insights];
    setStoredData(STORAGE_KEYS.INSIGHTS, updated);
    return newInsight;
  }

  // Alerts
  async getAlerts(projectId?: string): Promise<AlertItem[]> {
    await delay(120);
    const alerts = getStoredData(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    if (!projectId) return alerts;
    return alerts.filter((a) => a.projectId === projectId);
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    await delay(100);
    const alerts = getStoredData(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    const idx = alerts.findIndex((a) => a.id === alertId);
    if (idx !== -1) {
      alerts[idx].isRead = true;
      setStoredData(STORAGE_KEYS.ALERTS, alerts);
    }
  }

  async clearAllAlerts(projectId: string): Promise<void> {
    await delay(150);
    const alerts = getStoredData(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    const filtered = alerts.filter((a) => a.projectId !== projectId);
    setStoredData(STORAGE_KEYS.ALERTS, filtered);
  }

  // Reports
  async getReports(projectId: string): Promise<ReportConfig[]> {
    await delay(120);
    const reports = getStoredData(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    return reports.filter((r) => r.projectId === projectId);
  }

  async createReport(data: Omit<ReportConfig, 'id'>): Promise<ReportConfig> {
    await delay(250);
    const reports = getStoredData(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    const newReport: ReportConfig = {
      ...data,
      id: `rep_${Date.now()}`,
      lastGeneratedAt: new Date().toISOString(),
    };
    const updated = [newReport, ...reports];
    setStoredData(STORAGE_KEYS.REPORTS, updated);
    return newReport;
  }

  // System Status
  async getSystemStatus(): Promise<SystemStatus> {
    await delay(100);
    return INITIAL_SYSTEM_STATUS;
  }

  async triggerGlobalScan(projectId: string): Promise<{ count: number; scannedAt: string }> {
    await delay(2000); // Simulate full monitoring crawl across all channels
    const projects = getStoredData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const pIdx = projects.findIndex((p) => p.id === projectId);
    if (pIdx !== -1) {
      projects[pIdx].lastScanAt = new Date().toISOString();
      projects[pIdx].status = 'Active';
      setStoredData(STORAGE_KEYS.PROJECTS, projects);
    }
    return {
      count: 5,
      scannedAt: new Date().toISOString(),
    };
  }
}

export const apiService = new ApiService();
