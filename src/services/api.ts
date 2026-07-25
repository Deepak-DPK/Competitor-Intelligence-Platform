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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token'); // TODO: update when real auth is implemented
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

class ApiService {
  // User Authentication / Profile
  async getUser(): Promise<User> {
    return fetchWithAuth('/users/me');
  }

  async updateUserRole(role: UserRole): Promise<User> {
    return fetchWithAuth('/users/me/role', {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return fetchWithAuth('/projects');
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    return fetchWithAuth(`/projects/${id}`);
  }

  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'lastScanAt' | 'competitorCount'>): Promise<Project> {
    return fetchWithAuth('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    return fetchWithAuth(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string): Promise<void> {
    return fetchWithAuth(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Competitors
  async getCompetitors(projectId?: string): Promise<Competitor[]> {
    const query = projectId ? `?project_id=${projectId}` : '';
    return fetchWithAuth(`/competitors${query}`);
  }

  async getCompetitorById(id: string): Promise<Competitor | undefined> {
    return fetchWithAuth(`/competitors/${id}`);
  }

  async addCompetitor(
    data: Omit<Competitor, 'id' | 'lastCheckedAt' | 'threatLevel'>
  ): Promise<Competitor> {
    return fetchWithAuth('/competitors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCompetitor(id: string, updates: Partial<Competitor>): Promise<Competitor> {
    return fetchWithAuth(`/competitors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteCompetitor(id: string): Promise<void> {
    return fetchWithAuth(`/competitors/${id}`, {
      method: 'DELETE',
    });
  }

  async triggerScan(competitorId: string): Promise<{ success: boolean; message: string; newSnapshot?: WebsiteSnapshot }> {
    return fetchWithAuth(`/competitors/${competitorId}/scan`, {
      method: 'POST',
    });
  }

  // Monitoring Snapshots
  async getWebsiteSnapshots(competitorId?: string): Promise<WebsiteSnapshot[]> {
    const query = competitorId ? `?competitor_id=${competitorId}` : '';
    return fetchWithAuth(`/dashboard/snapshots${query}`);
  }

  // Pricing
  async getPricingTrends(): Promise<PricingDataPoint[]> {
    return fetchWithAuth('/dashboard/pricing/trends');
  }

  async getPricingDisparities(): Promise<PricingDisparity[]> {
    return fetchWithAuth('/dashboard/pricing/disparities');
  }

  // Keywords
  async getKeywordRanks(competitorId?: string): Promise<KeywordRank[]> {
    const query = competitorId ? `?competitor_id=${competitorId}` : '';
    return fetchWithAuth(`/dashboard/keywords${query}`);
  }

  // Social & Ads
  async getSocialPosts(): Promise<SocialPost[]> {
    return fetchWithAuth('/dashboard/social');
  }

  async getAdCampaigns(): Promise<AdCampaign[]> {
    return fetchWithAuth('/dashboard/ads');
  }

  // AI Insights
  async getAIInsights(projectId: string): Promise<AIInsight[]> {
    return fetchWithAuth(`/dashboard/insights?project_id=${projectId}`);
  }

  async generateAIInsight(projectId: string, promptQuery?: string): Promise<AIInsight> {
    return fetchWithAuth('/dashboard/insights/generate', {
      method: 'POST',
      body: JSON.stringify({ projectId, promptQuery }),
    });
  }

  // Alerts
  async getAlerts(projectId?: string): Promise<AlertItem[]> {
    const query = projectId ? `?project_id=${projectId}` : '';
    return fetchWithAuth(`/alerts${query}`);
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    return fetchWithAuth(`/alerts/${alertId}/read`, {
      method: 'POST',
    });
  }

  async clearAllAlerts(projectId: string): Promise<void> {
    return fetchWithAuth(`/alerts/clear?project_id=${projectId}`, {
      method: 'POST',
    });
  }

  // Reports
  async getReports(projectId: string): Promise<ReportConfig[]> {
    return fetchWithAuth(`/reports?project_id=${projectId}`);
  }

  async createReport(data: Omit<ReportConfig, 'id'>): Promise<ReportConfig> {
    return fetchWithAuth('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // System Status
  async getSystemStatus(): Promise<SystemStatus> {
    return fetchWithAuth('/health/status');
  }

  async triggerGlobalScan(projectId: string): Promise<{ count: number; scannedAt: string }> {
    return fetchWithAuth(`/projects/${projectId}/scan`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
