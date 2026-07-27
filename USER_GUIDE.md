# CompeteIQ User Guide: End-to-End Workflow

Welcome to the CompeteIQ platform. This guide will walk you through the end-to-end process of setting up your account, configuring your competitive landscape, triggering automated data collection, and extracting actionable intelligence for your travel agency or tour operation.

---

## Step 1: Authentication & Login
1. Navigate to the CompeteIQ platform URL.
2. Enter your credentials on the login screen. (For the demo environment, any valid email format and a 6-character password will grant access).
3. Upon logging in, the system will initialize your connection to the Supabase backend and prepare the Gemini AI engines.

---

## Step 2: Setting up a Travel Workspace
Workspaces allow you to segment your intelligence gathering by region, market, or business unit.

1. Click on the **Workspace Dropdown** in the top left of the navigation bar.
2. Select **+ New Workspace**.
3. Fill in the strategic details:
   - **Workspace Name:** e.g., "Summer Europe Packages", "Domestic Flight Deals".
   - **Location & Currency:** Define the primary market parameters.
   - **Business Type:** Select from options like "Travel Agency & OTA" or "Tour Operator".
4. Click **Initialize Workspace**. You will be switched to this new, clean workspace automatically.

---

## Step 3: Discovering & Adding Competitors
Now that you have a workspace, you need to populate it with the competitors you want to monitor.

### Method A: AI Competitor Discovery (Recommended)
1. Navigate to the **Competitors** tab on the left sidebar.
2. Click the **Sparkles (AI Discovery)** button.
3. Enter your own travel agency's domain name.
4. The system will use Gemini AI to analyze your market positioning and suggest 3-5 direct and indirect competitors (e.g., MakeMyTrip, Thomas Cook, Yatra).
5. Review the suggestions and click **Add Selected to Tracking**.

### Method B: Manual Addition
1. On the **Competitors** tab, click **+ Add Competitor**.
2. Type in a known competitor's domain (e.g., `agoda.com`).
3. Press `Tab`. The platform will attempt to auto-fill the Company Name and Category.
4. Adjust the target URL or threat level, then click **Deploy Scraping Node**.

---

## Step 4: Triggering Real-Time Data Collection
CompeteIQ uses Firecrawl technology to extract live data from competitor websites.

1. To scan a single competitor: Go to the **Competitors** tab, locate the competitor card, and click **Trigger Scan**.
2. To scan the entire market: Click the **Global Scan (Radar Icon)** in the top navigation bar.
3. The platform will dispatch scraper agents in the background. You will receive a toast notification when the real-time extraction is complete.

---

## Step 5: Analyzing Website Changes (Visual Diffs)
Track how competitors are altering their landing pages, promotional banners, and policies.

1. Navigate to the **Website Changes** tab.
2. You will see a feed of timestamped DOM changes.
3. Click on a specific snapshot to view the **HTML Diff**. 
4. The system highlights the exact code snippet that changed (e.g., old package price crossed out in red, new discounted price highlighted in green) alongside an AI-generated summary of *why* the change matters.

---

## Step 6: Pricing & Rate Parity Monitoring
Ensure you aren't being undercut by aggressive competitors.

1. Navigate to the **Pricing & Parity** tab.
2. Review the **Disparity Alerts Feed** to immediately spot instances where competitors are offering identical packages or routes at a lower price.
3. Use the historical pricing charts to analyze long-term discounting trends in your sector.

---

## Step 7: Generating AI Strategic Insights
Let Google Gemini synthesize the raw data into business strategy.

1. Navigate to the **AI Insights** tab.
2. The platform automatically generates proactive insights based on recent data scans (e.g., "Competitors are undercutting premium Europe packages by 10-15%").
3. For custom analysis, type a prompt into the **Ask Apex AI** search bar (e.g., "How should we price our monsoon getaway packages compared to Thomas Cook?").
4. Review the generated **Recommended Actions** and **Impact Scores**.

---

## Step 8: Configuring Automated Reports & Alerts
Keep your stakeholders informed automatically.

1. Navigate to the **Reports** tab.
2. Click **+ Schedule New Report**.
3. Choose the report type (e.g., "Executive Summary", "Pricing Audit").
4. Select the delivery frequency (Weekly/Monthly) and enter the email addresses of your agency leadership team.
5. Click **Schedule Delivery**. PDF and CSV summaries will now be dispatched automatically based on your criteria.
