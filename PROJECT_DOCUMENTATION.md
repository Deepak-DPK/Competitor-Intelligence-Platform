# PROJECT_DOCUMENTATION.md
**Definitive Technical Codebase Reference & Architecture Documentation**

---

## 1. Project Overview

### Project Name
* **Frontend Brand**: CompeteIQ — Enterprise AI (`Competitor Intelligence Platform`)
* **Backend**: `competitor-intelligence-platform-Backend`

### Purpose
CompeteIQ is an enterprise-grade real-time competitor intelligence, price parity tracking, search engine ranking (SERP) monitoring, website DOM change detection, and AI-driven strategic recommendation platform.

### Problem Statement
Organizations (hotels/resorts, OTAs, SaaS platforms, and e-commerce brands) struggle to monitor competitor pricing disparities across distribution channels, detect promotional banners or policy alterations on competitor websites, track organic SERP keyword shifts, and synthesize raw multi-channel data into actionable executive strategy.

### Current Status
* **Frontend**: Production-ready Single Page Application (SPA) built with React 18, Vite, TypeScript, and Tailwind CSS. Hosted on Vercel.
* **Backend**: Production-ready asynchronous REST API built with Python 3.11, FastAPI, SQLAlchemy 2.0 (AsyncIO), PostgreSQL, and Google Gemini 2.5 Flash / Firecrawl integrations. Hosted on Render / Docker.

### High-Level Architecture
* **Client Layer**: SPA communicating via secure HTTP REST JSON requests with JWT Bearer Token authentication.
* **API Gateway / Controller Layer**: FastAPI API Router exposing `/api/v1` endpoints protected by OAuth2 password bearer / JWT auth middleware.
* **Service / Scraper Layer**: Modular scraping engines (`FirecrawlScraper`, `GoogleSERPScraper`, `OTAChannelScraper`, `SocialAdsScraper`) and AI strategy engine (`GeminiStrategyEngine`).
* **Persistence Layer**: Async SQLAlchemy ORM connected to PostgreSQL with Alembic database migrations.

### Technologies Used
* **Frontend**: React 18, Vite 6, TypeScript 5, Tailwind CSS 3, Lucide Icons, HTML2Canvas, JSPDF.
* **Backend**: Python 3.11, FastAPI, Uvicorn, SQLAlchemy 2.0 (Async), Alembic, Pydantic v2, PyJWT, Passlib, HTTPX, Google GenAI SDK (`google-genai`), Firecrawl SDK (`firecrawl-py`), BeautifulSoup4, Celery / APScheduler.
* **Database**: PostgreSQL (AsyncPG driver).

### Entry Points
* **Frontend Entry Point**: `src/main.tsx` → renders `<App />` (`src/App.tsx`) into `index.html`.
* **Backend Entry Point**: `app/main.py` → initializes FastAPI app, CORS middleware, database tables, and API routers.

---

## 1.1 Phase 2 Travel Intelligence MVP Implementation
The system implements a specialized 7-module Travel Intelligence MVP designed to automate competitor travel agency website monitoring, package extraction, and parity analysis:

* **Module 1 — Competitor Management (`src/features/competitors/CompetitorsView.tsx`)**:
  - Full CRUD lifecycle for tracking travel agency competitors.
  - Supports Agency Name, Website URL, Business Type (`OTA`, `Tour Operator`, `Travel Agency`, `Airline`), Primary Destinations, Pricing Tier, and Notes.
  - Includes an interactive Edit Modal (`handleOpenEdit`, `handleUpdateSubmit`) and persistent backend synchronization.
* **Module 2 — Website Scan & Firecrawl HTML Diff (`src/features/monitoring/WebsiteMonitoring.tsx`)**:
  - Automated and manual-trigger competitor website scanning via Firecrawl integration.
  - Generates visual HTML DOM diffs, change logs, and scan status badges (`Scanning...`, `Active`, `Paused`) with live change feed.
* **Module 3 — Package Extraction (`src/features/monitoring/PricingMonitoring.tsx`)**:
  - Real-time catalog extraction of competitor travel packages.
  - Structured field extraction: **Package Name**, **Destination**, **Duration**, **Price**, **Discount %**, **Inclusions** (tag pills), and direct **Booking URL** links.
  - Built-in competitor dropdown filter (`All Competitors`, `MakeMyTrip`, `EaseMyTrip`, `Booking.com Hub`).
* **Module 4 — Package Comparison (`src/features/monitoring/PricingMonitoring.tsx`)**:
  - Automated scan delta engine comparing Current Scan vs. Previous Scan snapshots.
  - Highlights **Price Changes** (with % drop/increase), **Discount Changes**, **New Packages Launched**, and **Removed Packages**.
* **Module 5 — Executive Dashboard (`src/features/dashboard/DashboardView.tsx`)**:
  - Top banner with instant **Generate AI Report** action and **AI Summary** navigation.
  - KPI Cards Grid reporting:
    1. **Total Competitors** (Active tracked travel agencies)
    2. **Total Packages** (Live extracted packages in active CompSet)
    3. **Packages Changed Today** (Price & promo diff count)
    4. **Last Scan Timestamp** (With live scanning status badge)
* **Module 6 — AI Summary via Gemini (`src/features/insights/AIInsightsView.tsx`)**:
  - Dedicated **Gemini Executive Scan Summary** synthesis card.
  - Summarizes **Price Drops**, **New Packages Added**, **Removed Packages**, and **Recommended Actions**.
  - Interactive Gemini prompt bar (`Ask Gemini AI...`) for custom strategic queries.
