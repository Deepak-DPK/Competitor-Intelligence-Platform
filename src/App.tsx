import React, { useState, useEffect, useCallback } from 'react';
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
} from './types';
import { apiService } from './services/api';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavItem } from './components/layout/Sidebar';
import { ToastProvider, useToast } from './components/ui/Toast';
import { Skeleton } from './components/ui/Skeleton';

// Views
import { DashboardView } from './features/dashboard/DashboardView';
import { ProjectsView } from './features/projects/ProjectsView';
import { CompetitorsView } from './features/competitors/CompetitorsView';
import { CompetitorDetailView } from './features/competitors/CompetitorDetailView';
import { WebsiteMonitoring } from './features/monitoring/WebsiteMonitoring';
import { PricingMonitoring } from './features/monitoring/PricingMonitoring';
import { KeywordMonitoring } from './features/monitoring/KeywordMonitoring';
import { SocialAdsMonitoring } from './features/monitoring/SocialAdsMonitoring';
import { AIInsightsView } from './features/insights/AIInsightsView';
import { ReportsView } from './features/reports/ReportsView';
import { AlertsView } from './features/alerts/AlertsView';
import { SettingsView } from './features/settings/SettingsView';

import { LoginView } from './features/auth/LoginView';

function AppContent() {
  const { showToast } = useToast();

  // App Core State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('auth_token'));
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [currentNav, setCurrentNav] = useState<NavItem>('dashboard');
  const [selectedCompetitorDetail, setSelectedCompetitorDetail] = useState<Competitor | null>(null);

  // Data Collections
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [snapshots, setSnapshots] = useState<WebsiteSnapshot[]>([]);
  const [pricingTrends, setPricingTrends] = useState<PricingDataPoint[]>([]);
  const [disparities, setDisparities] = useState<PricingDisparity[]>([]);
  const [keywords, setKeywords] = useState<KeywordRank[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [reports, setReports] = useState<ReportConfig[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Loading & Scanning states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Initial Data Fetch
  const loadInitialData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);

      // 1. Fetch user profile
      let usr: User;
      try {
        usr = await apiService.getUser();
      } catch (err: any) {
        console.error('Failed to fetch user', err);
        setIsAuthenticated(false);
        localStorage.removeItem('auth_token');
        return;
      }
      setUser(usr);

      // 2. Fetch projects safely
      let projs: Project[] = [];
      try {
        projs = await apiService.getProjects();
      } catch (err) {
        console.warn('Failed to fetch projects', err);
      }

      // 3. Fetch system status safely
      let status: SystemStatus | null = null;
      try {
        status = await apiService.getSystemStatus();
      } catch (err) {
        console.warn('Failed to fetch system status', err);
      }
      setSystemStatus(status);

      // 4. Ensure at least one project exists
      let currentProjects = projs;
      if (currentProjects.length === 0) {
        try {
          const defaultProj = await apiService.createProject({
            name: 'Taj Exotica Resort & Spa Goa',
            description: 'Primary competitive intelligence workspace',
            location: 'Goa, India',
            currency: 'INR',
            scanFrequency: 'Daily',
            status: 'Active',
          });
          currentProjects = [defaultProj];
        } catch (err) {
          console.warn('Could not auto-create default project, creating local fallback', err);
          currentProjects = [{
            id: 'fallback-proj-1',
            name: 'Taj Exotica Resort & Spa Goa',
            description: 'Primary competitive intelligence workspace',
            location: 'Goa, India',
            currency: 'INR',
            competitorCount: 0,
            lastScanAt: new Date().toISOString(),
            scanFrequency: 'Daily',
            status: 'Active',
            createdAt: new Date().toISOString(),
          }];
        }
      }

      setProjects(currentProjects);

      if (currentProjects.length > 0) {
        const defaultProj = currentProjects[0];
        setActiveProject(defaultProj);
        await loadProjectData(defaultProj.id);
      }
    } catch (e: any) {
      console.error('Error initializing app', e);
      showToast('error', 'Initialization Failed', 'Could not load platform data.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, showToast]);

  const loadProjectData = async (projectId: string) => {
    try {
      const [comps, snaps, pTrends, pDisparities, kws, posts, adCamps, ins, alts, reps] =
        await Promise.all([
          apiService.getCompetitors(projectId).catch(() => []),
          apiService.getWebsiteSnapshots().catch(() => []),
          apiService.getPricingTrends().catch(() => []),
          apiService.getPricingDisparities().catch(() => []),
          apiService.getKeywordRanks().catch(() => []),
          apiService.getSocialPosts().catch(() => []),
          apiService.getAdCampaigns().catch(() => []),
          apiService.getAIInsights(projectId).catch(() => []),
          apiService.getAlerts(projectId).catch(() => []),
          apiService.getReports(projectId).catch(() => []),
        ]);

      setCompetitors(comps || []);
      setSnapshots(snaps || []);
      setPricingTrends(pTrends || []);
      setDisparities(pDisparities || []);
      setKeywords(kws || []);
      setSocialPosts(posts || []);
      setAds(adCamps || []);
      setInsights(ins || []);
      setAlerts(alts || []);
      setReports(reps || []);
    } catch (e) {
      console.error('Error fetching project data', e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Project Change Handler
  const handleSelectProject = async (project: Project) => {
    setActiveProject(project);
    setSelectedCompetitorDetail(null);
    await loadProjectData(project.id);
    showToast('info', 'Project Switched', `Active scope: ${project.name}`);
  };

  // User Persona Change
  const handleChangeUserRole = async (role: UserRole) => {
    if (!user) return;
    const updated = await apiService.updateUserRole(role);
    setUser(updated);
    showToast('success', 'Role Switch', `Viewing workspace as ${role}.`);
  };

  // Project CRUD Actions
  const handleCreateProject = async (
    data: Omit<Project, 'id' | 'createdAt' | 'lastScanAt' | 'competitorCount'>
  ) => {
    const newProj = await apiService.createProject(data);
    const updatedProjects = await apiService.getProjects();
    setProjects(updatedProjects);
    setActiveProject(newProj);
    await loadProjectData(newProj.id);
  };

  const handleDeleteProject = async (id: string) => {
    await apiService.deleteProject(id);
    const updatedProjects = await apiService.getProjects();
    setProjects(updatedProjects);
    if (activeProject?.id === id && updatedProjects.length > 0) {
      handleSelectProject(updatedProjects[0]);
    }
  };

  // Competitor CRUD Actions
  const handleAddCompetitor = async (
    data: Omit<Competitor, 'id' | 'lastCheckedAt' | 'threatLevel'>
  ) => {
    await apiService.addCompetitor(data);
    if (activeProject) {
      const comps = await apiService.getCompetitors(activeProject.id);
      setCompetitors(comps);
    }
  };

  const handleUpdateCompetitor = async (id: string, updates: Partial<Competitor>) => {
    await apiService.updateCompetitor(id, updates);
    if (activeProject) {
      const comps = await apiService.getCompetitors(activeProject.id);
      setCompetitors(comps);
    }
  };

  const handleDeleteCompetitor = async (id: string) => {
    await apiService.deleteCompetitor(id);
    if (activeProject) {
      const comps = await apiService.getCompetitors(activeProject.id);
      setCompetitors(comps);
      if (selectedCompetitorDetail?.id === id) {
        setSelectedCompetitorDetail(null);
      }
    }
  };

  // Manual Crawl Trigger
  const handleTriggerScan = async (comp: Competitor) => {
    try {
      setIsScanning(true);
      showToast('info', 'Firecrawl Scraper', `Extracting live data for ${comp.name}...`);
      const res = await apiService.triggerScan(comp.id);
      if (activeProject) {
        await loadProjectData(activeProject.id);
      }
      showToast('success', 'Crawl Completed', res.message);
    } catch (e) {
      showToast('error', 'Crawl Error', 'Failed to complete website scan.');
    } finally {
      setIsScanning(false);
    }
  };

  // Global Project Scan
  const handleTriggerGlobalScan = async () => {
    if (!activeProject) return;
    try {
      setIsScanning(true);
      showToast('info', 'Global Scan Initiated', `Running Firecrawl Real-Time Scraper across ${activeProject.name}...`);
      await apiService.triggerGlobalScan(activeProject.id);
      await loadProjectData(activeProject.id);
      showToast('success', 'Global Scan Complete', 'Refreshed all competitor rates, keywords, and DOM snapshots.');
    } catch (e) {
      showToast('error', 'Scan Error', 'Failed to run global project scan.');
    } finally {
      setIsScanning(false);
    }
  };

  // AI Strategy Generator
  const handleGenerateInsight = async (promptQuery?: string) => {
    if (!activeProject) return;
    try {
      setIsGeneratingInsight(true);
      showToast('info', 'Apex AI Processing', 'Synthesizing competitive intelligence report...');
      await apiService.generateAIInsight(activeProject.id, promptQuery);
      const updatedIns = await apiService.getAIInsights(activeProject.id);
      setInsights(updatedIns);
      showToast('success', 'AI Insights Ready', 'Generated new strategic recommendations.');
    } catch (e) {
      showToast('error', 'AI Error', 'Could not generate strategic insight.');
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  // Alert Actions
  const handleMarkAlertAsRead = async (alertId: string) => {
    await apiService.markAlertAsRead(alertId);
    if (activeProject) {
      const alts = await apiService.getAlerts(activeProject.id);
      setAlerts(alts);
    }
  };

  const handleClearAllAlerts = async () => {
    if (!activeProject) return;
    await apiService.clearAllAlerts(activeProject.id);
    setAlerts([]);
    showToast('info', 'Alerts Cleared', 'Cleared all notifications.');
  };

  // Report Actions
  const handleCreateReport = async (data: Omit<ReportConfig, 'id'>) => {
    await apiService.createReport(data);
    if (activeProject) {
      const reps = await apiService.getReports(activeProject.id);
      setReports(reps);
    }
  };

  const handleLogout = async () => {
    await apiService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setProjects([]);
    setActiveProject(null);
    setCompetitors([]);
    setSnapshots([]);
    setPricingTrends([]);
    setDisparities([]);
    setKeywords([]);
    setSocialPosts([]);
    setAds([]);
    setInsights([]);
    setAlerts([]);
    setReports([]);
    setSystemStatus(null);
    showToast('info', 'Signed Out', 'You have been signed out.');
  };

  if (!isAuthenticated) {
    return <LoginView onSuccess={() => setIsAuthenticated(true)} />;
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <span className="font-bold text-lg text-indigo-400">R</span>
          </div>
          <h2 className="text-base font-bold text-slate-900">Initializing ResortIQ Intelligence Platform...</h2>
          <p className="text-xs text-slate-500">Connecting Firecrawl Scraper Nodes & Apex AI Engines</p>
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  const fallbackProject: Project = {
    id: 'default-proj-1',
    name: 'Taj Exotica Resort & Spa Goa',
    description: 'Primary competitive intelligence workspace',
    location: 'Goa, India',
    currency: 'INR',
    competitorCount: competitors.length,
    lastScanAt: new Date().toISOString(),
    scanFrequency: 'Daily',
    status: 'Active',
    createdAt: new Date().toISOString(),
  };

  const effectiveProject = activeProject || projects[0] || fallbackProject;
  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      {/* Top Header */}
      <Navbar
        user={user}
        projects={projects}
        activeProject={effectiveProject}
        onSelectProject={handleSelectProject}
        alerts={alerts}
        onOpenAlerts={() => setCurrentNav('alerts')}
        onTriggerGlobalScan={handleTriggerGlobalScan}
        isScanning={isScanning}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onChangeUserRole={handleChangeUserRole}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Sidebar */}
        <Sidebar
          currentNav={currentNav}
          onNavigate={(nav) => {
            setCurrentNav(nav);
            setSelectedCompetitorDetail(null);
          }}
          systemStatus={systemStatus}
          unreadAlertsCount={unreadAlertsCount}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* View Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {selectedCompetitorDetail ? (
            <CompetitorDetailView
              competitor={selectedCompetitorDetail}
              project={effectiveProject}
              snapshots={snapshots}
              keywords={keywords}
              ads={ads}
              socialPosts={socialPosts}
              onBack={() => setSelectedCompetitorDetail(null)}
              onTriggerScan={handleTriggerScan}
              isScanning={isScanning}
            />
          ) : (
            <>
              {currentNav === 'dashboard' && (
                <DashboardView
                  project={effectiveProject}
                  competitors={competitors}
                  snapshots={snapshots}
                  pricingTrends={pricingTrends}
                  disparities={disparities}
                  keywords={keywords}
                  insights={insights}
                  alerts={alerts}
                  onNavigate={setCurrentNav}
                  onTriggerScan={handleTriggerScan}
                  isScanning={isScanning}
                />
              )}

              {currentNav === 'projects' && (
                <ProjectsView
                  projects={projects.length > 0 ? projects : [effectiveProject]}
                  activeProject={effectiveProject}
                  onSelectProject={handleSelectProject}
                  onCreateProject={handleCreateProject}
                  onDeleteProject={handleDeleteProject}
                />
              )}

              {currentNav === 'competitors' && (
                <CompetitorsView
                  project={effectiveProject}
                  competitors={competitors}
                  onAddCompetitor={handleAddCompetitor}
                  onUpdateCompetitor={handleUpdateCompetitor}
                  onDeleteCompetitor={handleDeleteCompetitor}
                  onTriggerScan={handleTriggerScan}
                  isScanning={isScanning}
                  onSelectCompetitorDetail={setSelectedCompetitorDetail}
                />
              )}

              {currentNav === 'website' && (
                <WebsiteMonitoring
                  snapshots={snapshots}
                  competitors={competitors}
                  onTriggerScan={handleTriggerScan}
                  isScanning={isScanning}
                />
              )}

              {currentNav === 'pricing' && (
                <PricingMonitoring
                  project={effectiveProject}
                  pricingTrends={pricingTrends}
                  disparities={disparities}
                  competitors={competitors}
                />
              )}

              {currentNav === 'keywords' && (
                <KeywordMonitoring keywords={keywords} competitors={competitors} />
              )}

              {currentNav === 'social-ads' && (
                <SocialAdsMonitoring ads={ads} socialPosts={socialPosts} competitors={competitors} />
              )}

              {currentNav === 'insights' && (
                <AIInsightsView
                  project={effectiveProject}
                  insights={insights}
                  onGenerateInsight={handleGenerateInsight}
                  isGenerating={isGeneratingInsight}
                />
              )}

              {currentNav === 'reports' && (
                <ReportsView
                  project={effectiveProject}
                  reports={reports}
                  competitors={competitors}
                  onCreateReport={handleCreateReport}
                />
              )}

              {currentNav === 'alerts' && (
                <AlertsView
                  project={effectiveProject}
                  alerts={alerts}
                  onMarkAsRead={handleMarkAlertAsRead}
                  onClearAllAlerts={handleClearAllAlerts}
                  onNavigate={setCurrentNav}
                />
              )}

              {currentNav === 'settings' && (
                <SettingsView project={effectiveProject} systemStatus={systemStatus} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
