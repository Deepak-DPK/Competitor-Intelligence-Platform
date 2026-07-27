# CompeteIQ — AI Travel Agency Intelligence Platform

CompeteIQ is a full-stack SaaS platform designed for travel agencies, OTAs, and tour operators to monitor competitor pricing, track holiday package deals, analyze website changes, and generate AI-powered executive summaries.

## System Architecture

This system is divided into two distinct repositories to separate concerns and allow independent scaling:
- **[Frontend (This Repository)](https://github.com/Deepak-DPK/Competitor-Intelligence-Platform)**: A responsive single-page application (SPA) built with React 18, Vite, Tailwind CSS, and Recharts.
- **[Backend Repository](https://github.com/Deepak-DPK/competitor-intelligence-platform-Backend)**: A high-performance Python FastAPI service backed by PostgreSQL (asyncpg), Supabase Auth, and integrated with Firecrawl and Google Gemini APIs.

## Core Features
1. **Travel Workspaces**: Isolate competitive intelligence by market or business unit (e.g., "Global Travel Agency Workspace").
2. **Real-Time Website Scanning**: Uses the Firecrawl API to scrape competitor domains and visually diff HTML to detect structural and promotional changes.
3. **Pricing & Parity Monitoring**: Extracts package prices, identifies rate parity violations, and tracks daily historical pricing trends.
4. **AI Executive Summaries**: Leverages Google Gemini 1.5 Pro to synthesize raw competitor data into actionable strategic insights.
5. **Automated Reporting**: Configurable PDF and CSV exports for stakeholder distribution.

## Documentation Reference

To keep the repository clean, temporary implementation reports have been removed. The following core documentation remains:

* **`PROJECT_DOCUMENTATION.md`**: This is the master technical specification document for the entire platform. It contains:
  - Complete architectural breakdown
  - API schemas and contracts
  - Database Entity-Relationship (ERD) design
  - Detailed component interactions and deployment diagrams
  *Note: Refer to this file for any deep technical queries or onboarding.*

## Quick Start (Frontend Local Development)

### Prerequisites
- Node.js 18+ or Bun
- A running instance of the backend API

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create your environment file:
   ```bash
   cp .env.example .env
   ```
3. Set your backend API URL in `.env`:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Cloud Deployment

This frontend is optimized for deployment on Vercel or Netlify. 
- Ensure the Build Command is set to `npm run build` or `vite build`.
- Ensure the Output Directory is set to `dist`.
- Set the `VITE_API_URL` environment variable in your hosting provider's dashboard to point to your deployed Render backend URL.
- **Note:** Single Page Applications (SPAs) require all traffic to be redirected to `index.html`. This is handled automatically by Vercel.
