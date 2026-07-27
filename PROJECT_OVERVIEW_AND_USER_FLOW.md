# ResortIQ — Enterprise AI Competitor Intelligence & Price Parity Platform
## Project Overview, Real-Time Business User Flow & Complete Feature Implementations

---

## 🌟 1. Executive Summary: What This Project Is About

**ResortIQ (Competitor AI)** is a production-grade, real-time **Competitive Intelligence & Rate Parity Monitoring Platform** engineered for **Hotels, Luxury Resorts, Online Travel Agencies (OTAs), E-Commerce Brands, and SaaS Enterprises**.

In today's fast-moving digital economy, competitors change their prices, promotional banners, room packages, and checkout CTAs multiple times a day. Manually tracking dozens of competitor websites, OTAs (like Booking.com, Agoda, MakeMyTrip), and marketing channels is impossible.

### **How ResortIQ Solves This:**
1. **Automated DOM & Page Scraping (Firecrawl Engine)**: Continuously crawls competitor websites and OTA booking pages to detect subtle visual or textual alterations (e.g., hidden discounts, promo badges, policy changes).
2. **Real-Time Price Parity Auditing**: Compares your direct hotel/product rates against third-party OTA channels to catch **under-cutting violations** before they erode direct bookings.
3. **AI Strategy Engine (Google Gemini 2.5 Flash)**: Synthesizes thousands of raw data points into clear, actionable executive strategies (e.g., *"Agoda is undercutting your Deluxe Suite by 18% — issue a Rate Parity Notice and launch a complimentary breakfast direct booking promotion"*).

---

## 🗺️ 2. Complete Real-Time User Flow (Step-by-Step Guide)