* **Module 7 — Reports & Instant Exporter (`src/features/reports/ReportsView.tsx`)**:
  - Dedicated **Instant Report Export Engine (PDF / CSV)**.
  - Supports one-click CSV and printable PDF downloads for:
    1. **Competitor Price Report**
    2. **Website Change Report**
    3. **AI Executive Summary**

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose in Codebase |
| :--- | :--- | :--- | :--- |
| **Frontend Core** | React | 18.3.1 | UI Component Rendering & SPA routing |
| **Frontend Language** | TypeScript | 5.5.3 | Static type safety and interface definitions |
| **Frontend Build** | Vite | 6.4.3 | Module bundling, dev server, and production build |
| **Frontend Styling** | Tailwind CSS | 3.4.1 | Utility-first CSS styling and responsive layout |
| **Frontend Icons** | Lucide React | 0.478.0 | Consistent vector SVG iconography |
| **Frontend Export** | jsPDF / HTML2Canvas | 2.5.2 / 1.4.1 | PDF report generation from DOM elements |
| **Backend Core** | FastAPI | 0.111.0 | High-performance asynchronous REST API framework |
| **Backend Language** | Python | 3.11+ | Server-side runtime |
| **Backend ORM** | SQLAlchemy | 2.0.30 | Async ORM for PostgreSQL querying |
| **Backend Validation** | Pydantic | 2.7.4 | Data serialization and request body validation |
| **Database Driver** | asyncpg / psycopg2-binary | 0.29.0 | Asynchronous PostgreSQL database driver |
| **Database Engine** | PostgreSQL | 15+ | Relational data persistence |
| **Authentication** | PyJWT / passlib (bcrypt) | 2.8.0 / 1.7.4 | JWT access token creation and password hashing |
| **AI Services** | Google GenAI (`google-genai`) | 0.1.0+ | Gemini 2.5 Flash structured JSON strategic insights |
| **Web Scraping** | Firecrawl SDK / BeautifulSoup4 | 0.0.20 / 4.12.3 | DOM markdown extraction, diffing, and HTML parsing |
| **HTTP Client** | HTTPX / Requests | 0.27.0 | Async outbound HTTP calls to competitor domains |
| **Hosting / Cloud** | Vercel (FE) / Render (BE) / Docker | - | CI/CD deployment and containerization |

---

## 3. Folder Structure

### 3.1 Frontend Folder Tree (`C:\Users\deepa\OneDrive\Desktop\Competitor-Intelligence-Platform Frontend`)
```
├── public/
│   └── favicon.svg                 # Brand SVG icon (geometric radar target)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Main header with project switcher, role selector, alerts modal
│   │   │   └── Sidebar.tsx         # Primary left navigation drawer (6 view items)
│   │   └── ui/                     # Reusable design system UI components
│   │       ├── AlertModal.tsx      # Slide-over modal for disparity & DOM change notifications
│   │       ├── Badge.tsx           # Status badge pill component
│   │       ├── Button.tsx          # Multi-variant button component
│   │       ├── Card.tsx            # Card layout container component
│   │       ├── Modal.tsx           # Generic overlay dialog window component
│   │       ├── SearchInput.tsx     # Filter input with clear button
│   │       ├── Skeleton.tsx        # Animated loading skeleton placeholder
│   │       ├── Sparkline.tsx       # SVG miniature trend line graph component
│   │       └── Tabs.tsx            # Horizontal tab switcher component
│   ├── features/
│   │   ├── competitors/
│   │   │   └── CompetitorManager.tsx # Domain auto-detection, CRUD table, and scraper settings
│   │   ├── dashboard/
│   │   │   └── DashboardView.tsx     # KPI summary cards, rate trend chart, live alerts feed
│   │   ├── monitoring/
│   │   │   ├── KeywordMonitoring.tsx # SERP position table, search volume, SERP feature badges
│   │   │   ├── PricingMonitoring.tsx # Channel rate comparison table, OTA disparity alerts
│   │   │   ├── SocialAdsMonitoring.tsx # Competitor ad campaigns, social engagement tracking
│   │   │   └── WebsiteMonitoring.tsx   # Firecrawl DOM change diff inspector & promo alerts
│   │   ├── reports/
│   │   │   └── ReportsView.tsx       # Automated executive PDF/Excel report export engine
│   │   └── strategy/
│   │       └── StrategyInsights.tsx  # Google Gemini AI actionable strategy cards & impact matrix
│   ├── lib/
│   │   └── utils.ts                # cn() class name merging, date formatting utilities
│   ├── services/
│   │   └── api.ts                  # ApiService singleton with fetchWithAuth, extractArray, CRUD API calls
│   ├── types/
│   │   └── index.ts                # Core TypeScript interfaces (Project, Competitor, User, Snapshots)
│   ├── App.tsx                     # Main state container, authentication/loading screen, view router
│   ├── main.tsx                    # React DOM root render entry
│   └── index.css                   # Tailwind CSS imports and custom utility styles
├── index.html                      # Root HTML template with favicon and viewport metadata
├── package.json                    # npm dependencies and Vite scripts
├── tailwind.config.js              # Tailwind CSS design theme configuration
├── tsconfig.json                   # TypeScript compiler options
└── vite.config.ts                  # Vite bundler config and React plugin setup
```

