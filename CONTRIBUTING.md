# Contributing to The Graticule

Thank you for your interest in contributing to **The Graticule** — an open-source academic geographic and earth science journal publication platform.

Whether you are improving the web codebase, fixing styling and responsive behavior, or submitting academic dispatches and research articles, we welcome your contributions!

---

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Development Setup](#development-setup)
3. [Branching & Commit Guidelines](#branching--commit-guidelines)
4. [Submitting Articles & Dispatches](#submitting-articles--dispatches)
5. [Pull Request Process](#pull-request-process)
6. [Design & Typography Standards](#design--typography-standards)

---

## Code of Conduct

We are committed to providing a friendly, respectful, and inclusive environment for everyone. Please be considerate, constructive, and academic in all communications and reviews.

---

## Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Git**

### Installation
```bash
# Clone your fork of the repository
git clone https://github.com/<your-username>/the-graticule.git
cd the-graticule

# Install dependencies
npm install

# Start local development server with hot-module reloading
npm run dev

# Run TypeScript type-checker
npm run typecheck

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Branching & Commit Guidelines

1. Create a feature branch off `main`:
   ```bash
   git checkout -b feature/cartographic-update
   # or
   git checkout -b fix/bibliography-styling
   ```
2. Write clear, conventional commit messages:
   - `feat: add coordinate crosshairs to 3D globe`
   - `fix: correct mobile menu viewport height constraint`
   - `docs: update deployment guidelines in README`
   - `content: add new dispatch on glacial hydrology`

---

## Submitting Articles & Dispatches

Articles are stored in [`src/data/posts.json`](src/data/posts.json). When contributing an article:
1. Ensure the article contains accurate geographic references and proper academic citations.
2. Follow the dispatch schema:
   ```json
   {
     "id": 10,
     "slug": "your-article-slug",
     "title": "Full Article Title in Title Case",
     "author": "Author Name",
     "authorTitle": "Departmental Title (e.g. Lead Glaciologist)",
     "authorAffiliation": "University or Institute Affiliation",
     "authorBio": "Brief 1-2 sentence academic biography",
     "date": "YYYY-MM-DD",
     "readTime": "X min read",
     "excerpt": "Compelling 1-2 sentence summary of the findings.",
     "coverImage": "/images/your-cover-image.webp",
     "categories": ["Glaciology", "Physical Geography"],
     "url": "/post/?slug=your-article-slug",
     "contentLength": 1850,
     "bodyHtml": "<p>Article HTML content with semantic markup...</p>"
   }
   ```
3. Place any associated images, maps, or figures in `public/images/`.

---

## Design & Typography Standards

- **Brand Typography**:
  - Masthead Monogram & Landing Headline: **`UnifrakturMaguntia`** (Old English Blackletter)
  - Primary Headings & Subtitles: **`Cinzel`** & **`Playfair Display`**
  - Collegiate Kicker & Tags: **`Outfit`** (uppercase letter-spacing: `0.08em`+)
  - Body Prose: Georgia / System serif for optimal reading rhythm
- **Signature Palette**:
  - Archival Paper Background: `#FBF9F4`
  - Action Green Accent: `#14E281` (`var(--c-neon-green)`)
  - Deep Academic Ink: `#08231A` (`var(--c-ink)`)
  - Crisp Architectural Border: `#D8D2C5` (`var(--c-border)`)

---

## Pull Request Process

1. Run `npm run typecheck` to ensure there are no TypeScript errors.
2. Run `npm run build` to verify the multi-page static site builds without warnings.
3. Submit a Pull Request targeting the `main` branch with a clear summary of your changes.
4. Continuous Integration (CI) will automatically validate the build and type checking.
