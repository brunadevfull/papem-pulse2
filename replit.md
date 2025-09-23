# PAPEM - Sistema de Pesquisa de Clima Organizacional

## Overview
This is a React-based organizational climate survey application for PAPEM (Brazilian military organization). The application provides an anonymous survey platform with administrative dashboard for analyzing results.

## Current State
- ✅ Frontend application successfully configured for Replit environment
- ✅ Running on port 5000 with proper host configuration (0.0.0.0)
- ✅ Workflow configured for webview output
- ✅ All dependencies installed and working
- ✅ Client-side only application (no backend required)

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS + Radix UI
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom gradient themes
- **Icons**: Lucide React

## Key Features
- Anonymous organizational climate survey with 4 sections:
  1. Work Conditions, Service and TFM
  2. Relationships
  3. Motivation and Professional Development
  4. Comments and Suggestions
- Administrative dashboard with data visualization
- Responsive design with modern UI/UX
- Form validation and progress tracking
- Client-side data handling (simulated submissions)

## Running the Project
The application runs automatically with the configured workflow:
```bash
npm run dev
```
- Serves on: http://0.0.0.0:5000
- Output: webview (accessible through Replit's preview)

## Recent Changes
- **2025-09-22**: Initial Replit environment setup
  - Configured Vite server for host 0.0.0.0:5000
  - Set up workflow for webview output
  - Verified all dependencies and functionality
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