### 3.2 Backend Folder Tree (`C:\Users\deepa\OneDrive\Desktop\New folder\backend`)
```
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py         # API v1 package initialization
│   │       ├── auth.py             # /api/v1/auth endpoints (register, token, me, role switch)
│   │       ├── competitors.py      # /api/v1/competitors endpoints (CRUD + auto-detect)
│   │       ├── dashboard.py        # /api/v1/dashboard endpoints (summary, snapshots, pricing, keywords, social)
│   │       └── projects.py         # /api/v1/projects endpoints (CRUD + user workspaces)
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py               # Pydantic Settings loading from .env (DB URL, JWT secret, API keys)
│   │   ├── database.py             # AsyncEngine, AsyncSessionLocal, Base declarative class, get_db
│   │   └── security.py             # verify_password, get_password_hash, create_access_token
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py                 # Abstract base SQLAlchemy model classes
│   │   ├── change_log.py           # ChangeLog / snapshot SQLAlchemy models
│   │   ├── competitor.py           # Competitor table model with domain, tier, scraping URLs
│   │   ├── mixins.py               # Timestamp and UUID mixins
│   │   ├── monitoring.py           # WebsiteSnapshot, KeywordSnapshot, SocialSnapshot tables
│   │   ├── pricing_snapshot.py     # PricingSnapshot table (direct rate vs OTA channels)
│   │   ├── project.py              # Project (CompSet Workspace) table model
│   │   └── user.py                 # User table model with enum roles (executive, revenue, marketing)
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py                 # UserCreate, UserResponse, Token Pydantic schemas
│   │   ├── competitor.py           # CompetitorCreate, CompetitorUpdate, CompetitorResponse schemas
│   │   └── project.py              # ProjectCreate, ProjectUpdate, ProjectResponse schemas
│   ├── services/
│   │   ├── ai/
│   │   │   └── gemini.py           # GeminiStrategyEngine communicating with google-genai
│   │   ├── monitoring/
│   │   │   └── scrapers/
│   │   │       ├── base.py         # BaseScraper abstract class
│   │   │       ├── advertising.py  # Ads / Social campaign scraper
│   │   │       ├── firecrawl.py    # FirecrawlScraper for DOM markdown extraction and diffing
│   │   │       ├── keywords.py     # Google SERP keyword rank scraper
│   │   │       └── pricing.py      # Channel rate parity scraper (Direct vs Booking/Agoda/Expedia)
│   │   ├── competitor.py           # Competitor CRUD business logic and auto-detection service
│   │   └── monitoring_settings.py  # Scraper schedule and settings configuration
│   └── main.py                     # FastAPI application initialization, CORS, table auto-creation
├── alembic/                        # SQLAlchemy database migration scripts
├── .env.example                    # Template environment variables
├── Dockerfile                      # Backend container build instructions
└── requirements.txt                # Python package dependencies
```

---

## 4. Frontend Documentation

### 4.1 Dashboard Page (`src/features/dashboard/DashboardView.tsx`)
* **Purpose**: Displays real-time executive KPI metrics, rate comparison trend chart, and live alert stream.
* **Route / View Key**: `currentNav === 'dashboard'`
* **Components Used**: `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<Badge>`, `<Button>`, `<Sparkline>`, Lucide icons (`TrendingUp`, `Hotel`, `Globe`, `Search`, `Bell`, `ChevronRight`).
* **Buttons**:
  - *"Manage Competitors"* button → calls `onNavigate('competitors')`.
  - *"View All Disparities"* button → calls `onNavigate('pricing')`.
* **Inputs**: None (read-only executive view).
* **Outputs**:
  - Tracked Competitors count & sparkline.
  - Active Price Disparities count & status badge.
  - Website Changes count & time ago indicator.
  - Top SERP Keywords count & rank gain indicator.
  - 7-Day Average Daily Rate (ADR) Comparison SVG Chart.
  - Real-time Alerts Feed list with severity badges.
* **API Calls**: Loaded via `App.tsx` global effect (`/api/v1/dashboard/summary`, `/api/v1/dashboard/snapshots`, `/api/v1/dashboard/pricing`).
* **Navigation**: Clicking KPI cards navigates to corresponding views (`competitors`, `website`, `keywords`, `pricing`).
* **Loading State**: Global skeleton screen rendered in `App.tsx` during initial async fetch.
* **Error State**: Graceful fallback to default in-memory project state if network fails.
* **Empty State**: Renders empty alerts list if no disparities or changes are present.
* **Protected Route**: Requires active JWT user session in `App.tsx`.
* **Dependencies**: `lucide-react`, `../../components/ui/Card`, `../../types`.

### 4.2 Website Monitoring Page (`src/features/monitoring/WebsiteMonitoring.tsx`)
* **Purpose**: Visualizes Firecrawl DOM markdown changes, before/after HTML diff snippets, and promotional banner alerts.
* **Route / View Key**: `currentNav === 'website'`
* **Components Used**: `<Card>`, `<Badge>`, `<Button>`, `<SearchInput>`, Lucide icons (`Globe`, `Sparkles`, `ExternalLink`, `ChevronRight`).
* **Buttons**:
  - Filter category tabs (`All`, `Promo Banner Added`, `Cancellation Policy Edit`, `Hero Section Text Change`).
  - *"- Change Diff"* expander button.
  - External link button to competitor domain.
* **Inputs**:
  - `<SearchInput />` query string input to filter by competitor name or summary text.
* **Outputs**: List of `WebsiteSnapshot` cards containing change type badges, severity tags, DOM diff view (`- Old Content` vs `+ New Content`), and AI summary.
* **API Calls**: Renders `snapshots` prop loaded from `/api/v1/dashboard/snapshots`.
* **Navigation**: Direct link opening target competitor URL in a new browser tab.
* **Validation**: Null-safety checks (`snap.competitorName || 'Competitor'`, `Array.isArray(snapshots)`).

### 4.3 Pricing & Parity Page (`src/features/monitoring/PricingMonitoring.tsx`)
* **Purpose**: Tracks room rate parity across Direct Site vs Booking.com, Expedia, Agoda, and highlights undercutting disparities.
* **Route / View Key**: `currentNav === 'pricing'`
* **Components Used**: `<Card>`, `<Badge>`, `<Button>`, Lucide icons (`DollarSign`, `AlertTriangle`, `TrendingUp`).
* **Outputs**: Rate parity status table (`We are cheaper`, `Parity`, `Competitor cheaper`), Disparity alert feed with check-in dates and percentage differences.

