# PAPEM - Sistema de Pesquisa de Clima Organizacional

## Overview
This is a React-based organizational climate survey application for PAPEM (Brazilian military organization). The application provides an anonymous survey platform with administrative dashboard for analyzing results.

## Current State
- ✅ Full-stack application with PostgreSQL database integration
- ✅ Frontend React application running on port 5000 (webview output)
- ✅ Backend Express.js API server running on port 3001
- ✅ PostgreSQL database configured with Drizzle ORM
- ✅ Real-time dashboard displaying live data from database
- ✅ Survey submission saves to database instead of console logging
- ✅ All TypeScript errors resolved
- ✅ Deployment configuration set up for production

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite (port 5000)
- **Backend**: Express.js + TypeScript (port 3001)
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui + Tailwind CSS + Radix UI
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom gradient themes
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization

## Key Features
- Anonymous organizational climate survey with 4 sections:
  1. Work Conditions, Service and TFM
  2. Relationships
  3. Motivation and Professional Development
  4. Comments and Suggestions
- Real-time administrative dashboard with live data visualization
- PostgreSQL database for persistent data storage
- REST API for survey submission and statistics
- Responsive design with modern UI/UX
- Form validation and progress tracking
- Data aggregation by sector, accommodation, and canteen location
- Satisfaction ratings with statistical analysis

## Running the Project
The application runs automatically with the configured workflow:
```bash
concurrently "npm run server" "vite --host 0.0.0.0 --port 5000"
```
- Frontend: http://0.0.0.0:5000 (accessible through Replit's preview)
- Backend API: http://localhost:3001
- Database: PostgreSQL via DATABASE_URL environment variable

## Recent Changes
- **2025-09-25**: Professional Report Export System
  - Added export functionality with professional HTML reports (easily convertible to DOC/PDF)
  - Professional report formatting with comprehensive data analysis
  - Real-time data extraction with proper date/time stamping in Portuguese
  - Complete satisfaction analysis with status indicators and recommendations
  - Export endpoint `/api/export` generates downloadable structured reports
  - Reports include executive summary, sector distribution, satisfaction analysis, and insights
  - Fixed file corruption issues and cleaned up codebase for stable operation
- **2025-09-24**: Complete full-stack integration
  - Converted from client-side demo to production-ready full-stack application
  - Configured PostgreSQL database with Drizzle ORM and proper schema
  - Created Express.js backend API with endpoints: /api/survey, /api/stats, /api/analytics
  - Updated survey submission to persist data to database instead of console logging
  - Replaced hardcoded dashboard data with real-time database queries
  - Created RealTimeStats component for live data visualization
  - Fixed analytics mapping to use correct rating scale ("Concordo/Discordo" vs "Satisfeito/Insatisfeito")
  - Validated end-to-end flow: survey submission → database storage → dashboard display
  - Set up concurrent workflow running both frontend (port 5000) and backend (port 3001)
- **2025-09-22**: Enhanced UI with compact visualizations
  - Replaced "Setor Mais Ativo" card with compact "Distribuição por Setor" card showing exact respondent counts
  - Converted location questions (Q8, Q12) from pie charts to full-width horizontal bar charts
  - Removed redundant large sector distribution section to optimize space usage

## User Preferences
- No specific user preferences documented yet

## Deployment Configuration
- Target: autoscale (configured for static site deployment)
- Build: `npm run build`
- Run: `npm run start`