Below is the exact **end-to-end real-time user flow** for how a **Revenue Manager**, **Hotel General Manager**, or **OTA Strategy Lead** uses this platform in daily business operations:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. LOGIN & PERSONA SELECTION                                           │
│    User logs in and selects role (Revenue Manager / Marketing / Exec)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. CHOOSE / CREATE COMPSET WORKSPACE (PROJECT SELECTOR)                │
│    Isolate competitors by property (e.g., "Taj Exotica Resort Goa")    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. ADD COMPETITORS (AI DISCOVERY OR AUTO-DETECT BY DOMAIN)             │
│    Enter domain -> AI detects industry & auto-fills scraping targets   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. REAL-TIME MULTI-CHANNEL MONITORING                                  │
│    ├─ Website Changes (DOM diffs, promo banners, CTA tweaks)           │
│    ├─ Pricing & Rate Parity (Direct vs. OTA disparity charts)          │
│    ├─ Keyword Ranks (Google SERP ranking comparisons)                  │
│    └─ Social & Ads Monitoring (Active meta/search ad campaigns)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. AI STRATEGY ENGINE & ALERT RESOLUTION                               │
│    Gemini AI generates actionable counter-strategies & alert notices   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 6. AUTOMATED EXECUTIVE REPORTING (PDF / EXCEL EXPORT)                  │
│    Export branded presentations for ownership and asset managers       │
└────────────────────────────────────────────────────────────────────────┘
```

---

### **Step 1: User Login & Role Selection**
- The user signs into the platform and selects their **Operational Persona** in the top navbar (`Revenue Manager`, `Product Manager`, `Marketing Team`, `Business Analyst`).
- **Why it matters**: Adapts the workspace terminology and prioritizes either pricing disparity alerts (for Revenue Managers) or ad campaigns/keywords (for Marketing teams).

---

### **Step 2: Switching CompSet Workspaces (The Project Dropdown)**
- In the top-left Navbar, the user clicks **"Switch CompSet Workspace"** (`Taj Exotica Resort & Spa Goa`).
- **Real-Time Use Case**: A hotel group owns 15 different properties across India/Europe. Instead of mixing 100+ competitors in one screen, each **Project Workspace** represents a distinct **Competitive Set (CompSet)**:
  - *Workspace A*: `"Taj Exotica Resort Goa"` (Monitors Goa beach resorts: *Leela Goa*, *Alila Diwa*).
  - *Workspace B*: `"Taj Lake Palace Udaipur"` (Monitors heritage palaces: *Oberoi Udaivilas*).
- Clicking a project instantly scopes all charts, alerts, and AI insights to that specific property.

---

### **Step 3: Discovering & Adding Competitors**
- The user navigates to the **Competitors** tab. They have three ways to add competitors:
  1. **✨ AI Discover Button**: Type any domain (`makemytrip.com`, `indigo.in`, `nike.com`, `zomato.com`, `stripe.com`). The AI detects the industry and automatically suggests 3–5 real-world competitors with confidence scores and strategic rationale.
  2. **✨ Auto-Detect by Domain**: In the **+ Add Competitor** modal, type a domain (`booking.com`) and press `Tab` or click **Auto-Detect**. It automatically formats the name (`Booking.com`), selects the category (`Direct OTA`), and configures the scraping URL.
  3. **Manual Entry**: For custom or boutique landing pages.

---

### **Step 4: Real-Time Intelligence Monitoring (The 4 Pillars)**

#### **A. Website Changes (`/website`) — *Firecrawl DOM Extractor***
- **What it does**: Displays a live feed of page alterations across competitor websites.
- **How to use**: 
  - Click any snapshot item on the left **Timeline Feed**.
  - The right-hand **Visual Inspector** highlights the exact change type (`CTA Changed`, `Promo Banner Added`, `Cancellation Policy Edit`, `Price Badge Moved`), diff percentage, and displays the **before/after HTML snippet**.
- **Real-Time Business Value**: Immediately alerts you if a competitor silently adds a *"Stay 3 Nights, Get 1 Free"* promo banner or relaxes their cancellation policy ahead of a holiday weekend.

#### **B. Pricing & Parity (`/pricing`) — *Rate Auditing Engine***
- **What it does**: Tracks daily pricing trends and highlights **Rate Parity Violations**.
- **How to use**:
  - View the **Daily Price Trend Chart** comparing your rate against the Competitor Average, Market Low, and Market High.
  - Review **Active Rate Disparities**: See instances where third-party OTAs (Booking.com, Agoda, Expedia) sell your inventory at cheaper rates than your direct website.
- **Real-Time Business Value**: Prevents revenue leakage by allowing revenue managers to issue instant parity notices to OTA account managers.

#### **C. Keyword Ranks (`/keywords`) — *SERP Intelligence***
- **What it does**: Compares search engine rankings across high-intent keywords (`"luxury beach resort goa"`, `"5 star hotel south goa"`).
- **Real-Time Business Value**: Helps marketing teams adjust Google Hotel Ads bid multipliers when a competitor overtakes your rank.

#### **D. Social & Ads (`/social-ads`) — *Ad Campaign Tracker***
- **What it does**: Captures competitor promotional posts and active search/display ads.
- **Real-Time Business Value**: Reveals competitor marketing messaging and seasonal ad spend.

---

### **Step 5: AI Strategy Engine & Alerts**
- Navigate to **AI Strategy Engine (`/insights`)**.
- Click **✨ Generate AI Strategic Strategy**. Google Gemini 2.5 Flash analyzes your current rate disparities, website diffs, and competitor ratings to output:
  - **Executive Title & Summary**
  - **3 Prioritized Action Items** (e.g., *"Launch complimentary airport transfer incentive to offset Agoda discount"*).
  - **Confidence Score & Impact Rating**.
- Navigate to **Alerts & Threats (`/alerts`)** to mark notifications as read or clear resolved parity violations.

---

### **Step 6: Automated Executive Reporting**
- Navigate to **Executive Reports (`/reports`)**.
- Configure custom reporting periods (Daily, Weekly, Monthly) and export ready-to-present **PDF Executive Briefs** or **Excel Raw Data sets** for ownership meetings.

---

## 🛠️ 3. Comprehensive Feature Implementations Done

| Feature Area | Implementation & Architecture Details | Status |
| :--- | :--- | :--- |
| **Zero-Config Cloud Deployment** | Configured `vercel.json` (SPA rewrites, Vite build output) and `render.yaml` (FastAPI Dockerized service with auto-migrations). | ✅ **Production Ready** |
| **CompSet Workspace Switcher** | Dropdown in Navbar with `(Array.isArray(projects) ? projects : []).map(...)` safety, clear business labeling (`Switch CompSet Workspace`), and project-scoped data filtering. | ✅ **Implemented & Bug-Free** |
| **Multi-Industry AI Competitor Discovery** | Regex + AI detection engine supporting **Hotels/Resorts**, **Travel/OTAs**, **Airlines**, **Food Delivery**, **E-Commerce**, and **Fintech/SaaS** domains. | ✅ **Implemented** |
| **Add Competitor Auto-Detect** | Added **✨ Auto-Detect** button and `onBlur` listener to instantly extract brand name, category, and scraping URL from raw domain inputs. | ✅ **Implemented** |
| **Website Changes Monitoring** | Aligned backend `/api/v1/dashboard/snapshots` with frontend `WebsiteSnapshot` TypeScript interface (`competitorName`, `pageTitle`, `pageUrl`, `changeType`, `severity`, `summary`, `beforeSnippet`, `afterSnippet`). | ✅ **Implemented & Bug-Free** |
| **Price Parity & Trend Analytics** | SQLAlchemy backend queries joining `PricingSnapshot` and `Competitor` to calculate real-time market averages, lows, highs, and OTA disparities. | ✅ **Implemented** |
| **Google Gemini 2.5 AI Integration** | `GeminiService` in backend generating strategic hotel/OTA pricing and marketing recommendations with automated fallback logic. | ✅ **Implemented** |
| **Real-Time Scraping Trigger** | Trigger Scan button (`/api/v1/competitors/{id}/scan`) that initiates Firecrawl DOM scraping and saves snapshots to PostgreSQL/SQLite database. | ✅ **Implemented** |
| **Alerts & Report Generation** | Full CRUD endpoints for reading alerts, clearing project notifications, and saving custom report schedules. | ✅ **Implemented** |

---

## 🐞 4. Summary of Recent Bug Fixes (Why White Screens Occurred)

1. **Project Selector White Screen Bug**:
   - *Cause*: Calling `projects.map` on an object when backend returned paginated JSON `{ "items": [...] }`.
   - *Fix*: Created global `extractArray(res)` helper in `src/services/api.ts` to unwrap `.items`/`.data` automatically and safeguarded Navbar rendering.
2. **Website Changes White Screen Bug**:
   - *Cause*: Backend `/api/v1/dashboard/snapshots` was missing required frontend properties (`competitorName`, `pageTitle`, `pageUrl`, `changeType`).
   - *Fix*: Updated backend endpoint to join `Competitor` and return complete snapshot schemas; added null-safety fallbacks in `WebsiteMonitoring.tsx`.
3. **AI Discovery Modal ReferenceError**:
   - *Cause*: Unbound variable `domain` in JS fallback block.
   - *Fix*: Replaced with correct `website` state variable and added 6-industry auto-detection.

---
*Created by Antigravity AI for the ResortIQ Enterprise Intelligence Platform.*