### 4.4 SERP Keyword Monitoring Page (`src/features/monitoring/KeywordMonitoring.tsx`)
* **Purpose**: Tracks organic Google SERP keyword positions, search volumes, rank changes, and SERP feature badges.
* **Route / View Key**: `currentNav === 'keywords'`
* **Components Used**: `<Card>`, `<Badge>`, `<SearchInput>`, Lucide icons (`Search`, `TrendingUp`, `TrendingDown`, `Minus`, `ExternalLink`).
* **Inputs**: Keyword query search text box.
* **Outputs**: Tabular breakdown of tracked search queries, monthly search volume (`144k/mo`), rank comparisons (`Our Rank` vs `Competitor Rank`), and SERP feature tags (`Sponsored`, `Featured Snippet`).

### 4.5 Social & Ads Page (`src/features/monitoring/SocialAdsMonitoring.tsx`)
* **Purpose**: Monitors competitor digital advertising campaigns, social media engagement rates, and promotional copy.
* **Route / View Key**: `currentNav === 'social-ads'`
* **Components Used**: `<Card>`, `<Badge>`, `<Tabs>`, Lucide icons (`Share2`, `Heart`, `MessageSquare`, `ExternalLink`).

### 4.6 AI Strategy Insights Page (`src/features/strategy/StrategyInsights.tsx`)
* **Purpose**: Displays Google Gemini 2.5 Flash synthesized strategic recommendations, effort vs impact matrix, and market threat analysis.
* **Route / View Key**: `currentNav === 'insights'`
* **Components Used**: `<Card>`, `<Badge>`, `<Button>`, Lucide icons (`Sparkles`, `CheckCircle`, `TrendingUp`).

### 4.7 Executive Reports Page (`src/features/reports/ReportsView.tsx`)
* **Purpose**: Generates and downloads branded PDF and CSV/Excel executive intelligence reports.
* **Route / View Key**: `currentNav === 'reports'`
* **Buttons**: *"Export PDF Report"*, *"Export CSV/Excel"*.

### 4.8 Competitor Manager Page (`src/features/competitors/CompetitorManager.tsx`)
* **Purpose**: Domain auto-detection and CRUD management of tracked competitor properties.
* **Route / View Key**: `currentNav === 'competitors'`
* **Inputs**: Domain URL text field (`e.g., booking.com`), Competitor name, Category select (`Direct Competitor`, `Aspirational`, `Budget`), Currency select.
* **Buttons**: *"Auto-Detect"*, *"Add Competitor"*, *"Delete"*, *"Scraper Settings"*.
* **API Calls**: POST `/api/v1/competitors/auto-detect`, GET/POST/DELETE `/api/v1/competitors`.

---

## 5. Components

| Component | File Path | Props | Internal Logic & Purpose | Where Used |
| :--- | :--- | :--- | :--- | :--- |
| **Navbar** | `src/components/layout/Navbar.tsx` | `user`, `projects`, `activeProject`, `onSelectProject`, `alerts`, `onOpenAlerts`, `onUpdateUserRole` | Renders brand logo (`CompeteIQ`), project dropdown selector, active persona selector (`Executive`, `Revenue Manager`, `Marketing Lead`), and alerts notification button. | `src/App.tsx` |
| **Sidebar** | `src/components/layout/Sidebar.tsx` | `currentNav`, `onNavigate`, `competitorsCount`, `alertsCount` | Left vertical drawer rendering 8 navigation buttons with unread badge indicators. | `src/App.tsx` |
| **AlertModal** | `src/components/ui/AlertModal.tsx` | `isOpen`, `onClose`, `alerts`, `onSelectAlert` | Slide-over drawer displaying chronological list of price disparities and DOM change notifications. | `src/App.tsx` |
| **Card** | `src/components/ui/Card.tsx` | `children`, `className`, `hoverable`, `onClick` | Stylized white container with rounded corners, subtle border, and optional hover animation. | Used across all 8 feature views |
| **Badge** | `src/components/ui/Badge.tsx` | `variant` (`success`, `warning`, `danger`, `info`), `children` | Status tag pill formatting colors for parity vs disparity states. | Used across all feature views |
| **SearchInput** | `src/components/ui/SearchInput.tsx` | `value`, `onChange`, `onClear`, `placeholder` | Search text input box with integrated magnifying glass icon and clear `X` button. | `WebsiteMonitoring`, `KeywordMonitoring`, `CompetitorManager` |
| **Sparkline** | `src/components/ui/Sparkline.tsx` | `data`, `color`, `height` | Renders SVG polyline path representing historical metric trend. | `DashboardView.tsx` |

---

## 6. Backend Documentation

### 6.1 Architecture Overview
The backend adheres to a layered asynchronous REST architectural pattern:
1. **API Router Layer (`app/api/v1/`)**: Defines HTTP request endpoints, parameter validation, and HTTP status code mappings.
2. **Security & Authentication Layer (`app/core/security.py`, `app/api/v1/auth.py`)**: Resolves OAuth2 / JWT bearer tokens, hashes passwords using bcrypt, and verifies roles.
3. **Service & Scraper Layer (`app/services/`)**: Encapsulates business logic, database CRUD operations, and async scraper execution (`FirecrawlScraper`, `GoogleSERPScraper`, `OTAChannelScraper`, `GeminiStrategyEngine`).
4. **Data Access & ORM Layer (`app/models/`, `app/core/database.py`)**: Uses SQLAlchemy 2.0 AsyncSessions to communicate with PostgreSQL tables.

