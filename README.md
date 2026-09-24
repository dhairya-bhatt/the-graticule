# The Graticule — Academic Geographic & Earth Science Journal

[![Build & Typecheck](https://github.com/the-graticule/the-graticule/actions/workflows/ci.yml/badge.svg)](https://github.com/the-graticule/the-graticule/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bundled with Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

An open-source, academic web publishing platform designed for geographical societies, cartographic institutes, and earth science departments. Combining tactile 19th-century archival paper typography with modern web physics and an interactive 3D graticule globe.

---

## Highlights & Features

### 1. Interactive 3D Canvas Globe
- **Custom Mathematical Spherical Projection**: Canvas-rendered orthographic globe with full GeoJSON national boundaries (`world-boundaries.json`).
- **Tactile Inertial Physics**: Smooth drag rotation with momentum, dampening, dynamic latitude/longitude tracking, and click-to-recenter.
- **Graticule Coordinates**: Live real-time meridian and parallel display keyed to collegiate geographical observatories.

### 2. Multi-Page Academic Journal Architecture
- **Instant Search & Category Filtering**: Filter dispatches across Physical Geography, Glaciology, Geopolitics, Cartography, and Climate Systems.
- **Sort by Recency**: Automatically prioritizes the latest dispatches across all editions.
- **Scholarly Prose Formatting**:
  - Distinctive Old English Blackletter drop-cap initial letters (`UnifrakturMaguntia`).
  - Fluid inline academic citations linked to formatted bibliography references.
  - Sized embedded photographic figures with archival captions.
  - Native Web Share API integration with clipboard copy fallback and toast confirmation.

### 3. Editorial & Admin Management Dashboard (`/admin/`)
- **Complete In-Browser CMS**:
  - **Create & Publish**: Draft new research dispatches with rich body HTML, cover images, read times, and author attribution.
  - **Edit & Delete**: Instant live editing of all existing articles.
  - **Author Management**: Add, update, and manage contributing authors, academic titles, affiliations, and bios.
  - **Database Backup & Export**: One-click JSON export of all posts and author records.
  - **State Storage**: Uses HTML5 `localStorage` / `sessionStorage` with instant fallback to baseline seed data (`src/data/posts.json`).

### 4. Classic Collegiate Design System
- **Archival Paper Aesthetic**: Warm tactile background palette (`#FBF9F4`) paired with deep university ink (`#08231A`).
- **Signature Action Green**: High-contrast modern accent green (`#14E281`) highlighting active states, tags, and interactive buttons.
- **Curated Typography**:
  - Masthead Monogram & Title: **`UnifrakturMaguntia`**
  - Editorial Headings: **`Cinzel`** & **`Playfair Display`**
  - Collegiate Kickers & Navigation: **`Outfit`**
  - Body Dispatches: **Georgia / Serif**

---

## Multi-Page Route Structure

The platform uses Vite's multi-page build configuration, producing clean, independent static pages:

| Route | Page Description |
| :--- | :--- |
| `/` | Landing page featuring the 3D globe, latest dispatches, and mission statement |
| `/journal/` | Complete academic archive with real-time search, filters, and article cards |
| `/post/?slug=<slug>` | Full academic dispatch reader with drop-caps, figures, and citations |
| `/admin/` | Secure editorial CMS dashboard for managing articles and authors |
| `/first-edition/` | Archival retrospective and founding volume documentation |
| `/editorial-team/` | Masthead of editors, faculty advisors, and student fellows |
| `/about/` | Institutional history, societal aims, and geographical mission |
| `/faq/` | Submission guidelines, peer review standards, and reader inquiries |
| `/help-resources/` | Cartographic datasets, style manuals, and research tools |
| `/contact/` | Academic inquiries, correspondence, and office coordinates |
| `/disclaimer/` | Cartographic disclaimers, boundary notices, and academic rights |
| `/404.html` | Custom collegiate 404 page |

---

## Tech Stack

- **Core**: Vanilla TypeScript (`strict: true`), HTML5, CSS3 Custom Properties
- **Build Tool**: [Vite 6](https://vitejs.dev/) with multi-page Rollup bundle optimization
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Data Engine**: JSON-backed local storage store (`src/data/store.ts`)
- **Fonts**: Google Fonts (`UnifrakturMaguntia`, `Cinzel`, `Playfair Display`, `Outfit`)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher; Node 20 LTS recommended)
- [npm](https://www.npmjs.com/) (version 9 or higher)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/the-graticule.git
cd the-graticule

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite development server with Hot Module Replacement |
| `npm run build` | Compiles TypeScript and builds all static pages to `dist/` |
| `npm run preview` | Starts a local server serving the production `dist/` build |
| `npm run typecheck` | Runs the TypeScript compiler check (`tsc --noEmit`) |

---

## Admin Dashboard

To access the editorial back-office:
1. Navigate to `http://localhost:5173/admin/` (or `<your-domain>/admin/`).
2. Log in with the default credentials:
   - **Username**: `admin`
   - **Password**: `graticule2021`
3. In the **Settings & Export** tab:
   - Change your administrator username and password.
   - Download a full JSON database backup of all dispatches and author profiles.
   - Reset the database back to initial baseline data at any time.

---

## Deployment

### Option 1: GitHub Pages (Automated via GitHub Actions)
This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Push your repository to GitHub.
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Every push to the `main` branch will automatically build and deploy your journal.

### Option 2: Vercel
1. Import your GitHub repository in [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Click **Deploy**.

### Option 3: Netlify
1. Connect your repository in [Netlify](https://netlify.com).
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Click **Deploy site**.

---

## Project Structure

```text
the-graticule/
├── .github/
│   └── workflows/
│       ├── ci.yml               # Automated TypeScript typecheck & build pipeline
│       └── deploy.yml           # Automated GitHub Pages deployment
├── public/
│   ├── favicon.svg              # Archival brass compass favicon
│   └── images/                  # Article photographs, maps, and logos
├── src/
│   ├── components/              # Shared navbar, footer, and UI modules
│   ├── data/
│   │   ├── authors.json         # Author profiles and institutional affiliations
│   │   ├── posts.json           # Baseline research dispatches and articles
│   │   ├── store.ts             # Dynamic CMS storage & authentication engine
│   │   └── world-boundaries.json# GeoJSON polygons for interactive 3D globe
│   ├── styles/
│   │   └── main.css             # Design tokens, collegiate layout, typography
│   ├── admin.ts                 # CMS dashboard controller
│   ├── home.ts                  # Landing page and 3D globe animation loop
│   ├── journal.ts               # Filter & search catalog controller
│   └── post.ts                  # Single dispatch reader controller
├── index.html                   # Landing page entry point
├── vite.config.ts               # Multi-page Rollup input configuration
├── tsconfig.json                # TypeScript compiler configuration
├── package.json                 # Dependencies and scripts
├── .gitignore                   # Ignored files (dist, node_modules, logs)
├── LICENSE                      # MIT Open Source License
├── CONTRIBUTING.md              # Contribution and article guidelines
├── SECURITY.md                  # Security and prototype storage policy
└── README.md                    # Project documentation
```

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Published by **The Graticule Editorial Board** © 2026.
