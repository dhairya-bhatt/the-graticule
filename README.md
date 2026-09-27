# The Graticule

[![Build & Typecheck](https://github.com/dhairya-bhatt/the-graticule/actions/workflows/ci.yml/badge.svg)](https://github.com/dhairya-bhatt/the-graticule/actions/workflows/ci.yml)
[![Deployment](https://github.com/dhairya-bhatt/the-graticule/actions/workflows/deploy.yml/badge.svg)](https://github.com/dhairya-bhatt/the-graticule/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

> **Official Student-Led Geography & Earth Science Journal Web Platform**  
> *Queen's University Belfast &bull; Geography Society*  
> **Live Site**: [https://dhairya-bhatt.github.io/the-graticule/](https://dhairya-bhatt.github.io/the-graticule/)

---

## Overview

**The Graticule** is a high-performance web platform and digital archive for Queen's University Belfast's student-led geography journal. It unites archival cartographic aesthetics with contemporary web physics, providing an open-access platform for peer-reviewed student essays, spatial analysis, field reports, and foundational print editions.

---

## Key Features

### 1. Interactive 3D Orthographic Globe
- **Mathematical Spherical Projection**: Canvas-rendered orthographic globe rendering GeoJSON national boundaries (`world-boundaries.json`).
- **Tactile Inertial Physics**: Smooth momentum-based drag rotation, friction dampening, dynamic latitude/longitude coordinate readouts, and click-to-recenter mechanisms.
- **Graticule Coordinates**: Real-time meridian and parallel tracking calibrated to collegiate geographical coordinates (QUB Campus: `54.5844° N, 5.9340° W`).

### 2. Cartographic Navigation & Scroll-Reactive Compass
- **Dynamic Compass Rose**: Integrated navbar compass widget whose needle responds dynamically to vertical traversal through the archive.
- **Radial Menu Experience**: Full-screen navigation chart with fluid animations, esc-key capture, and zero-scroll locking.
- **Instant Archive Dismissal**: Micro-calibrated loading screen with seamless blend-out transitions and session caching for near-instant repeat visits.

### 3. Scholarly Publishing & Reading Experience
- **Multi-Category Journal Catalog**: Instant search across 47+ articles spanning Physical Geography, Geopolitics, Glaciology, Urban Geography, and Environmental Policy.
- **Academic Reader**: Formatted with Old English initial drop caps (`UnifrakturMaguntia`), responsive figure plates, academic citation anchors, and native Web Share integration.
- **Inaugural Edition Archive**: Complete digital showcase and interactive reader for the historic 2021/22 print volume.

### 4. Editorial Content Management
- **Integrated Editorial Center (`/admin/`)**: Complete in-browser authoring environment allowing editorial staff to draft, edit, publish, categorize, and archive research dispatches.
- **Author & Contributor Registry**: Comprehensive bio and affiliation management for student researchers and faculty advisors.
- **Data Portability**: Full JSON export and backup facilities for the entire article database.

### 5. Archival Cartographic Typography & Design
- **Signature Palette**: Archival paper white (`#FBF9F4`), deep university ink (`#0D1E18`), and high-contrast action emerald (`#14E281`).
- **Authentic Typefaces**:
  - Masthead Monogram & Title: **`UnifrakturMaguntia`**
  - Academic Serif: **`Newsreader`**
  - Collegiate Display: **`Bebas Neue`** & **`Archivo Black`**
  - User Interface: **`Plus Jakarta Sans`**

---

## Route Architecture

| Route | Purpose |
| :--- | :--- |
| `/` | Landing page featuring the 3D globe, latest dispatches, and mission statement |
| `/journal/` | Full searchable academic archive with category filters and article cards |
| `/post/?slug=<slug>` | Full academic dispatch reader with drop-caps, citations, and metadata |
| `/first-edition/` | Digital showcase and PDF archive of the founding 2021/22 print edition |
| `/editorial-team/` | Masthead of editors, faculty advisors, and student fellows |
| `/about/` | Institutional history, departmental acknowledgements, and physical scans |
| `/admin/` | Editorial control center for dispatch authoring and registry management |
| `/faq/` | Submission requirements, review standards, and publishing guidelines |
| `/help-resources/` | Support services, academic research directories, and student wellbeing |
| `/contact/` | Article submission portal and institutional inquiries |
| `/disclaimer/` | Cartographic disclaimers, boundary notices, and referencing rules |
| `/404.html` | Custom collegiate error boundary page |

---

## Technology Stack

- **Core**: Vanilla TypeScript (`strict: true`), HTML5, CSS3 Custom Properties
- **Build Engine**: [Vite 6](https://vitejs.dev/) with multi-page Rollup bundle optimization
- **Graphics**: HTML5 2D Canvas with spherical trigonometry algorithms
- **Typography**: Google Fonts with parallel preconnect optimization
- **SEO & Social**: Automated OpenGraph and Twitter card metadata with custom 1200x630 preview imagery

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher; Node 20 LTS recommended)
- [npm](https://www.npmjs.com/) (version 9 or higher)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/dhairya-bhatt/the-graticule.git
cd the-graticule

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will be served at `http://localhost:5173/`.

### Available Scripts

| Script | Purpose |
| :--- | :--- |
| `npm run dev` | Launches the Vite local dev server with Hot Module Replacement |
| `npm run build` | Compiles TypeScript and packages production bundles to `dist/` |
| `npm run preview` | Spins up a local web server to preview production builds |
| `npm run typecheck` | Validates static types across the entire TypeScript codebase |

---

## Supabase Cloud Database Integration

The Graticule supports seamless integration with [Supabase](https://supabase.com/) for cloud persistence, cross-device content management, and manuscript intake tracking:

1. **Database Schema**: Execute [`supabase_schema.sql`](supabase_schema.sql) in your Supabase project's SQL Editor. This initializes the `authors`, `posts`, and `submissions` tables with Row Level Security (RLS) and pre-seeds the 47 baseline articles and contributor profiles.
2. **Connecting Credentials**:
   - **Environment Variables**: Copy `.env.example` to `.env` and provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - **In-Browser Admin Panel**: Alternatively, go to `/admin/` &rarr; **Backup & Settings** &rarr; **Supabase Cloud Database** to input and verify your Project URL and Anon Key directly in the browser.
3. **Manuscript Intake**: Submissions made via the dispatch portal at `/contact/` dispatch a formatted editorial email to `thegraticule@outlook.com` and automatically log the manuscript details into the Supabase `submissions` table when connected.

---

## Deployment

The repository includes an automated GitHub Actions deployment pipeline in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) configured for GitHub Pages:

1. Push commits to `main`.
2. Ensure repository settings (**Settings** > **Pages** > **Build and deployment**) are set to **GitHub Actions**.
3. GitHub Actions builds and publishes the production site automatically to [dhairya-bhatt.github.io/the-graticule/](https://dhairya-bhatt.github.io/the-graticule/).

---

## License

This project is licensed under the [MIT License](LICENSE).

Published by **The Graticule Editorial Board** &copy; Queen's University Belfast.