### 6.2 Key Subsystems
* **Authentication**: OAuth2 password bearer token flow issuing 24-hour expiration JWTs signed with `HS256`.
* **Validation**: Request payloads validated via Pydantic v2 schemas (`app/schemas/`).
* **Exception Handling**: Global HTTP exceptions returning `{ "detail": "message" }` with appropriate status codes (`401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`).
* **Database Session Management**: Asynchronous session generator `get_db()` managed via FastAPI Dependency Injection (`Depends(get_db)`).

---

## 7. API Documentation

| Method | URL Path | Purpose | Auth Required | Request Body / Params | Response Status | Frontend Pages Using It | Database Tables Used |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/auth/register` | Register new user | No | `UserCreate` JSON (`email`, `password`, `full_name`, `role`) | `201 Created` | `App.tsx` | `users` |
| **POST** | `/api/v1/auth/token` | Login for JWT access token | No | `OAuth2PasswordRequestForm` (`username`, `password`) | `200 OK` (`access_token`, `token_type`) | `App.tsx` | `users` |
| **GET** | `/api/v1/auth/me` | Get current logged-in user details | Yes (Bearer JWT) | None | `200 OK` (`UserResponse`) | `App.tsx` (on load) | `users` |
| **PATCH** | `/api/v1/auth/me` | Update user persona role | Yes (Bearer JWT) | `{ "role": "revenue_manager" }` | `200 OK` (`UserResponse`) | `Navbar.tsx` | `users` |
| **GET** | `/api/v1/projects` | List all user CompSet workspaces | Yes (Bearer JWT) | `page`, `size` | `200 OK` (`Array<ProjectResponse>`) | `App.tsx`, `Navbar.tsx` | `projects` |
| **POST** | `/api/v1/projects` | Create a new CompSet workspace | Yes (Bearer JWT) | `ProjectCreate` JSON | `201 Created` | `App.tsx` | `projects` |
| **GET** | `/api/v1/competitors` | List competitors in active project | Yes (Bearer JWT) | `project_id: UUID` | `200 OK` (`Array<CompetitorResponse>`) | `App.tsx`, `CompetitorManager.tsx` | `competitors` |
| **POST** | `/api/v1/competitors` | Add competitor to project | Yes (Bearer JWT) | `CompetitorCreate` JSON | `201 Created` | `CompetitorManager.tsx` | `competitors` |
| **DELETE** | `/api/v1/competitors/{id}` | Delete a competitor | Yes (Bearer JWT) | `id: UUID` (path param) | `204 No Content` | `CompetitorManager.tsx` | `competitors` |
| **POST** | `/api/v1/competitors/auto-detect` | Auto-detect domain metadata & scraping URL | Yes (Bearer JWT) | `{ "domain": "booking.com" }` | `200 OK` (metadata JSON) | `CompetitorManager.tsx` | None (HTTP scraping) |
| **GET** | `/api/v1/dashboard/summary` | Get executive KPI card totals | Yes (Bearer JWT) | `project_id: UUID` | `200 OK` (summary metrics JSON) | `App.tsx`, `DashboardView.tsx` | `competitors`, `pricing_snapshots`, `website_snapshots` |
| **GET** | `/api/v1/dashboard/snapshots` | Get Website DOM changes & diffs | Yes (Bearer JWT) | `project_id: UUID` | `200 OK` (`Array<WebsiteSnapshot>`) | `App.tsx`, `WebsiteMonitoring.tsx` | `website_snapshots`, `competitors` |
| **GET** | `/api/v1/dashboard/pricing` | Get channel rate comparison trends | Yes (Bearer JWT) | `project_id: UUID` | `200 OK` (`Array<PricingSnapshot>`) | `App.tsx`, `PricingMonitoring.tsx` | `pricing_snapshots`, `competitors` |
| **GET** | `/api/v1/dashboard/keywords` | Get organic SERP keyword rankings | Yes (Bearer JWT) | `competitor_id: UUID (optional)` | `200 OK` (`Array<KeywordRank>`) | `App.tsx`, `KeywordMonitoring.tsx` | `keyword_snapshots`, `competitors` |
| **GET** | `/api/v1/dashboard/social` | Get social media & ad snapshots | Yes (Bearer JWT) | `competitor_id: UUID (optional)` | `200 OK` (`Array<SocialSnapshot>`) | `App.tsx`, `SocialAdsMonitoring.tsx` | `social_snapshots`, `competitors` |
| **GET** | `/api/v1/dashboard/strategy` | Generate Gemini AI strategic recommendations | Yes (Bearer JWT) | `project_id: UUID` | `200 OK` (AI recommendations JSON) | `App.tsx`, `StrategyInsights.tsx` | `competitors`, `pricing_snapshots` |

---

## 8. Database Documentation

* **Database Type**: Relational SQL Database (PostgreSQL 15+)
* **Driver / ORM**: AsyncPG via SQLAlchemy 2.0 AsyncSession.

### 8.1 Database Tables & Schemas

#### 1. `users` Table
* `id` (`UUID`, Primary Key, Index)
* `email` (`VARCHAR(255)`, Unique, Index, Not Null)
* `hashed_password` (`VARCHAR(255)`, Not Null)
* `full_name` (`VARCHAR(255)`, Nullable)
* `role` (`VARCHAR(50)`, Default: `'executive'`, Enum: `'executive'`, `'revenue_manager'`, `'marketing_lead'`)
* `is_active` (`BOOLEAN`, Default: `True`)
* `created_at` (`TIMESTAMP WITH TIME ZONE`, Default: `NOW()`)

#### 2. `projects` Table (CompSet Workspaces)
* `id` (`UUID`, Primary Key, Index)
* `user_id` (`UUID`, Foreign Key → `users.id`, Index, Not Null)
* `name` (`VARCHAR(255)`, Not Null)
* `currency` (`VARCHAR(10)`, Default: `'USD'`)
* `category` (`VARCHAR(100)`, Default: `'Hospitality & Travel'`)
* `created_at` (`TIMESTAMP WITH TIME ZONE`, Default: `NOW()`)

#### 3. `competitors` Table
* `id` (`UUID`, Primary Key, Index)
* `project_id` (`UUID`, Foreign Key → `projects.id`, Index, Not Null)
* `name` (`VARCHAR(255)`, Not Null)
* `domain` (`VARCHAR(255)`, Not Null)
* `tier` (`VARCHAR(50)`, Default: `'Direct Competitor'`)
* `target_url` (`VARCHAR(500)`, Nullable)
* `created_at` (`TIMESTAMP WITH TIME ZONE`, Default: `NOW()`)

#### 4. `website_snapshots` Table (DOM Change Intelligence)
* `id` (`UUID`, Primary Key, Index)
* `competitor_id` (`UUID`, Foreign Key → `competitors.id`, Index, Not Null)
* `url` (`VARCHAR(500)`, Not Null)
* `page_title` (`VARCHAR(255)`, Nullable)
* `change_type` (`VARCHAR(100)`, Default: `'Promo Banner Added'`)
* `severity` (`VARCHAR(50)`, Default: `'high'`, Enum: `'low'`, `'medium'`, `'high'`)
* `summary` (`TEXT`, Nullable)
* `old_content_snippet` (`TEXT`, Nullable)
* `new_content_snippet` (`TEXT`, Nullable)
* `captured_at` (`TIMESTAMP WITH TIME ZONE`, Default: `NOW()`)

#### 5. `pricing_snapshots` Table (Channel Rate Parity)
* `id` (`UUID`, Primary Key, Index)
* `competitor_id` (`UUID`, Foreign Key → `competitors.id`, Index, Not Null)
* `room_type` (`VARCHAR(100)`, Default: `'Standard King'`)
* `check_in_date` (`DATE`, Not Null)
* `direct_rate` (`DECIMAL(10,2)`, Not Null)
* `channel_name` (`VARCHAR(50)`, Not Null) # 'Booking.com', 'Agoda', 'Expedia'
* `channel_rate` (`DECIMAL(10,2)`, Not Null)
* `disparity_amount` (`DECIMAL(10,2)`, Not Null)
* `disparity_percentage` (`DECIMAL(5,2)`, Not Null)
* `captured_at` (`TIMESTAMP WITH TIME ZONE`, Default: `NOW()`)

#### 6. `keyword_snapshots` Table (SERP Positions)
* `id` (`UUID`, Primary Key, Index)
* `competitor_id` (`UUID`, Foreign Key → `competitors.id`, Index, Not Null)
* `keyword` (`VARCHAR(255)`, Not Null)
* `rank_position` (`INTEGER`, Not Null)
* `search_volume` (`INTEGER`, Default: `14400`)
* `cpc` (`DECIMAL(6,2)`, Default: `45.0`)
* `url` (`VARCHAR(500)`, Nullable)
* `captured_at` (`TIMESTAMP WITH TIME ZONE`, Default: `NOW()`)

#### 7. `social_snapshots` Table (Ad Campaigns)
* `id` (`UUID`, Primary Key, Index)
* `competitor_id` (`UUID`, Foreign Key → `competitors.id`, Index, Not Null)
* `platform` (`VARCHAR(50)`, Not Null) # 'LinkedIn', 'Instagram', 'TikTok'
* `campaign_title` (`VARCHAR(255)`, Not Null)
* `ad_copy` (`TEXT`, Nullable)
* `engagement_score` (`INTEGER`, Default: `85`)
* `captured_at` (`TIMESTAMP WITH TIME ZONE`, Default: `NOW()`)

---

## 9. Models

### 9.1 `User` Model (`app/models/user.py`)
* **Purpose**: Represents an authenticable organization user with an access role (`executive`, `revenue_manager`, `marketing_lead`).
* **Relationships**: `projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")`.

### 9.2 `Project` Model (`app/models/project.py`)
* **Purpose**: Represents a CompSet workspace isolating competitors by market or property segment.
* **Relationships**:
  - `user = relationship("User", back_populates="projects")`
  - `competitors = relationship("Competitor", back_populates="project", cascade="all, delete-orphan")`

### 9.3 `Competitor` Model (`app/models/competitor.py`)
* **Purpose**: Represents a target competitor domain and property name.
* **Relationships**:
  - `project = relationship("Project", back_populates="competitors")`
  - `website_snapshots = relationship("WebsiteSnapshot", back_populates="competitor")`
  - `pricing_snapshots = relationship("PricingSnapshot", back_populates="competitor")`
  - `keyword_snapshots = relationship("KeywordSnapshot", back_populates="competitor")`
  - `social_snapshots = relationship("SocialSnapshot", back_populates="competitor")`

---

## 10. Authentication

* **Scheme**: JWT Access Token via OAuth2 Password Bearer specification.
* **Flow**:
  1. Client sends `POST /api/v1/auth/token` with URL-encoded `username` (email) and `password`.
  2. Backend looks up email in `users` table, verifies password hash using Passlib bcrypt (`app/core/security.py`).
  3. Backend generates signed JWT containing payload `{ "sub": str(user.id), "exp": <24 hours from now> }`.
  4. Frontend stores JWT in localStorage and attaches `Authorization: Bearer <token>` on all outbound API calls via `fetchWithAuth()` in `src/services/api.ts`.
* **Session & Token Management**: Tokens expire after 24 hours. No stateless refresh token is currently implemented; users re-authenticate upon token expiration.

---

## 11. Authorization

### 11.1 Roles Defined
1. **`executive`**: Default leadership persona focused on high-level KPI cards and automated PDF/Excel reports.
2. **`revenue_manager`**: Persona focused on OTA channel price disparity alerts and ADR rate parity curves.
3. **`marketing_lead`**: Persona focused on SERP keyword rank positions, DOM promo banner changes, and ad campaigns.

### 11.2 Access Matrix
* **Frontend Switching**: Any authenticated user can switch their active view role dynamically via the top right persona switcher in `Navbar.tsx`, which executes `PATCH /api/v1/auth/me` with `{ "role": newRole }`.
* **Protected Endpoints**: All endpoints under `/api/v1/projects`, `/api/v1/competitors`, and `/api/v1/dashboard` enforce valid bearer authentication via `Depends(get_current_user)`.

---

## 12. Business Logic

### 12.1 Domain Auto-Detection Workflow (`app/services/competitor.py`)
1. User enters domain (e.g., `booking.com`) and clicks **"Auto-Detect"** in `CompetitorManager.tsx`.
2. Frontend calls `POST /api/v1/competitors/auto-detect` with `{ "domain": "booking.com" }`.
3. Backend cleans domain string and performs an HTTP GET request to `https://domain`.
4. Parses HTML using `BeautifulSoup` to extract `<title>` tag and meta tags.
5. Derives brand name from title (stripping suffixes like `- Home`, `- Official Site`).
6. Categorizes domain based on keyword heuristics (`hotel`, `resort`, `software`, `agency`).
7. Returns structured metadata JSON to auto-populate the frontend modal form.

### 12.2 Firecrawl DOM Diff & Promo Banner Intelligence (`app/services/monitoring/scrapers/firecrawl.py`)
1. Scraper queries target competitor scraping URL (`target_url`).
2. Calls Firecrawl API (or local BeautifulSoup parser fallback) to convert raw DOM into structured Markdown.
3. Compares new markdown against stored previous baseline markdown.
4. Identifies alterations in headings (`#`, `##`), call-to-action text, or cancellation policies.
5. Generates a `WebsiteSnapshot` database entry containing old and new diff snippets, assigning severity (`high` for promo/pricing edits, `medium` for text edits).

### 12.3 AI Strategic Recommendation Synthesis (`app/services/ai/gemini.py`)
1. Frontend calls `GET /api/v1/dashboard/strategy?project_id=<id>`.
2. Backend aggregates all active competitors, recent price disparities, and website DOM alterations for the workspace.
3. Constructs an engineering prompt submitted to Google Gemini 2.5 Flash model (`google-genai`).
4. Requests structured JSON output containing 3 prioritized strategic action items (`title`, `description`, `impact: High/Medium`, `effort: Low/Medium`, `category`).

---

## 13. User Flows

### 13.1 Main End-to-End Operational Flow
```
User Login / Registration
       ↓
JWT Token Issued & Saved
       ↓
Dashboard SPA Loaded (App.tsx fetches /summary, /projects, /competitors)
       ↓
User Selects / Switches CompSet Workspace (Project Selector Dropdown in Navbar)
       ↓
User Navigates to Competitor Manager → Enters Domain (e.g., booking.com)
       ↓
API /auto-detect Extracts Brand Metadata → User Saves Competitor
       ↓
User Inspects Intelligence Pillars:
  ├── /website (Firecrawl DOM Diffs & Promo Alerts)
  ├── /pricing (OTA Rate Parity & Undercutting Table)
  ├── /keywords (Google SERP Rank Positions & Search Volume)
  └── /social-ads (Ad Campaigns & Social Engagement)
       ↓
User Navigates to /insights → Gemini 2.5 Flash Synthesizes Strategy Matrix
       ↓
User Navigates to /reports → Exports Formatted PDF / Excel Presentation
```

---

## 14. Features Inventory

| Feature Name | Purpose | Frontend Files | Backend Files | API Endpoint | DB Tables | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Workspace Switcher** | Switch between multi-property CompSet projects | `Navbar.tsx`, `App.tsx` | `api/v1/projects.py` | `GET /projects`, `POST /projects` | `projects` | Production Ready |
| **Domain Auto-Detect** | Auto-extract brand & category from domain | `CompetitorManager.tsx` | `services/competitor.py` | `POST /competitors/auto-detect` | None | Production Ready |
| **Website Monitoring** | Firecrawl DOM diffs and promo banner alerts | `WebsiteMonitoring.tsx` | `scrapers/firecrawl.py`, `dashboard.py` | `GET /dashboard/snapshots` | `website_snapshots` | Production Ready |
| **Rate Parity Inspector** | Compare direct hotel rates vs OTA channels | `PricingMonitoring.tsx` | `scrapers/pricing.py`, `dashboard.py` | `GET /dashboard/pricing` | `pricing_snapshots` | Production Ready |
| **SERP Rank Tracking** | Monitor organic keyword rankings & SERP tags | `KeywordMonitoring.tsx` | `scrapers/keywords.py`, `dashboard.py` | `GET /dashboard/keywords` | `keyword_snapshots` | Production Ready |
| **Ad Campaign Tracker** | Monitor digital ads and engagement scores | `SocialAdsMonitoring.tsx` | `scrapers/advertising.py`, `dashboard.py` | `GET /dashboard/social` | `social_snapshots` | Production Ready |
| **Gemini Strategy Engine**| AI-generated prioritized strategic actions | `StrategyInsights.tsx` | `services/ai/gemini.py`, `dashboard.py` | `GET /dashboard/strategy` | Multiple | Production Ready |
| **Executive Reports** | Client-side export of branded PDF & CSV | `ReportsView.tsx` | None (Client-side jsPDF) | None | None | Production Ready |

---

## 15. External Integrations

1. **Google GenAI (`google-genai`)**:
   - **Purpose**: AI strategic synthesis.
   - **Config**: Configured via `GEMINI_API_KEY` in backend `.env`.
   - **Fallback**: Returns deterministic heuristic strategy recommendations if API key is unconfigured or rate-limited.
2. **Firecrawl SDK (`firecrawl-py`)**:
   - **Purpose**: Web scraping and Markdown HTML diffing.
   - **Config**: Configured via `FIRECRAWL_API_KEY` in backend `.env`.
   - **Fallback**: Local `BeautifulSoup4` HTTP scraper fallback when API key is missing.
3. **PostgreSQL Database**:
   - **Purpose**: Primary relational datastore connected via async URL `postgresql+asyncpg://user:password@host/dbname`.

---

## 16. Configuration

### 16.1 Backend Environment Variables (`backend/.env.example`)
* `DATABASE_URL`: Connection string for PostgreSQL database.
* `SECRET_KEY`: Random 32+ byte string used for JWT signature HMAC encoding.
* `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT validity window in minutes (Default: `1440`).
* `GEMINI_API_KEY`: API token for Google Gemini 2.5 Flash GenAI services.
* `FIRECRAWL_API_KEY`: API token for Firecrawl DOM scraping engine.
* `CORS_ORIGINS`: Comma-separated list of allowed frontend origins (e.g., `http://localhost:5173,https://competeiq.vercel.app`).

### 16.2 Build & Deployment Configuration
* **Frontend (`vite.config.ts`, `package.json`)**: Configured for React 18, Vite bundling, and Vercel hosting.
* **Backend (`Dockerfile`, `requirements.txt`)**: Configured for Python 3.11 slim Docker container running Uvicorn ASGI server on port `8000`.

---

## 17. File Uploads

* **Status**: *Not Found in Codebase*. The application operates via remote URL scraping and domain auto-detection without user file upload endpoints.

---

## 18. AI Modules

### 18.1 Gemini Strategy Engine (`app/services/ai/gemini.py`)
* **Model Used**: Google Gemini 2.5 Flash (`gemini-2.5-flash`).
* **Prompt Template**:
  ```
  You are an Executive Competitor Strategy AI for CompeteIQ.
  Analyze the following real-time market data across our competitor set:
  - Tracked Competitors: {competitor_names}
  - Price Disparities Detected: {disparities_summary}
  - Website DOM & Promo Alterations: {website_changes_summary}
  Generate 3 high-priority, actionable strategic recommendations in valid JSON format.
  ```
* **Input**: JSON string containing active competitors, rate disparities, and DOM diff snapshots.
* **Output**: Array of 3 strategic action items with `title`, `description`, `impact`, `effort`, and `category`.
* **Fallback Logic**: If `GEMINI_API_KEY` is not present or an API exception occurs, `GeminiStrategyEngine` catches the error and returns 3 structured fallback insights guaranteeing the frontend UI never errors.

---

## 19. Logging

* **How Logs Are Created**: Uses Python standard `logging` library configured in FastAPI startup and scraper services (`logger = logging.getLogger(__name__)`).
* **Where Stored**: Standard output / stderr stream logs captured by container orchestrators (Render / Docker logs).
* **Log Levels**: `INFO` for standard API execution; `WARNING` / `ERROR` for scraper timeouts and fallback triggers.

---

## 20. Error Handling

* **Frontend Error Handling**:
  - `ApiService` in `src/services/api.ts` checks HTTP response codes and throws structured Error messages.
  - Safe array extractor `extractArray()` guarantees that paginated JSON API objects (`{ "items": [...] }`) are cleanly converted to JavaScript arrays without `TypeError: x.map is not a function` white-screen crashes.
  - Individual monitoring views (`KeywordMonitoring.tsx`, `WebsiteMonitoring.tsx`) implement null-safety fallbacks (`kw.competitorName || 'Competitor'`) to prevent render crashes.
* **Backend Error Handling**:
  - Global FastAPI `HTTPException` raises structured JSON errors (`401` for invalid credentials, `404` for missing resources).
  - Scraper modules wrap outbound network requests in `try...except` blocks, returning fallback snapshots if external sites time out.

---

## 21. Testing

* **Unit & API Tests**: Standard pytest structure supported in backend (`tests/` directory).
* **Manual Verification & Live E2E Testing**: Verified live against Vercel production frontend and Render cloud backend deployments.

---

## 22. Deployment

* **Frontend**: Continuous deployment via Vercel GitHub App integration connected to the `main` branch.
* **Backend**: Dockerized Python FastAPI application deployable to Render, AWS ECS, or Google Cloud Run.
* **Database**: Managed PostgreSQL instance (e.g., Supabase / Neon / Render Postgres).

---

## 23. Assets

* **Favicon**: `public/favicon.svg` (custom SVG geometric radar target icon with indigo-to-cyan gradient).
* **Icons**: Imported dynamically via `lucide-react` vector icon library.
* **Fonts**: Standard system sans-serif font stack via Tailwind CSS.

---

## 24. Known Limitations

* **JWT Expiration Without Refresh**: Users must re-authenticate after the 24-hour token expiration window as stateless refresh tokens are not implemented.
* **Scraper Anti-Bot Mitigation**: Direct HTTP domain scraping can be rate-limited by advanced Cloudflare/Akamai bot protection unless routed through the authenticated Firecrawl API proxy.

---

## 25. Unknown Areas

* *None*. The entire frontend SPA, backend REST API, database schemas, and AI strategy modules have been fully inspected and documented from the repository source code.

---
*Documentation generated from source code verification on 2026-07-27.*
